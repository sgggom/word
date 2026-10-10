// 原创关卡生成器：node tools/generate-levels.js
// 读取 tools/words.txt，输出 data/levels.js 与 data/dictionary.js
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CAMPAIGN = 800, DAILY = 366;

/* ---------- 词表 ---------- */
const gloss = {};
for (const line of fs.readFileSync(path.join(__dirname, 'words.txt'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z]{3,8})\s+(.+)$/);
  if (m && !gloss[m[1]]) gloss[m[1]] = m[2].trim();
}
const WORDS = Object.keys(gloss);
const byLen = {};
WORDS.forEach(w => (byLen[w.length] = byLen[w.length] || []).push(w));
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
let rnd = mulberry32(20261010);
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

/* 用词表单词铺满整个网格 */
function fillGrid(W, H, maxLen) {
  const N = W * H, grid = Array(N).fill(null), fills = [], used = new Set();
  const empty = new Set([...Array(N).keys()]);
  while (empty.size) {
    const n = empty.size;
    const lens = [];
    for (let L = 3; L <= Math.min(maxLen, n); L++) if ((n - L === 0 || n - L >= 3) && byLen[L]) lens.push(L);
    if (!lens.length) return null;
    // 越早放的词越长，形成「主题长词」
    const L = fills.length === 0 ? lens[lens.length - 1 - Math.floor(rnd() * Math.min(2, lens.length))] : pick(lens);
    const p = randomWalk(empty, L, W, H);
    if (!p) return null;
    const cands = byLen[L].filter(w => !used.has(w));
    const w = pick(cands);
    used.add(w);
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

/* ---------- 单个关卡 ---------- */
let nextId = 1;
function makeLevel(cfg) {
  const { W, H } = cfg;
  let best = null;
  for (let attempt = 0; attempt < 300; attempt++) {
    const f = fillGrid(W, H, Math.min(MAXLEN, cfg.maxLen || MAXLEN));
    if (!f) continue;
    const found = findWords(f.grid, W, H);
    const fillSet = new Set(f.fills.map(x => x.w));
    const others = shuffle([...found.keys()].filter(w => !fillSet.has(w)));
    const want = ri(cfg.tmin, cfg.tmax);
    const extraTargets = others.slice(0, Math.max(0, want - f.fills.length));
    const targets = [...f.fills.map(x => ({ w: x.w, p: x.p })), ...extraTargets.map(w => ({ w, p: pick(found.get(w)) }))];
    const score = targets.length >= cfg.tmin ? 100 + others.length : targets.length;
    const cand = { f, found, targets, extras: others.slice(extraTargets.length) };
    if (!best || score > best.score) best = { ...cand, score };
    if (targets.length >= cfg.tmin) break;
  }
  if (!best) throw new Error('无法生成关卡');
  const { f, targets, extras } = best;
  const N = W * H, counts = Array(N).fill(0);
  targets.forEach(t => t.p.forEach(c => counts[c]++));

  const lvl = {
    id: nextId++,
    g: Array.from({ length: H }, (_, r) => f.grid.slice(r * W, r * W + W).join('')).join(','),
    t: targets.map(t => t.w).sort((a, b) => a.length - b.length || a.localeCompare(b)).join(' '),
    e: extras.slice(0, 16).sort().join(' '),
    n: counts.map(c => c.toString(36)).join(''),
  };

  // 幕布：盖住一条边，先找到若干个不经过它的词才揭开
  if (cfg.curtain) {
    const regions = [];
    regions.push([...Array(H).keys()].map(r => r * W));                // 左列
    regions.push([...Array(H).keys()].map(r => r * W + W - 1));        // 右列
    regions.push([...Array(W).keys()]);                                  // 顶行
    if (H >= 3) regions.push([...Array(W).keys()].map(c => (H - 1) * W + c)); // 底行
    for (const reg of shuffle(regions)) {
      const s = new Set(reg);
      const free = targets.filter(t => !t.p.some(c => s.has(c))).length;
      if (free >= 2 && free < targets.length) {
        lvl.o = [[Math.min(free, ri(2, 5)), reg.slice().sort((a, b) => a - b)]];
        break;
      }
    }
  }
  return lvl;
}

function campaignCfg(i) {
  if (i < 6) return { W: 3, H: 2, tmin: 2, tmax: 4, maxLen: 4 };
  if (i < 25) return { W: 3, H: 3, tmin: 3, tmax: 5 };
  if (i < 60) return pick([{ W: 3, H: 3, tmin: 4, tmax: 6 }, { W: 4, H: 2, tmin: 4, tmax: 6 }, { W: 4, H: 3, tmin: 5, tmax: 7 }]);
  const curtain = i >= 30 && i % 3 === 0;
  if (i < 250) return { ...pick([{ W: 4, H: 3, tmin: 6, tmax: 9 }, { W: 3, H: 3, tmin: 5, tmax: 7 }]), curtain };
  return { ...pick([{ W: 4, H: 3, tmin: 7, tmax: 10 }, { W: 5, H: 3, tmin: 8, tmax: 12 }]), curtain };
}

const levels = [];
for (let i = 0; i < CAMPAIGN; i++) {
  const cfg = campaignCfg(i);
  if (i >= 30 && i < 60 && i % 3 === 0) { cfg.W = 4; cfg.H = 3; cfg.curtain = true; }
  levels.push(makeLevel(cfg));
}
rnd = mulberry32(366);
const daily = [];
for (let i = 0; i < DAILY; i++) daily.push(makeLevel({ ...pick([{ W: 4, H: 3, tmin: 7, tmax: 10 }, { W: 5, H: 3, tmin: 9, tmax: 12 }]), curtain: i % 4 === 0 }));

const usedWords = new Set();
for (const l of [...levels, ...daily]) { l.t.split(' ').forEach(w => usedWords.add(w)); if (l.e) l.e.split(' ').forEach(w => usedWords.add(w)); }
const defs = {};
[...usedWords].sort().forEach(w => { defs[w] = [['', gloss[w]]]; });

fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data', 'levels.js'),
  '// 由 tools/generate-levels.js 生成的原创关卡\nwindow.LEVELS=' + JSON.stringify(levels) + ';\nwindow.DAILY=' + JSON.stringify(daily) + ';\n');
fs.writeFileSync(path.join(ROOT, 'data', 'dictionary.js'),
  '// 由 tools/generate-levels.js 生成：原创词表的中文释义\nwindow.DEFS=' + JSON.stringify(defs) + ';\n');

const avg = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1);
console.log(`词表 ${WORDS.length} 词；主线 ${levels.length} 关，每日 ${daily.length} 关；` +
  `平均目标词 ${avg(levels.map(l => l.t.split(' ').length))}；幕布关 ${levels.filter(l => l.o).length}`);
