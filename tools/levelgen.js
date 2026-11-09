/* ============================================================
   关卡分析器 + 自动生成器（可在 Node 与浏览器中使用）

   规则（与 app.js 一致）：
   - 仅上下左右相邻；一次连线不重复经过同一格
   - layers[r][c] = 该格可被使用的次数；目标词路径上每格扣 1
   - 目标词按"词"判定，棋盘上任何能拼出该词的路径都算

   关键性质：只要每格被使用次数 ≤ layers，拼词顺序无关紧要。
   所以"关卡好不好玩"取决于：每个词选哪条路径（有没有诱人的错路）。

   生成流程（非纯随机，约束驱动 + 评分选优）：
     1. 按难度档位决定：词数 / 长度组合 / 共用格数量
     2. 先生成"路径骨架"（覆盖全部格子且有重叠），再用词库回溯填字
     3. 用求解器分析：解法数、陷阱词、额外词、元音比例……
     4. 硬约束过滤 + 软指标评分，局部替换词做爬山优化
     5. 取多个候选中分数最高者
   ============================================================ */
(function (root) {
  'use strict';

  /* ---------- 随机数（可复现） ---------- */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const shuffle = (arr, rnd) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

  /* ---------- 路径枚举 ---------- */
  function findPaths(grid, word, limit = 400) {
    const R = grid.length, C = grid[0].length;
    const out = [];
    const used = Array.from({ length: R }, () => Array(C).fill(false));
    const path = [];
    function dfs(r, c, i) {
      if (out.length >= limit) return;
      if (grid[r][c] !== word[i]) return;
      used[r][c] = true;
      path.push(r * C + c);
      if (i === word.length - 1) out.push(path.slice());
      else {
        for (const [dr, dc] of DIRS) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && !used[nr][nc]) dfs(nr, nc, i + 1);
        }
      }
      path.pop();
      used[r][c] = false;
    }
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) dfs(r, c, 0);
    return out;
  }

  /* ---------- 求解 / 分析 ---------- */
  // 枚举"每个词选一条路径"且每格用量 ≤ layers 的方案
  function solve(level, cap = 200) {
    const R = level.grid.length, C = level.grid[0].length;
    const layers = level.layers.flat();
    const words = level.targets;
    const pathSets = words.map((w) => findPaths(level.grid, w));
    const order = words.map((_, i) => i).sort((a, b) => pathSets[a].length - pathSets[b].length);
    const remain = layers.slice();
    const pick = Array(words.length).fill(-1);
    const usedPair = words.map(() => new Set());
    let count = 0;
    function dfs(k) {
      if (count >= cap) return;
      if (k === order.length) {
        count++;
        order.forEach((wi) => usedPair[wi].add(pick[wi]));
        return;
      }
      const wi = order[k];
      for (let pi = 0; pi < pathSets[wi].length; pi++) {
        const p = pathSets[wi][pi];
        let ok = true;
        for (const cell of p) if (remain[cell] <= 0) { ok = false; break; }
        if (!ok) continue;
        for (const cell of p) remain[cell]--;
        pick[wi] = pi;
        dfs(k + 1);
        for (const cell of p) remain[cell]++;
        if (count >= cap) return;
      }
    }
    dfs(0);
    const pathCounts = pathSets.map((s) => s.length);
    // 致命错路：某个词存在的路径，却不出现在任何完整解里
    const fatal = pathSets.map((s, wi) => s.length - usedPair[wi].size);
    return { solutions: count, capped: count >= cap, pathCounts, fatal, pathSets, R, C };
  }

  // 额外词：棋盘上能连出、不是目标词的常用词
  function findBonus(grid, dict, targets) {
    const t = new Set(targets);
    const hits = [];
    for (const w of dict) {
      if (t.has(w) || w.length < 3) continue;
      if (findPaths(grid, w, 1).length) hits.push(w);
    }
    return hits;
  }

  function analyze(level, dict) {
    const s = solve(level);
    const flat = level.layers.flat();
    const letters = level.grid.flat();
    const vowels = letters.filter((l) => VOWELS.has(l)).length;
    const bonus = dict ? findBonus(level.grid, dict, level.targets) : [];
    const trapWords = s.fatal.filter((n) => n > 0).length;
    return {
      solvable: s.solutions > 0,
      solutions: s.solutions,
      capped: s.capped,
      pathCounts: s.pathCounts,
      trapWords,
      fatal: s.fatal,
      trapRatio: trapWords / level.targets.length,
      fatalPaths: s.fatal.reduce((a, b) => a + b, 0),
      sharedCells: flat.filter((n) => n >= 2).length,
      maxLayer: Math.max(...flat),
      coverage: flat.filter((n) => n >= 1).length / flat.length,
      vowelRatio: vowels / letters.length,
      lengths: level.targets.map((w) => w.length),
      bonusCount: bonus.length,
      bonus,
    };
  }

  /* ---------- 难度档位（可调） ---------- */
  function profileFor(n) {
    if (n <= 3) return { name: 'tutorial', words: [3, 4], lens: [3, 4], sharedMin: 1, sharedMax: 4, trapMin: 0, maxSol: 1, bonusMin: 1 };
    if (n <= 10) return { name: 'early', words: [4, 5], lens: [3, 5], sharedMin: 3, sharedMax: 6, trapMin: 0.25, maxSol: 1, bonusMin: 2 };
    if (n <= 25) return { name: 'mid', words: [5, 6], lens: [3, 5], sharedMin: 4, sharedMax: 7, trapMin: 0.35, maxSol: 2, bonusMin: 3 };
    return { name: 'late', words: [6, 8], lens: [3, 5], sharedMin: 5, sharedMax: 8, trapMin: 0.45, maxSol: 2, bonusMin: 3 };
  }

  /* ---------- 骨架：一组覆盖全盘且有重叠的路径 ---------- */
  function randomWalk(R, C, len, rnd, preferUncovered) {
    const start = Math.floor(rnd() * R * C);
    const path = [start];
    const seen = new Set(path);
    while (path.length < len) {
      const cur = path[path.length - 1];
      const r = Math.floor(cur / C), c = cur % C;
      const opts = [];
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        const id = nr * C + nc;
        if (!seen.has(id)) opts.push(id);
      }
      if (!opts.length) return null;
      opts.sort((a, b) => (preferUncovered(b) - preferUncovered(a)) + (rnd() - 0.5) * 0.9);
      path.push(opts[0]);
      seen.add(opts[0]);
    }
    return path;
  }

  function makeSkeleton(R, C, prof, rnd) {
    const cells = R * C;
    const n = prof.words[0] + Math.floor(rnd() * (prof.words[1] - prof.words[0] + 1));
    // 选长度组合，使总长 = 格数 + 共用量
    for (let tries = 0; tries < 200; tries++) {
      const lens = Array.from({ length: n }, () => prof.lens[0] + Math.floor(rnd() * (prof.lens[1] - prof.lens[0] + 1)));
      const total = lens.reduce((a, b) => a + b, 0);
      const shared = total - cells;
      if (shared < prof.sharedMin || shared > prof.sharedMax) continue;
      lens.sort((a, b) => b - a);
      const covered = new Set();
      const paths = [];
      const keys = new Set();
      let ok = true;
      for (let i = 0; i < n && ok; i++) {
        let best = null, bestScore = -1;
        for (let k = 0; k < 40; k++) {
          const p = randomWalk(R, C, lens[i], rnd, (id) => (covered.has(id) ? 0 : 1));
          if (!p) continue;
          const fresh = p.filter((id) => !covered.has(id)).length;
          // 最后几条路径必须补齐未覆盖格
          const remainingPaths = n - i - 1;
          const need = cells - covered.size;
          if (need - fresh > remainingPaths * lens[Math.min(i + 1, n - 1)]) continue;
          const key = p.join(',');
          const rkey = p.slice().reverse().join(',');
          if (keys.has(key) || keys.has(rkey)) continue;
          const score = fresh + rnd() * 0.5;
          if (score > bestScore) { bestScore = score; best = p; }
        }
        if (!best) { ok = false; break; }
        paths.push(best);
        keys.add(best.join(','));
        best.forEach((id) => covered.add(id));
      }
      if (ok && covered.size === cells) return paths;
    }
    return null;
  }

  /* ---------- 骨架填词（回溯） ---------- */
  function fillWords(paths, byLen, rnd, maxNodes = 4000) {
    const order = paths.map((_, i) => i).sort((a, b) => paths[b].length - paths[a].length);
    const letters = {};
    const chosen = Array(paths.length).fill(null);
    const usedWords = new Set();
    let nodes = 0;
    function dfs(k) {
      if (++nodes > maxNodes) return false;
      if (k === order.length) return true;
      const pi = order[k];
      const p = paths[pi];
      const cands = (byLen[p.length] || []).filter((w) => {
        if (usedWords.has(w)) return false;
        for (let i = 0; i < p.length; i++) {
          const L = letters[p[i]];
          if (L && L !== w[i]) return false;
        }
        return true;
      });
      shuffle(cands, rnd);
      for (const w of cands.slice(0, 25)) {
        const set = [];
        for (let i = 0; i < p.length; i++) if (!letters[p[i]]) { letters[p[i]] = w[i]; set.push(p[i]); }
        chosen[pi] = w;
        usedWords.add(w);
        if (dfs(k + 1)) return true;
        usedWords.delete(w);
        chosen[pi] = null;
        set.forEach((id) => delete letters[id]);
        if (nodes > maxNodes) return false;
      }
      return false;
    }
    if (!dfs(0)) return null;
    return { letters, words: chosen };
  }

  function buildLevel(R, C, paths, fill) {
    const grid = Array.from({ length: R }, () => Array(C).fill('?'));
    const layers = Array.from({ length: R }, () => Array(C).fill(0));
    for (let id = 0; id < R * C; id++) grid[Math.floor(id / C)][id % C] = fill.letters[id];
    paths.forEach((p) => p.forEach((id) => { layers[Math.floor(id / C)][id % C]++; }));
    return { grid, layers, targets: fill.words.slice() };
  }

  /* ---------- 评分 / 硬约束 ---------- */
  function evaluate(level, prof, dict) {
    const a = analyze(level, dict);
    if (!a.solvable || a.capped) return { ok: false, score: -1, a };
    if (a.coverage < 1) return { ok: false, score: -1, a };
    if (a.solutions > prof.maxSol) return { ok: false, score: -1, a };
    if (a.trapRatio < prof.trapMin) return { ok: false, score: -1, a };
    if (a.bonusCount < prof.bonusMin) return { ok: false, score: -1, a };
    if (a.vowelRatio < 0.2 || a.vowelRatio > 0.6) return { ok: false, score: -1, a };

    let score = 0;
    score += a.solutions === 1 ? 3 : 1;                         // 解法越唯一越"有解"
    score += Math.min(a.trapRatio / Math.max(prof.trapMin, 0.3), 1.6) * 2.5; // 有诱人的错路
    score += Math.min(a.sharedCells, 8) * 0.35;                 // 共用格 = 顺序/路径取舍
    score += new Set(a.lengths).size * 0.8;                     // 词长多样
    score += Math.min(a.bonusCount, 8) * 0.3;                   // 额外词惊喜
    if (a.bonusCount > 14) score -= (a.bonusCount - 14) * 0.4;  // 额外词太多会稀释目标
    score -= Math.abs(a.vowelRatio - 0.38) * 5;                 // 元音比例接近 38%
    score -= a.maxLayer > 4 ? (a.maxLayer - 4) * 0.8 : 0;       // 层数不要过高
    // 太简单的路径：所有词都只有 1 条路径 → 没有取舍
    if (a.pathCounts.every((n) => n === 1) && prof.trapMin > 0) score -= 2;
    return { ok: true, score, a };
  }

  /* ---------- 局部爬山：替换单个词，保持骨架 ---------- */
  function improve(level, paths, prof, dict, byLen, rnd, rounds = 3) {
    let best = { level, ...evaluate(level, prof, dict) };
    for (let r = 0; r < rounds; r++) {
      let changed = false;
      for (let wi = 0; wi < paths.length; wi++) {
        const p = paths[wi];
        const cands = (byLen[p.length] || []).filter((w) => {
          if (best.level.targets.includes(w)) return false;
          for (let i = 0; i < p.length; i++) {
            const id = p[i];
            const cur = best.level.grid[Math.floor(id / best.level.grid[0].length)][id % best.level.grid[0].length];
            // 该格若被其他路径占用，则字母必须保持
            const shared = best.level.layers[Math.floor(id / best.level.grid[0].length)][id % best.level.grid[0].length] > 1;
            if (shared && cur !== w[i]) return false;
          }
          return true;
        });
        shuffle(cands, rnd);
        for (const w of cands.slice(0, 12)) {
          const g = best.level.grid.map((row) => row.slice());
          const C = g[0].length;
          for (let i = 0; i < p.length; i++) g[Math.floor(p[i] / C)][p[i] % C] = w[i];
          const targets = best.level.targets.slice();
          targets[wi] = w;
          const cand = { grid: g, layers: best.level.layers, targets };
          const ev = evaluate(cand, prof, dict);
          if (ev.ok && ev.score > (best.ok ? best.score : -1)) {
            best = { level: cand, ...ev };
            changed = true;
          }
        }
      }
      if (!changed) break;
    }
    return best;
  }

  /* ---------- 主入口 ---------- */
  function generateLevel(opts) {
    const {
      levelNumber = 1, rows = 3, cols = 4, dict, seed = 1,
      attempts = 400, candidates = 6,
    } = opts;
    const prof = Object.assign(profileFor(levelNumber), opts.profile || {});
    const rnd = mulberry32(seed);
    const byLen = {};
    dict.forEach((w) => { (byLen[w.length] = byLen[w.length] || []).push(w); });

    const pool = [];
    for (let i = 0; i < attempts && pool.length < candidates; i++) {
      const paths = makeSkeleton(rows, cols, prof, rnd);
      if (!paths) continue;
      const fill = fillWords(paths, byLen, rnd);
      if (!fill) continue;
      const level = buildLevel(rows, cols, paths, fill);
      const ev = evaluate(level, prof, dict);
      if (!ev.ok) continue;
      pool.push(improve(level, paths, prof, dict, byLen, rnd));
    }
    if (!pool.length) return null;
    pool.sort((a, b) => b.score - a.score);
    const top = pool[0];
    return {
      level: { grid: top.level.grid, layers: top.level.layers, targets: top.level.targets.slice().sort() },
      analysis: top.a,
      score: +top.score.toFixed(2),
      profile: prof.name,
    };
  }

  function loadDict(text, extra = []) {
    const set = new Set();
    text.split(/\s+/).forEach((w) => { if (/^[a-z]{3,6}$/i.test(w)) set.add(w.toUpperCase()); });
    extra.forEach((w) => set.add(String(w).toUpperCase()));
    return Array.from(set);
  }

  const api = { findPaths, solve, analyze, generateLevel, profileFor, loadDict };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LevelGen = api;
})(typeof window !== 'undefined' ? window : globalThis);
