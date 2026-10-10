// 原创关卡生成器：node tools/generate-levels.js
// 读取分级词表 tools/words.tsv（由 build-wordlist.py 从 ECDICT 生成），
// 按每册的「难度比例」挑选目标词，输出 5 册关卡 data/levels.js 与词典 data/dictionary.js
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PER_BOOK = 300, DAILY = 366;

/* 词汇难度 5 档：1 非常常用 / 2 常用 / 3 一般 / 4 罕见 / 5 非常罕见
   每册的 mix 是目标词在各档中的占比（百分比） */
const BOOKS = [
  { name: '第一册', sub: '入门', mix: [100, 0, 0, 0, 0] },
  { name: '第二册', sub: '简单', mix: [50, 50, 0, 0, 0] },
  { name: '第三册', sub: '普通', mix: [20, 40, 40, 0, 0] },
  { name: '第四册', sub: '困难', mix: [10, 20, 30, 40, 0] },
  { name: '第五册', sub: '专家', mix: [5, 15, 20, 30, 30] },
];
const DAILY_MIX = [40, 40, 20, 0, 0];

/* ---------- 词表 ---------- */
const gloss = {}, tierOf = {};
for (const line of fs.readFileSync(path.join(__dirname, 'words.tsv'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z]{3,8})\t([1-5])\t(.*)$/);
  if (m) { gloss[m[1]] = m[3]; tierOf[m[1]] = +m[2]; }
}
const WORDS = Object.keys(gloss).sort();
const byLenTier = {};   // byLenTier[长度][档位] = [...]
WORDS.forEach(w => {
  const a = byLenTier[w.length] = byLenTier[w.length] || {};
  (a[tierOf[w]] = a[tierOf[w]] || []).push(w);
});
const MAXLEN = Math.max(...WORDS.map(w => w.length));

const trie = {};
for (const w of WORDS) {
  let n = trie;
  for (const ch of w) n = n[ch] = n[ch] || {};
  n.$ = w;
}

/* ---------- 随机数（可复现） ---------- */
function mulberry32(a) {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
let rnd = mulberry32(1);
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = a => a[Math.floor(rnd() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- 网格工具 ---------- */
function neighbors(i, W, H) {
  const r = Math.floor(i / W), c = i % W, out = [];
  if (r > 0) out.push(i - W);
  if (r < H - 1) out.push(i + W);
  if (c > 0) out.push(i - 1);
  if (c < W - 1) out.push(i + 1);
  return out;
}
function smallestComponent(empty, W, H) {
  const seen = new Set(); let min = Infinity;
  for (const s of empty) {
    if (seen.has(s)) continue;
    let size = 0; const st = [s]; seen.add(s);
    while (st.length) {
      const x = st.pop(); size++;
      for (const y of neighbors(x, W, H)) if (empty.has(y) && !seen.has(y)) { seen.add(y); st.push(y); }
    }
    min = Math.min(min, size);
  }
  return min;
}

/* 在空格里随机走出一条长度为 L 的路径，且剩余空格不能被切成小于 3 的碎块 */
function randomWalk(empty, L, W, H) {
  const starts = shuffle([...empty]).sort((a, b) =>
    neighbors(a, W, H).filter(x => empty.has(x)).length - neighbors(b, W, H).filter(x => empty.has(x)).length);
  let budget = 3000;
  for (const s of starts.slice(0, 4)) {
    const p = [s], used = new Set([s]);
    const ok = (function dfs() {
      if (--budget < 0) return false;
      if (p.length === L) {
        const rest = new Set([...empty].filter(x => !used.has(x)));
        return rest.size === 0 || smallestComponent(rest, W, H) >= 3;
      }
      for (const n of shuffle(neighbors(p[p.length - 1], W, H))) {
        if (!empty.has(n) || used.has(n)) continue;
        p.push(n); used.add(n);
        if (dfs()) return true;
        p.pop(); used.delete(n);
      }
      return false;
    })();
    if (ok) return p;
  }
  return null;
}

/* 按比例挑档位：mix 为各档占比，have 为已选各档数量，优先补缺口最大的档 */
function tierByDeficit(mix, have, total, avail) {
  let best = 0, bestGap = -Infinity;
  for (let t = 1; t <= 5; t++) {
    if (!mix[t - 1] || !avail(t)) continue;
    const gap = mix[t - 1] / 100 * (total + 1) - have[t] + rnd() * 0.3;
    if (gap > bestGap) { bestGap = gap; best = t; }
  }
  return best;
}

/* 用词表单词铺满整个网格（铺底词同样遵循比例） */
function fillGrid(W, H, cfg) {
  const N = W * H, grid = Array(N).fill(null), fills = [], used = new Set();
  const have = [0, 0, 0, 0, 0, 0];
  const empty = new Set([...Array(N).keys()]);
  const maxLen = Math.min(MAXLEN, cfg.maxLen);
  while (empty.size) {
    const n = empty.size;
    const lens = [];
    for (let L = 3; L <= Math.min(maxLen, n); L++) if ((n - L === 0 || n - L >= 3) && byLenTier[L]) lens.push(L);
    if (!lens.length) return null;
    const L = fills.length === 0 ? lens[lens.length - 1 - Math.floor(rnd() * Math.min(2, lens.length))] : pick(lens);
    const t = tierByDeficit(cfg.mix, have, fills.length, tt => (byLenTier[L][tt] || []).length > 0);
    if (!t) return null;
    let w = null;
    for (let k = 0; k < 20 && !w; k++) { const c = pick(byLenTier[L][t]); if (!used.has(c)) w = c; }
    if (!w) return null;
    const p = randomWalk(empty, L, W, H);
    if (!p) return null;
    used.add(w); have[t]++;
    p.forEach((c, k) => { grid[c] = w[k]; empty.delete(c); });
    fills.push({ w, p });
  }
  return { grid, fills };
}

/* 找出网格里所有能连出来的词表单词 */
function findWords(grid, W, H) {
  const found = new Map();
  const used = new Uint8Array(grid.length), p = [];
  function dfs(i, node) {
    const nx = node[grid[i]];
    if (!nx) return;
    used[i] = 1; p.push(i);
    if (nx.$) {
      if (!found.has(nx.$)) found.set(nx.$, []);
      found.get(nx.$).push(p.slice());
    }
    for (const n of neighbors(i, W, H)) if (!used[n]) dfs(n, nx);
    used[i] = 0; p.pop();
  }
  for (let i = 0; i < grid.length; i++) dfs(i, trie);
  return found;
}

/* 目标词的档位分布与比例的偏差（越小越好） */
function mixError(words, mix) {
  const n = words.length; let e = 0;
  for (let t = 1; t <= 5; t++) e += Math.abs(words.filter(w => tierOf[w] === t).length / n - mix[t - 1] / 100);
  return e;
}

/* ---------- 单个关卡 ---------- */
let nextId = 1;
function makeLevel(cfg) {
  const { W, H } = cfg;
  let best = null;
  for (let attempt = 0; attempt < 120; attempt++) {
    const f = fillGrid(W, H, cfg);
    if (!f) continue;
    const found = findWords(f.grid, W, H);
    const fillSet = new Set(f.fills.map(x => x.w));
    const pool = shuffle([...found.keys()].filter(w => !fillSet.has(w) && cfg.mix[tierOf[w] - 1] > 0));
    const want = ri(cfg.tmin, cfg.tmax);
    const chosen = f.fills.map(x => x.w);
    const have = [0, 0, 0, 0, 0, 0]; chosen.forEach(w => have[tierOf[w]]++);
    while (chosen.length < want) {
      const t = tierByDeficit(cfg.mix, have, chosen.length, tt => pool.some(w => tierOf[w] === tt));
      if (!t) break;
      const k = pool.findIndex(w => tierOf[w] === t);
      chosen.push(pool[k]); have[t]++; pool.splice(k, 1);
    }
    const score = (chosen.length >= cfg.tmin ? 0 : 10) + mixError(chosen, cfg.mix);
    if (!best || score < best.score) best = { f, found, chosen, score };
    if (score < 0.25) break;
  }
  if (!best) throw new Error('无法生成关卡');
  const { f, found, chosen } = best;
  const fillPath = Object.fromEntries(f.fills.map(x => [x.w, x.p]));
  const targets = chosen.map(w => ({ w, p: fillPath[w] || pick(found.get(w)) }));
  const extras = [...found.keys()].filter(w => !chosen.includes(w));
  const N = W * H, counts = Array(N).fill(0);
  targets.forEach(t => t.p.forEach(c => counts[c]++));

  const t = chosen.slice().sort((a, b) => a.length - b.length || a.localeCompare(b));
  const lvl = {
    id: nextId++,
    g: Array.from({ length: H }, (_, r) => f.grid.slice(r * W, r * W + W).join('')).join(','),
    t: t.join(' '),
    lv: t.map(w => tierOf[w]).join(''),   // 每个目标词的难度档位
    e: extras.sort().join(' '),
    n: counts.map(c => c.toString(36)).join(''),
  };

  // 幕布：盖住一条边，先找到若干个不经过它的词才揭开
  if (cfg.curtain) {
    const regions = [];
    regions.push([...Array(H).keys()].map(r => r * W));
    regions.push([...Array(H).keys()].map(r => r * W + W - 1));
    regions.push([...Array(W).keys()]);
    if (H >= 3) regions.push([...Array(W).keys()].map(c => (H - 1) * W + c));
    for (const reg of shuffle(regions)) {
      const s = new Set(reg);
      const free = targets.filter(x => !x.p.some(c => s.has(c))).length;
      if (free >= 2 && free < targets.length) {
        lvl.o = [[Math.min(free, ri(2, 5)), reg.slice().sort((a, b) => a - b)]];
        break;
      }
    }
  }
  return lvl;
}

function bookCfg(b, i) {
  const maxLen = [6, 7, 8, 8, 8][b];
  let shape;
  if (b === 0) {
    if (i < 8) shape = { W: 3, H: 2, tmin: 2, tmax: 4 };
    else if (i < 40) shape = { W: 3, H: 3, tmin: 3, tmax: 5 };
    else if (i < 120) shape = pick([{ W: 3, H: 3, tmin: 4, tmax: 6 }, { W: 4, H: 3, tmin: 5, tmax: 8 }]);
    else shape = pick([{ W: 4, H: 3, tmin: 6, tmax: 9 }, { W: 5, H: 3, tmin: 7, tmax: 11 }]);
  } else {
    if (i < 15) shape = { W: 3, H: 3, tmin: 3, tmax: 5 };
    else if (i < 80) shape = pick([{ W: 4, H: 3, tmin: 5, tmax: 8 }, { W: 3, H: 3, tmin: 4, tmax: 6 }]);
    else shape = pick([{ W: 4, H: 3, tmin: 6, tmax: 9 }, { W: 5, H: 3, tmin: 7, tmax: 11 }, ...(b >= 3 ? [{ W: 4, H: 4, tmin: 7, tmax: 11 }] : [])]);
  }
  const curtain = i >= 30 && (b >= 2 ? i % 2 === 0 : i % 3 === 0) && shape.W * shape.H >= 9;
  return { ...shape, mix: BOOKS[b].mix, maxLen, curtain };
}

const books = BOOKS.map((bk, b) => {
  rnd = mulberry32(20261010 + b * 7919);
  const levels = [];
  for (let i = 0; i < PER_BOOK; i++) levels.push(makeLevel(bookCfg(b, i)));
  return { ...bk, levels };
});
rnd = mulberry32(366);
const daily = [];
for (let i = 0; i < DAILY; i++) daily.push(makeLevel({ ...pick([{ W: 4, H: 3, tmin: 7, tmax: 10 }, { W: 5, H: 3, tmin: 8, tmax: 12 }]), mix: DAILY_MIX, maxLen: 7, curtain: i % 4 === 0 }));

// 词典收录整份分级词表（编辑器与词典页都会用到），用紧凑的制表符文本存储
const dictText = WORDS.map(w => `${w}\t${tierOf[w]}\t${gloss[w]}`).join('\n');

fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data', 'levels.js'),
  '// 由 tools/generate-levels.js 生成的原创关卡（5 册）\nwindow.BOOKS=' + JSON.stringify(books) + ';\nwindow.DAILY=' + JSON.stringify(daily) + ';\n');
fs.writeFileSync(path.join(ROOT, 'data', 'dictionary.js'),
  '// 由 tools/generate-levels.js 生成：分级词表与中文释义（来源 ECDICT，MIT 许可）\n' +
  '(function(s){var D=window.DEFS={},T=window.TIER={};s.split("\\n").forEach(function(l){var p=l.split("\\t");D[p[0]]=[["",p[2]]];T[p[0]]=+p[1];});})(' +
  JSON.stringify(dictText) + ');\n');

const avg = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1);
console.log(`词表 ${WORDS.length} 词；每日 ${daily.length} 关`);
books.forEach(bk => {
  const ls = bk.levels, tiers = ls.flatMap(l => l.lv.split('').map(Number));
  const dist = [1, 2, 3, 4, 5].map(t => Math.round(100 * tiers.filter(x => x === t).length / tiers.length)).join('/');
  console.log(`${bk.name}（${bk.sub}）${ls.length} 关；平均目标词 ${avg(ls.map(l => l.t.split(' ').length))}；幕布关 ${ls.filter(l => l.o).length}；` +
    `目标比例 ${bk.mix.join('/')} → 实际 ${dist}`);
});
