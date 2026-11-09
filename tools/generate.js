#!/usr/bin/env node
/*
  用法：
    node tools/generate.js --from 1 --count 20 [--rows 3 --cols 4 --seed 7 --out levels.generated.json]
    node tools/generate.js --check      # 用求解器分析 app.js 中现有关卡
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const LG = require('./levelgen.js');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
    return acc;
  }, [])
);

const root = path.join(__dirname, '..');
const appSrc = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

// 从 app.js 取出现有关卡与额外词表（不执行其余浏览器代码）
const sandbox = {};
vm.createContext(sandbox);
const cut = appSrc.indexOf('// 每日签到关卡');
const bonusStart = appSrc.indexOf('const BONUS_WORDS');
const bonusEnd = appSrc.indexOf(']);', bonusStart) + 3;
vm.runInContext(appSrc.slice(0, cut) + '\n' + appSrc.slice(bonusStart, bonusEnd) + '\nthis.LEVELS = LEVELS; this.BONUS = Array.from(BONUS_WORDS);', sandbox);

const wordsText = fs.readFileSync(path.join(__dirname, 'words.txt'), 'utf8');
const dict = LG.loadDict(wordsText, sandbox.BONUS);

function summary(a) {
  return `解法${a.solutions} 陷阱词${a.trapWords}/${a.lengths.length} 共用格${a.sharedCells} 最高层${a.maxLayer} ` +
    `额外词${a.bonusCount} 元音${(a.vowelRatio * 100) | 0}%`;
}

if (args.check) {
  sandbox.LEVELS.forEach((lv, i) => {
    const a = LG.analyze(lv, dict);
    console.log(`Level ${i + 1}: ${a.solvable ? '可解' : '无解'}  ${summary(a)}`);
  });
  process.exit(0);
}

const from = +(args.from || 1);
const count = +(args.count || 10);
const rows = +(args.rows || 3);
const cols = +(args.cols || 4);
const seed0 = +(args.seed || 1);
const out = [];
const used = new Set();

for (let n = from; n < from + count; n++) {
  let res = null;
  for (let s = 0; s < 8 && !res; s++) {
    const r = LG.generateLevel({ levelNumber: n, rows, cols, dict, seed: seed0 * 1000 + n * 17 + s });
    // 避免与已生成关卡重复
    if (r && !r.level.targets.some((w) => used.has(w + '|' + n))) res = r;
  }
  if (!res) { console.log(`Level ${n}: 生成失败（可放宽档位或扩充词库）`); continue; }
  const a = res.analysis;
  console.log(`Level ${n} [${res.profile}] 分${res.score}  ${summary(a)}\n   ${res.level.targets.join(' ')}`);
  console.log(res.level.grid.map((r) => '   ' + r.join(' ') + '   ' + '').join('\n'));
  out.push({ id: n, profile: res.profile, ...res.level, meta: { score: res.score, ...a, bonus: undefined }, bonus: a.bonus });
}

const file = args.out && args.out !== true ? args.out : null;
if (file) {
  fs.writeFileSync(path.join(root, file), JSON.stringify(out, null, 2));
  console.log(`\n已写入 ${file}（${out.length} 关）`);
}
