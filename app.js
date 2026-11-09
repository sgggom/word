const LEVELS = [
  // Level 1 (4 targets)
  {
    grid: [
      ['C', 'O', 'F', 'I'],
      ['D', 'L', 'M', 'S'],
      ['W', 'A', 'R', 'H'],
    ],
    layers: [
      [1, 2, 2, 1],
      [2, 2, 1, 1],
      [1, 1, 1, 1],
    ],
    targets: ['COLD', 'FISH', 'FOLD', 'WARM'],
  },
  // Level 2 (5 targets)
  {
    grid: [
      ['S', 'P', 'A', 'N'],
      ['T', 'O', 'R', 'K'],
      ['M', 'I', 'L', 'E'],
    ],
    layers: [
      [1, 2, 2, 1],
      [1, 2, 2, 2],
      [1, 2, 2, 1],
    ],
    targets: ['OIL', 'MILE', 'PARK', 'RANK', 'STOP'],
  },
  // Level 3 (5 targets)
  {
    grid: [
      ['B', 'A', 'K', 'E'],
      ['O', 'R', 'I', 'D'],
      ['W', 'L', 'N', 'G'],
    ],
    layers: [
      [2, 1, 2, 2],
      [1, 2, 3, 1],
      [1, 1, 2, 2],
    ],
    targets: ['BAKE', 'BOWL', 'KING', 'RIDE', 'RING'],
  },
  // Level 4 (6 targets)
  {
    grid: [
      ['F', 'L', 'A', 'T'],
      ['O', 'I', 'R', 'E'],
      ['S', 'W', 'M', 'D'],
    ],
    layers: [
      [2, 3, 1, 2],
      [2, 3, 3, 3],
      [1, 1, 1, 1],
    ],
    targets: ['RED', 'FLAT', 'FOIL', 'SOIL', 'TERM', 'WIRE'],
  },
  // Level 5 (6 targets)
  {
    grid: [
      ['S', 'H', 'O', 'P'],
      ['T', 'A', 'R', 'E'],
      ['M', 'I', 'L', 'D'],
    ],
    layers: [
      [2, 2, 3, 3],
      [2, 2, 2, 2],
      [1, 2, 2, 1],
    ],
    targets: ['HOPE', 'MILD', 'ROPE', 'SHOP', 'STAR', 'TAIL'],
  },
  // Level 6 (7 targets)
  {
    grid: [
      ['C', 'L', 'A', 'P'],
      ['O', 'I', 'R', 'E'],
      ['U', 'N', 'T', 'S'],
    ],
    layers: [
      [3, 2, 3, 3],
      [3, 2, 3, 1],
      [1, 2, 4, 1],
    ],
    targets: ['OIL', 'CLAP', 'COIN', 'PART', 'REST', 'TRAP', 'COUNT'],
  },
  // Level 7 (8 targets)
  {
    grid: [
      ['S', 'L', 'E', 'D'],
      ['P', 'A', 'R', 'K'],
      ['W', 'I', 'N', 'G'],
    ],
    layers: [
      [2, 3, 2, 2],
      [3, 4, 3, 2],
      [2, 3, 3, 1],
    ],
    targets: ['RED', 'WIN', 'LARK', 'PAIN', 'PARK', 'SLAP', 'SLED', 'WING'],
  },
  // Level 8 (9 targets - 双列目标排版)
  {
    grid: [
      ['C', 'A', 'T', 'S'],
      ['O', 'R', 'E', 'N'],
      ['D', 'L', 'I', 'P'],
    ],
    layers: [
      [4, 5, 4, 2],
      [2, 6, 4, 1],
      [1, 1, 1, 1],
    ],
    targets: ['CAR', 'CAT', 'LIP', 'ROD', 'TEN', 'CARE', 'CORE', 'STAR', 'STARE'],
  },
  // Level 9 (9 targets - 双列目标排版)
  {
    grid: [
      ['B', 'A', 'R', 'N'],
      ['O', 'E', 'T', 'S'],
      ['W', 'L', 'I', 'D'],
    ],
    layers: [
      [2, 6, 5, 3],
      [1, 5, 4, 1],
      [1, 4, 2, 1],
    ],
    targets: ['LID', 'TEA', 'ARTS', 'BARN', 'BOWL', 'EARN', 'TEAR', 'TILE', 'LEARN'],
  },
  // Level 10 (10 targets - 双列目标排版)
  {
    grid: [
      ['S', 'P', 'A', 'R'],
      ['H', 'O', 'E', 'K'],
      ['M', 'I', 'L', 'D'],
    ],
    layers: [
      [3, 5, 4, 3],
      [3, 4, 4, 2],
      [2, 3, 4, 1],
    ],
    targets: ['EAR', 'HOP', 'OIL', 'LEAP', 'MILD', 'MILE', 'PARK', 'SHOE', 'SHOP', 'SPARK'],
  },
];

// 每日签到关卡（3行5列棋盘，12个目标词，全部15格覆盖且路径唯一）
const DAILY_LEVEL = {
  grid: [
    ['S', 'H', 'A', 'R', 'K'],
    ['P', 'O', 'L', 'I', 'N'],
    ['M', 'E', 'T', 'D', 'G'],
  ],
  layers: [
    [2, 4, 4, 5, 5],
    [3, 4, 4, 4, 3],
    [2, 3, 2, 1, 1],
  ],
  targets: [
    'LID', 'MET', 'HALO', 'HARK', 'LARK', 'LINK',
    'POEM', 'POET', 'RING', 'RINK', 'SHOP', 'SHARK',
  ],
};

// 11种棋盘材质对应的主玩法主题与收集物配置
const EVENT_THEMES = [
  { matName: 'Wood', title: '森林寻宝 · Wood', itemName: '松果木雕', bg: 'linear-gradient(135deg, #8b5a2b 0%, #4a2f13 100%)' },
  { matName: 'Sand', title: '流沙遗迹 · Sand', itemName: '海星化石', bg: 'linear-gradient(135deg, #d4a359 0%, #8c6223 100%)' },
  { matName: 'Stone', title: '远古石阵 · Stone', itemName: '符文石板', bg: 'linear-gradient(135deg, #6e7b8b 0%, #36404a 100%)' },
  { matName: 'Ice', title: '极地冰原 · Ice', itemName: '冰晶雪花', bg: 'linear-gradient(135deg, #5dade2 0%, #21618c 100%)' },
  { matName: 'Grass', title: '春日草甸 · Grass', itemName: '四叶草章', bg: 'linear-gradient(135deg, #58b368 0%, #276334 100%)' },
  { matName: 'CottonCandy', title: '云端糖果 · CottonCandy', itemName: '彩虹糖块', bg: 'linear-gradient(135deg, #e88db4 0%, #8e44ad 100%)' },
  { matName: 'Oyster', title: '深海秘境 · Oyster', itemName: '深海珍珠', bg: 'linear-gradient(135deg, #5c768d 0%, #283747 100%)' },
  { matName: 'Melon', title: '夏日果园 · Melon', itemName: '西瓜冰棒', bg: 'linear-gradient(135deg, #e76f51 0%, #2a9d8f 100%)' },
  { matName: 'Pillow', title: '梦境小筑 · Pillow', itemName: '绒毛抱枕', bg: 'linear-gradient(135deg, #9b89b3 0%, #4a3b63 100%)' },
  { matName: 'Soap', title: '泡沫派对 · Soap', itemName: '香氛礼盒', bg: 'linear-gradient(135deg, #48b8d0 0%, #1f6f8b 100%)' },
  { matName: 'Pumpkin', title: '丰收庄园 · Pumpkin', itemName: '黄金南瓜', bg: 'linear-gradient(135deg, #e67e22 0%, #873600 100%)' },
];

// 棋盘可连接出的常用有效英文单词表（仅保留 ≥3 字母的日常通用单词，非本关目标词即为额外词）
const BONUS_WORDS = new Set([
  'AIM', 'ALE', 'APE', 'ARE', 'ARK', 'ARM', 'ART', 'ARTS', 'ATE', 'BAKE', 'BAR', 'BARN', 'BARNS',
  'BOW', 'BOWL', 'CAR', 'CARE', 'CAT', 'CLAP', 'COD', 'COIL', 'COIN', 'COLA', 'COLD', 'CORE',
  'COUNT', 'EAR', 'EARN', 'EARNS', 'ERA', 'FISH', 'FLAT', 'FOIL', 'FOLD', 'HAIL', 'HALO', 'HARE',
  'HARK', 'HAT', 'HOP', 'HOPE', 'HOE', 'INK', 'KID', 'KIN', 'KING', 'LAP', 'LARK', 'LATE',
  'LATER', 'LAW', 'LEAP', 'LEARN', 'LED', 'LET', 'LIAR', 'LID', 'LIE', 'LINK', 'LINT', 'LIP',
  'LIT', 'MET', 'MILD', 'MILE', 'NAP', 'NET', 'OIL', 'OLD', 'ORE', 'OWL', 'PAIN', 'PAL', 'PALE',
  'PAN', 'PARK', 'PART', 'PARTS', 'PEST', 'PIE', 'PIER', 'POEM', 'POET', 'PORE', 'PORK', 'POT',
  'RAIL', 'RAIN', 'RAKE', 'RAN', 'RANK', 'RAP', 'RAT', 'RATE', 'RAW', 'RED', 'REST', 'RID',
  'RIDE', 'RING', 'RINK', 'ROB', 'ROD', 'ROPE', 'ROT', 'ROW', 'SHARK', 'SHOE', 'SHOP', 'SHORE',
  'SLAP', 'SLED', 'SOIL', 'SPA', 'SPAN', 'SPAR', 'SPARK', 'SPOT', 'STAR', 'STARE', 'STOP',
  'TAIL', 'TAR', 'TEA', 'TEAR', 'TEN', 'TERM', 'TILE', 'TOIL', 'TOP', 'TOPS', 'TRAP', 'TRIO',
  'WAR', 'WARM', 'WARMS', 'WIN', 'WING', 'WIRE',
]);

/* ══════════════════════════════════════════════════════════════════════
   WordLetterVisualController 按住与回弹常量 / 缓动（直接复用自预览工程）
   ══════════════════════════════════════════════════════════════════════ */
const K = {
  OFFSET: 0.028,
  PRESS_DURATION: 0.14,
  RELEASE_DURATION: 0.10,
  COLOR_DURATION: 0.07,
  MIN_VISIBLE: 0.08,
  SHADOW_ALPHA: 0.298,
  SHADOW_Y: -0.113,
  BEVEL_Y: -0.031,
  SET_Y: -0.012,
};

// 棋子内部排版比例（适配 66px 棋盘格）与碎块粒子特效世界单位（FX_PXU = 100，与预览工程完全一致）
const TILE_PXU = 72.18;
const TILE_PX = (256 / 280) * TILE_PXU;
const FX_PXU = 100;

const Ease = {
  outBack(t) {
    const c1 = 1.70158, c3 = c1 + 1, p = t - 1;
    return 1 + c3 * p * p * p + c1 * p * p;
  },
  outSine(t) {
    return Math.sin((t * Math.PI) / 2);
  },
  releaseCurve(u) {
    const P1x = 0.07800312, P1y = 0.07800312 * 2.5822272;
    const P2x = 1 - 0.20807286, P2y = 1 - 0.20807286 * 0.05804753;
    const bez = (a, b, c, d, s) => {
      const m = 1 - s;
      return m * m * m * a + 3 * m * m * s * b + 3 * m * s * s * c + s * s * s * d;
    };
    let lo = 0, hi = 1, s = u;
    for (let i = 0; i < 20; i++) {
      s = (lo + hi) / 2;
      if (bez(0, P1x, P2x, 1, s) < u) lo = s;
      else hi = s;
    }
    return bez(0, P1y, P2y, 1, s);
  },
};

let selectedPalette = PALETTE[0];
let materialSet = null; // null = Default 矢量色块；否则为 MATERIALS[i]

const GRAV = -9.81;
const BREAK_OUT = 0.12;

const fxStore = new Map();
const fxBursts = [];
const fxBreaks = new Map();

function fxImage(name) {
  let im = fxStore.get(name);
  if (!im) {
    im = new Image();
    im.decoding = 'async';
    im.src = SPRITES[name] || '';
    fxStore.set(name, im);
  }
  return im;
}

function pickConst(spec) {
  if (!spec) return 0;
  if (spec.c !== undefined) return spec.c;
  if (spec.r) return spec.r[0] + (spec.r[1] - spec.r[0]) * Math.random();
  if (spec.k) return spec.k[0];
  return 0;
}

function curveAt(arr, t) {
  if (!arr || !arr.length) return 0;
  const n = arr.length - 1;
  const x = t * n;
  const i = Math.min(n - 1, Math.floor(x));
  const u = x - i;
  return arr[i] + (arr[i + 1] - arr[i]) * u;
}

function curveSpec(spec, t, w) {
  if (!spec) return 0;
  if (spec.c !== undefined) return spec.c;
  if (spec.k) return curveAt(spec.k, t);
  if (spec.kr) {
    const a = spec.kr[0], b = spec.kr[1];
    return curveAt(a.k, t) + (curveAt(b.k, t) - curveAt(a.k, t)) * w;
  }
  if (spec.r) return spec.r[0] + (spec.r[1] - spec.r[0]) * w;
  return 0;
}

/* ── 棋子类（直接复用自预览工程 Tile） ── */
class Tile {
  constructor(row, col, letter, layers, pxu = TILE_PXU) {
    this.row = row;
    this.col = col;
    this.letter = letter;
    this.layers = layers;
    this.pxu = pxu;
    this.p = 0;          // 压下量（OutBack 会略微过冲）
    this.colorPhase = 0; // 0 常态色 → 1 选中色
    this.state = 'idle'; // idle | press | held | release
    this.selected = false;
    this.selectedAt = 0;
    this.t0 = 0;
    this.p0 = 0;
    this.c0 = 0;
    this.delay = 0;
    this.el = this.build();
  }

  build() {
    const el = document.createElement('div');
    el.className = 'tile';
    el.dataset.row = this.row;
    el.dataset.col = this.col;
    el.innerHTML = `
      <div class="layer shadow"></div>
      <div class="layer bevel"></div>
      <div class="layer base"></div>
      <div class="layer set"></div>
      <div class="letter"></div>
      <div class="usage"></div>`;
    this.el = el;
    this.shadow = el.querySelector('.shadow');
    this.bevel = el.querySelector('.bevel');
    this.base = el.querySelector('.base');
    this.set = el.querySelector('.set');
    this.txt = el.querySelector('.letter');
    this.use = el.querySelector('.usage');

    // Unity y 轴向上，CSS 向下 → 取反
    const pxu = this.pxu;
    const tilePx = (256 / 280) * pxu;
    this.shadow.style.transform = `translateY(${-K.SHADOW_Y * pxu}px)`;
    this.set.style.top = `${50 + (K.SET_Y * pxu) / tilePx * 100}%`;

    this.txt.textContent = this.letter;
    this.txt.style.transform =
      `translate(calc(-50% + ${-0.004 * pxu}px), calc(-50% + ${-0.014 * pxu}px))`;
    this.use.textContent = this.layers ?? '';
    this.use.style.transform =
      `translate(calc(-50% + ${0.175 * pxu}px), calc(-50% + ${0.310 * pxu}px))`;

    this.applyStyle();
    return el;
  }

  applyStyle() {
    const m = materialSet;
    this.el.classList.toggle('material', !!m);

    // ApplyVisualSet：材质启用时关闭 投影/底盘/倒角，改由 img_latter_set 绘制
    const on = m ? 'none' : 'block';
    this.shadow.style.display = on;
    this.base.style.display = on;
    this.bevel.style.display = on;
    this.set.style.display = m ? 'block' : 'none';

    if (m) {
      const dim = this.selected
        ? (m.selection.includes('stone') ? [197, 204] : [m.w, m.h])
        : [m.w, m.h];
      this.set.style.width = `${(dim[0] / m.ppu) * this.pxu}px`;
      this.set.style.height = `${(dim[1] / m.ppu) * this.pxu}px`;
      this.set.style.transform = 'translate(-50%, -50%)';
      this.set.style.backgroundImage =
        `url("${SPRITES[this.selected ? m.selection : m.letter]}")`;
    }
    this.render();
  }

  down(now) {
    this.p0 = this.p;
    this.c0 = this.colorPhase;
    this.t0 = now * 1000;
    this.selected = true;
    // SetState → 只有 _isMaterialActive == false 才走 ApplyRegularState（位移+颜色）
    if (materialSet) {
      this.state = 'held';
      this.p = 0;
      this.colorPhase = 1;
      this.applyStyle();
    } else {
      this.state = 'press';
    }
  }

  up(now) {
    const ms = now * 1000;
    this.p0 = this.p;
    this.c0 = this.colorPhase;
    this.t0 = ms;
    this.selected = false;
    if (materialSet) {
      this.state = 'idle';
      this.p = 0;
      this.colorPhase = 0;
      this.applyStyle();
      return;
    }
    this.delay = Math.max(0, this.selectedAt + K.MIN_VISIBLE * 1000 - ms);
    this.state = 'release';
  }

  markSelected(now) {
    this.selectedAt = now * 1000;
  }

  tick(now) {
    const ms = now * 1000;
    if (this.state === 'press') {
      const t = Math.min(1, (ms - this.t0) / (K.PRESS_DURATION * 1000));
      this.p = this.p0 + (1 - this.p0) * Ease.outBack(t);
      this.colorPhase = 1;
      if (t >= 1) {
        this.state = 'held';
        this.p = 1;
      }
    } else if (this.state === 'release') {
      const dt = ms - this.t0;
      if (dt >= this.delay) {
        const t = Math.min(1, (dt - this.delay) / (K.RELEASE_DURATION * 1000));
        this.p = this.p0 * (1 - Ease.releaseCurve(t));
        const ct = Math.min(1, (dt - this.delay) / (K.COLOR_DURATION * 1000));
        this.colorPhase = this.c0 * (1 - Ease.outSine(ct));
        if (t >= 1 && ct >= 1) {
          this.p = 0;
          this.colorPhase = 0;
          this.state = 'idle';
        }
      }
    }
    this.render();
  }

  render() {
    const p = this.p;
    const pxu = this.pxu;
    // 根节点下移 0.028；倒角相对根上移 0.028 → 屏幕空间位置不变，厚度差被吃掉
    this.el.style.transform = `translateY(${K.OFFSET * p * pxu}px)`;
    this.bevel.style.transform = `translateY(${(-K.BEVEL_Y - K.OFFSET * p) * pxu}px)`;

    const cp = this.colorPhase;
    const m = materialSet;
    if (m) {
      const c = rgb(mix(hex(m.text), hex(m.selText), cp));
      this.txt.style.color = c;
      this.use.style.color = c;
      return;
    }
    const sel = selectedPalette;
    this.base.style.backgroundColor = rgb(mix(hex(REGULAR.Base), hex(sel.Base), cp));
    this.bevel.style.backgroundColor = rgb(mix(hex(REGULAR.Bevel), hex(sel.Bevel), cp));
    this.shadow.style.backgroundColor = `rgba(0,0,0,${K.SHADOW_ALPHA})`;
    const tc = rgb(mix(hex(REGULAR.Text), hex(sel.Text), cp));
    this.txt.style.color = tc;
    this.use.style.color = tc;
  }
}

class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
  }

  ensureContext() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTone({ freq = 440, type = 'sine', duration = 0.12, gain = 0.15, delay = 0, slideTo = null }) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + delay;
    const endTime = startTime + duration;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, endTime);
    }

    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.012);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(endTime + 0.01);
  }

  playClick() {
    this.playTone({ freq: 620, type: 'triangle', duration: 0.06, gain: 0.12, slideTo: 420 });
  }

  playSelect(stepIndex = 0) {
    const freq = this.scale[stepIndex % this.scale.length];
    this.playTone({ freq, type: 'sine', duration: 0.11, gain: 0.16 });
  }

  playValidWord() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone({
        freq,
        type: 'triangle',
        duration: 0.16,
        gain: 0.16,
        delay: idx * 0.055,
      });
    });
  }

  playTileVanish() {
    this.playTone({ freq: 1174.66, type: 'sine', duration: 0.18, gain: 0.12, delay: 0.12, slideTo: 1567.98 });
  }

  playInvalidWord() {
    this.playTone({ freq: 210, type: 'sawtooth', duration: 0.09, gain: 0.09, delay: 0 });
    this.playTone({ freq: 175, type: 'sawtooth', duration: 0.12, gain: 0.09, delay: 0.08 });
  }

  playVictory() {
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    fanfare.forEach((freq, idx) => {
      this.playTone({
        freq,
        type: 'triangle',
        duration: idx === fanfare.length - 1 ? 0.38 : 0.15,
        gain: 0.18,
        delay: idx * 0.08,
      });
    });
  }
}

const AVATAR_PRESETS = [
  {
    id: 0,
    bg: 'url("assets/lobby/owl.png") center / cover no-repeat',
    svg: '',
  },
  {
    id: 1,
    bg: 'linear-gradient(135deg, #b99a5b 0%, #86692f 100%)',
    svg: '<svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9 9 9"/></svg>',
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
    svg: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/></svg>',
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #b5654a 0%, #7d3c26 100%)',
    svg: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/></svg>',
  },
  {
    id: 4,
    bg: 'linear-gradient(135deg, #5e7a8c 0%, #344955 100%)',
    svg: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.4A7 7 0 0 1 10.4 3.1C10.9 3 11.5 3 12 3z"/></svg>',
  },
  {
    id: 5,
    bg: 'linear-gradient(135deg, #8e6c88 0%, #573d52 100%)',
    svg: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 2L4 7l8 5 8-5-8-5zM4 12l8 5 8-5M4 17l8 5 8-5"/></svg>',
  },
];
const RAPIDS_STAGES = [
  { target: 5, reward: 10 },
  { target: 10, reward: 20 },
  { target: 25, reward: 25 },
  { target: 50, reward: 50 },
  { target: 100, reward: 100 },
];
const WHEEL_BASE_REWARDS = [5, 10, 5, 20, 5, 50];
const WHEEL_PRIZE_ART = [1, 4, 5, 2, 6, 3];
const WHEEL_DAILY_MAX_SPINS = 6;
const TOURNAMENT_DURATION_MS = 24 * 60 * 60 * 1000;
const TOURNAMENT_BOT_TEMPLATES = [
  { id: 'bot1', name: 'Olivia', baseScore: 42 },
  { id: 'bot2', name: 'Ethan', baseScore: 35 },
  { id: 'bot3', name: 'Sophia', baseScore: 29 },
  { id: 'bot4', name: 'Lucas', baseScore: 24 },
  { id: 'bot5', name: 'Chloe', baseScore: 19 },
  { id: 'bot6', name: 'Mason', baseScore: 15 },
  { id: 'bot7', name: 'Mia', baseScore: 11 },
  { id: 'bot8', name: 'Noah', baseScore: 8 },
  { id: 'bot9', name: 'Aria', baseScore: 5 },
  { id: 'bot10', name: 'Leo', baseScore: 3 },
];

class GameFramework {
  constructor() {
    this.sound = new SoundManager();
    this.clock = 0;
    this.lastFrameTime = performance.now();

    this.state = {
      currentScreen: 'lobby',
      levelIndex: 0,
      isDaily: false,
      eventActive: false,
      eventThemeIndex: 0,
      eventProgress: 0,
      tournamentActive: false,
      tournamentScore: 0,
      tournamentEndTime: 0,
      tournamentBots: this.createDefaultTournamentBots(),
      chestProgress: 0,
      wheelUpgraded: false,
      wheelSpinsUsed: 0,
      rapidsActive: false,
      rapidsClearedCount: 0,
      rapidsClaimedStage: 0,
      virtualTimeOffsetMs: 0,
      playerName: 'Player_01',
      avatarIndex: 0,
      coins: 2450,
      score: 0,
      paused: false,
    };

    this.isDragging = false;
    this.selectedChain = [];
    this.solvedWords = new Set();
    this.bonusWords = new Set();
    this.bonusProgress = 0;
    this.learnedWordsAllTime = new Set();
    this.weeklyStats = null;
    this.levelTournamentPoints = 0;
    this.lastTournamentTimerSec = -1;
    this.lastDebugClockSec = -1;
    this.wheelSpinning = false;
    this.wheelRotation = 0;
    this.rapidsAnimating = false;
    this.rapidsInResultMode = false;
    this.collectibles = [];
    this.mainSession = null;
    this.dailySession = null;
    this.dailyWinDays = new Set();
    this.toastTimer = null;
    this.pointerPos = null;
    this.feedbackLock = false;
    this.tiles = [];

    this.mountain = new MountainChallenge(this);
    this.loadProgress();
    this.ensureCurrentWeekStats();
    this.lastVirtualDateKey = this.getTodayDateTitle();
    this.initDOM();
    this.bindEvents();
    this.fxResize();
    this.updateLobbyUI();
    this.updateDebugPanel();
    requestAnimationFrame((now) => this.frame(now));
  }

  getCurrentWeekKey() {
    const d = this.getNowDate();
    const dayOffset = (d.getDay() + 6) % 7; // 周一为 0，周日为 6
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dayOffset);
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const day = String(monday.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  getCurrentWeekDayIndex() {
    return (this.getNowDate().getDay() + 6) % 7;
  }

  createDefaultWeeklyStats() {
    return {
      weekKey: this.getCurrentWeekKey(),
      levelsCleared: 0,
      newWordsCount: 0,
      reviewedWordsCount: 0,
      dailyWords: [0, 0, 0, 0, 0, 0, 0],
    };
  }

  ensureCurrentWeekStats() {
    const curWeekKey = this.getCurrentWeekKey();
    if (
      !this.weeklyStats ||
      this.weeklyStats.weekKey !== curWeekKey ||
      !Array.isArray(this.weeklyStats.dailyWords) ||
      this.weeklyStats.dailyWords.length !== 7
    ) {
      this.weeklyStats = this.createDefaultWeeklyStats();
    }
  }

  recordWordLearned(word) {
    if (!word || this.state.isCustom) return;
    this.ensureCurrentWeekStats();
    const dayIdx = this.getCurrentWeekDayIndex();
    this.weeklyStats.dailyWords[dayIdx] = (this.weeklyStats.dailyWords[dayIdx] || 0) + 1;

    if (this.learnedWordsAllTime.has(word)) {
      this.weeklyStats.reviewedWordsCount += 1;
    } else {
      this.learnedWordsAllTime.add(word);
      this.weeklyStats.newWordsCount += 1;
    }
  }

  recordLevelCleared() {
    if (this.state.isCustom) return;
    this.ensureCurrentWeekStats();
    this.weeklyStats.levelsCleared += 1;
  }

  getNowMs() {
    return Date.now() + (this.state.virtualTimeOffsetMs || 0);
  }

  getNowDate() {
    return new Date(this.getNowMs());
  }

  formatVirtualDateTime() {
    const d = this.getNowDate();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const wk = weeks[d.getDay()];
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${y}年${m}月${day}日 ${wk} ${hh}:${mm}:${ss}`;
  }

  createDefaultTournamentBots() {
    return TOURNAMENT_BOT_TEMPLATES.map((b, idx) => ({
      id: b.id,
      name: b.name,
      score: b.baseScore,
      order: idx,
    }));
  }

  getStorageKey() {
    return 'word_logic_puzzle_save_v1';
  }

  resetAllProgress() {
    try {
      localStorage.removeItem(this.getStorageKey());
    } catch (e) {
      // 忽略本地存储清理异常
    }

    this.gameRun = null;
    this.mountain.reset();
    this.state.levelIndex = 0;
    this.state.isDaily = false;
    this.state.isCustom = false;
    this.dailyWinDays.clear();
    this.state.eventActive = false;
    this.state.eventThemeIndex = 0;
    this.state.eventProgress = 0;
    this.state.tournamentActive = false;
    this.state.tournamentScore = 0;
    this.state.tournamentEndTime = 0;
    this.state.tournamentBots = this.createDefaultTournamentBots();
    this.state.chestProgress = 0;
    this.state.wheelUpgraded = false;
    this.state.wheelSpinsUsed = 0;
    this.state.rapidsActive = false;
    this.state.rapidsClearedCount = 0;
    this.state.rapidsClaimedStage = 0;
    this.state.virtualTimeOffsetMs = 0;
    this.state.playerName = 'Player_01';
    this.state.avatarIndex = 0;
    this.state.coins = 2450;
    this.state.score = 0;
    this.state.paused = false;

    this.bonusProgress = 0;
    this.learnedWordsAllTime.clear();
    this.weeklyStats = this.createDefaultWeeklyStats();
    this.solvedWords.clear();
    this.bonusWords.clear();
    this.levelTournamentPoints = 0;
    this.mainSession = null;
    this.dailySession = null;
    this.wheelSpinning = false;
    this.wheelRotation = 0;
    this.rapidsAnimating = false;
    this.rapidsInResultMode = false;
    this.lastVirtualDateKey = this.getTodayDateTitle();
    materialSet = null;

    if (this.elWheelDisc) {
      this.elWheelDisc.style.transition = 'none';
      this.elWheelDisc.style.transform = 'rotate(0deg)';
      void this.elWheelDisc.offsetWidth;
      this.elWheelDisc.style.transition = '';
    }

    [
      this.modalEvent,
      this.modalTournament,
      this.modalTournamentRankup,
      this.modalWheel,
      this.modalRapids,
      this.modalProfile,
      this.modalPause,
      this.modalBonus,
    ].forEach((m) => {
      if (m) m.classList.remove('active');
    });

    this.switchScreen('lobby');
    this.updateLobbyUI();
    this.updateBonusUI();
    this.updateHudEventUI(false);
    this.updateDebugPanel();
    this.saveProgress();
  }

  loadProgress() {
    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data.levelIndex === 'number') this.state.levelIndex = data.levelIndex;
      if (typeof data.coins === 'number') this.state.coins = data.coins;
      if (typeof data.eventActive === 'boolean') this.state.eventActive = data.eventActive;
      if (typeof data.eventThemeIndex === 'number') this.state.eventThemeIndex = data.eventThemeIndex;
      if (typeof data.eventProgress === 'number') this.state.eventProgress = data.eventProgress;
      if (typeof data.tournamentActive === 'boolean') this.state.tournamentActive = data.tournamentActive;
      if (typeof data.tournamentScore === 'number') this.state.tournamentScore = data.tournamentScore;
      if (typeof data.tournamentEndTime === 'number') this.state.tournamentEndTime = data.tournamentEndTime;
      if (Array.isArray(data.tournamentBots) && data.tournamentBots.length === 10) {
        this.state.tournamentBots = data.tournamentBots;
      }
      if (typeof data.chestProgress === 'number') this.state.chestProgress = data.chestProgress;
      if (typeof data.wheelUpgraded === 'boolean') this.state.wheelUpgraded = data.wheelUpgraded;
      if (typeof data.rapidsActive === 'boolean') this.state.rapidsActive = data.rapidsActive;
      if (typeof data.virtualTimeOffsetMs === 'number') {
        this.state.virtualTimeOffsetMs = data.virtualTimeOffsetMs;
      }
      this.mountain.load(data.mountainSeason);
      if (typeof data.playerName === 'string' && data.playerName.trim()) {
        this.state.playerName = data.playerName.trim();
      }
      if (typeof data.avatarIndex === 'number') {
        this.state.avatarIndex = data.avatarIndex;
      }
      if (Array.isArray(data.learnedWordsAllTime)) {
        this.learnedWordsAllTime = new Set(data.learnedWordsAllTime);
      }
      if (data.weeklyStats && typeof data.weeklyStats === 'object') {
        this.weeklyStats = data.weeklyStats;
      }
      if (typeof data.bonusProgress === 'number') this.bonusProgress = data.bonusProgress;
      if (typeof data.soundEnabled === 'boolean') this.sound.enabled = data.soundEnabled;
      if (typeof data.paletteIndex === 'number' && PALETTE[data.paletteIndex]) {
        selectedPalette = PALETTE[data.paletteIndex];
      }
      const today = this.getTodayDateTitle();
      if (Array.isArray(data.dailyWinDays)) {
        this.dailyWinDays = new Set(data.dailyWinDays.filter(Number.isInteger));
      } else if (data.dailyCheckedIn) {
        const now = this.getNowDate();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const day = this.getDailyDayIndex();
        if (data.dailyCheckinDate === today) this.dailyWinDays.add(day);
        if (data.dailyCheckinDate === this.getTodayDateTitle(yesterday)) this.dailyWinDays.add(day - 1);
      }
      if (data.dailyCheckinDate === today) {
        this.dailySession = data.dailySession || null;
      }
      if (data.wheelSpinDate === today && typeof data.wheelSpinsUsed === 'number') {
        this.state.wheelSpinsUsed = data.wheelSpinsUsed;
      }
      if (data.rapidsDate === today) {
        if (typeof data.rapidsClearedCount === 'number') {
          this.state.rapidsClearedCount = data.rapidsClearedCount;
        }
        if (typeof data.rapidsClaimedStage === 'number') {
          this.state.rapidsClaimedStage = data.rapidsClaimedStage;
        }
      }
      this.mainSession = data.mainSession || null;
    } catch (e) {
      // 忽略本地存储读取异常
    }
  }

  captureCurrentSession() {
    if (!this.currentLevel || this.tiles.length === 0) return null;
    if (this.solvedWords.size >= this.currentLevel.targets.length) return null;

    const rows = this.currentLevel.grid.length;
    const cols = this.currentLevel.grid[0].length;
    const tileLayers = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (const t of this.tiles) {
      tileLayers[t.row][t.col] = Math.max(0, t.layers);
    }

    const hintedSlots = [];
    if (this.elTargetWords) {
      this.elTargetWords.querySelectorAll('.target-word').forEach((wordEl) => {
        const w = wordEl.dataset.word;
        wordEl.querySelectorAll('.target-slot').forEach((slot, idx) => {
          if (slot.classList.contains('hinted')) {
            hintedSlots.push({ word: w, idx });
          }
        });
      });
    }

    return {
      levelIndex: this.state.levelIndex,
      date: this.getTodayDateTitle(),
      score: this.state.score,
      levelTournamentPoints: this.levelTournamentPoints,
      solvedWords: Array.from(this.solvedWords),
      bonusWords: Array.from(this.bonusWords),
      tileLayers,
      hintedSlots,
      collectibles: this.collectibles.map((c) => ({
        r: c.r,
        c: c.c,
        collected: c.collected,
      })),
    };
  }

  saveProgress() {
    try {
      if (this.state.currentScreen === 'game' && this.currentLevel && !this.state.isCustom) {
        const snap = this.captureCurrentSession();
        if (this.state.isDaily) {
          this.dailySession = snap;
        } else {
          this.mainSession = snap;
        }
      }
      const paletteIndex = Math.max(0, PALETTE.indexOf(selectedPalette));
      const payload = {
        levelIndex: this.state.levelIndex,
        mountainSeason: this.mountain.data,
        coins: this.state.coins,
        dailyWinDays: Array.from(this.dailyWinDays),
        dailyCheckinDate: this.getTodayDateTitle(),
        eventActive: this.state.eventActive,
        eventThemeIndex: this.state.eventThemeIndex,
        eventProgress: this.state.eventProgress,
        tournamentActive: this.state.tournamentActive,
        tournamentScore: this.state.tournamentScore,
        tournamentEndTime: this.state.tournamentEndTime,
        tournamentBots: this.state.tournamentBots,
        chestProgress: this.state.chestProgress,
        wheelUpgraded: this.state.wheelUpgraded,
        wheelSpinsUsed: this.state.wheelSpinsUsed,
        wheelSpinDate: this.getTodayDateTitle(),
        rapidsActive: this.state.rapidsActive,
        rapidsClearedCount: this.state.rapidsClearedCount,
        rapidsClaimedStage: this.state.rapidsClaimedStage,
        rapidsDate: this.getTodayDateTitle(),
        virtualTimeOffsetMs: this.state.virtualTimeOffsetMs,
        playerName: this.state.playerName,
        avatarIndex: this.state.avatarIndex,
        learnedWordsAllTime: Array.from(this.learnedWordsAllTime),
        weeklyStats: this.weeklyStats,
        bonusProgress: this.bonusProgress,
        soundEnabled: this.sound.enabled,
        paletteIndex,
        mainSession: this.mainSession,
        dailySession: this.dailySession,
      };
      localStorage.setItem(this.getStorageKey(), JSON.stringify(payload));
    } catch (e) {
      // 忽略本地存储写入异常
    }
  }

  initDOM() {
    this.phoneFrame = document.querySelector('.phone-frame');
    this.screens = {
      lobby: document.getElementById('screen-lobby'),
      game: document.getElementById('screen-game'),
      result: document.getElementById('screen-result'),
      editor: document.getElementById('screen-editor'),
    };

    this.btnPlayerProfile = document.getElementById('btn-player-profile');
    this.elLobbyAvatar = document.getElementById('lobby-avatar');
    this.modalProfile = document.getElementById('modal-profile');
    this.elProfileAvatarPreview = document.getElementById('profile-avatar-preview');
    this.elProfileIdInput = document.getElementById('profile-id-input');
    this.elProfileAvatarGrid = document.getElementById('profile-avatar-grid');
    this.elProfileStatLevels = document.getElementById('profile-stat-levels');
    this.elProfileStatNew = document.getElementById('profile-stat-new');
    this.elProfileStatReview = document.getElementById('profile-stat-review');
    this.elProfileBarChart = document.getElementById('profile-bar-chart');
    this.elStartLevelLabel = document.getElementById('start-level-label');
    this.btnDailyCheckin = document.getElementById('btn-daily-checkin');
    this.elDailyEntryCount = this.btnDailyCheckin?.querySelector('.daily-entry-count');
    this.elDailyEntryStatus = document.getElementById('daily-entry-status');
    this.btnEventEntry = document.getElementById('btn-event-entry');
    this.elLobbyEventProg = document.getElementById('lobby-event-prog');
    this.modalEvent = document.getElementById('modal-event');
    this.elEventBanner = document.getElementById('event-banner');
    this.elEventThemeTitle = document.getElementById('event-theme-title');
    this.elEventItemPreview = document.getElementById('event-item-preview');
    this.elEventProgressText = document.getElementById('event-progress-text');
    this.elEventProgressFill = document.getElementById('event-progress-fill');
    this.elEventHudToast = document.getElementById('event-hud-toast');
    this.elHudEventIcon = document.getElementById('hud-event-icon');
    this.elHudEventRingBar = document.getElementById('hud-event-ring-bar');
    this.elHudEventCount = document.getElementById('hud-event-count');
    this.btnTournamentEntry = document.getElementById('btn-tournament-entry');
    this.modalTournament = document.getElementById('modal-tournament');
    this.elTournamentTimerText = document.getElementById('tournament-timer-text');
    this.elTournamentLeaderboard = document.getElementById('tournament-leaderboard');
    this.elTournamentSettleNotice = document.getElementById('tournament-settle-notice');
    this.btnTournamentJoin = document.getElementById('btn-tournament-join');
    this.btnTournamentSettle = document.getElementById('btn-tournament-settle');
    this.modalTournamentRankup = document.getElementById('modal-tournament-rankup');
    this.elRankupGainPill = document.getElementById('rankup-gain-pill');
    this.elRankupStage = document.getElementById('rankup-stage');
    this.elRankupList = document.getElementById('rankup-list');
    this.btnWheelEntry = document.getElementById('btn-wheel-entry');
    this.modalWheel = document.getElementById('modal-wheel');
    this.elWheelCoins = document.getElementById('wheel-coins');
    this.elWheelDisc = document.getElementById('wheel-disc');
    this.elWheelSectors = document.getElementById('wheel-sectors');
    this.elWheelUpgradeBanner = document.getElementById('wheel-upgrade-banner');
    this.elWheelRewardToast = document.getElementById('wheel-reward-toast');
    this.btnWheelSpin = document.getElementById('btn-wheel-spin');
    this.elWheelQuotaText = document.getElementById('wheel-quota-text');
    this.btnRapidsEntry = document.getElementById('btn-rapids-entry');
    this.modalRapids = document.getElementById('modal-rapids');
    this.elRapidsStageTag = document.getElementById('rapids-stage-tag');
    this.elRapidsProgressText = document.getElementById('rapids-progress-text');
    this.elRapidsRiverStage = document.getElementById('rapids-river-stage');
    this.elRapidsNodesTrack = document.getElementById('rapids-nodes-track');
    this.elRapidsRewardToast = document.getElementById('rapids-reward-toast');
    this.btnRapidsAction = document.getElementById('btn-rapids-action');
    this.elDbgVirtualTime = document.getElementById('dbg-virtual-time');
    this.elDbgTimeOffsetTag = document.getElementById('dbg-time-offset-tag');
    this.elDbgStatusCollect = document.getElementById('dbg-status-collect');
    this.elDbgStatusTournament = document.getElementById('dbg-status-tournament');
    this.elDbgStatusDaily = document.getElementById('dbg-status-daily');
    this.elDbgStatusWheel = document.getElementById('dbg-status-wheel');
    this.elDbgStatusRapids = document.getElementById('dbg-status-rapids');
    this.elDbgCoinVal = document.getElementById('dbg-coin-val');
    this.elDebugGamePanel = document.getElementById('debug-game-panel');
    this.btnDbgGameWin = document.getElementById('dbg-game-win');
    this.btnDbgGameFillWord = document.getElementById('dbg-game-fill-word');
    this.btnDbgGameUndo = document.getElementById('dbg-game-undo');
    this.elCoins = document.getElementById('lobby-coins');
    this.elGameLevelId = document.getElementById('game-level-id');
    this.elGameCoins = document.getElementById('game-coins');
    this.modalPause = document.getElementById('modal-pause');
    this.modalBonus = document.getElementById('modal-bonus');
    this.btnBonusWords = document.getElementById('btn-bonus-words');
    this.elBonusCount = document.getElementById('bonus-count');
    this.elBonusRingBar = document.getElementById('bonus-ring-bar');
    this.elBonusWordsList = document.getElementById('bonus-words-list');
    this.btnToggleSound = document.getElementById('btn-toggle-sound');
    this.elSwatches = document.getElementById('swatches');

    this.elTargetWords = document.getElementById('target-words');
    this.elCurrentWordBar = document.getElementById('current-word-bar');
    this.elBoardContainer = document.getElementById('board-container');
    this.elBoardCollectibles = document.getElementById('board-collectibles');
    this.elBoardGrid = document.getElementById('board-grid');
    this.elBoardLines = document.getElementById('board-lines');
    this.fxCv = document.getElementById('fx');
    this.fxCx = this.fxCv ? this.fxCv.getContext('2d') : null;

    this.elResultNextLevel = document.getElementById('result-next-level');
    this.elResultRewardLabel = document.getElementById('result-reward-label');
    this.elResultChestCard = document.getElementById('result-chest-card');
    this.elResultChestLabel = document.getElementById('result-chest-label');
    this.elResultChestStep = document.getElementById('result-chest-step');
    this.elResultChestFill = document.getElementById('result-chest-fill');
  }

  bindEvents() {
    if (this.elSwatches) {
      const initIdx = Math.max(0, PALETTE.indexOf(selectedPalette));
      PALETTE.forEach((p, idx) => {
        const b = document.createElement('button');
        b.className = 'sw' + (idx === initIdx ? ' on' : '');
        b.type = 'button';
        b.title = `SelectionColors[${idx}]  ${p.Base} / ${p.Bevel}`;
        b.style.background = `linear-gradient(160deg, ${p.Base} 0 50%, ${p.Bevel} 50% 100%)`;
        b.addEventListener('click', () => {
          this.sound.playClick();
          selectedPalette = p;
          [...this.elSwatches.children].forEach((c) => c.classList.remove('on'));
          b.classList.add('on');
          this.tiles.forEach((t) => t.render());
          this.saveProgress();
        });
        this.elSwatches.appendChild(b);
      });
    }
    if (this.btnToggleSound) {
      this.btnToggleSound.textContent = `音效: ${this.sound.enabled ? '开' : '关'}`;
    }

    // 收集活动弹窗事件
    if (this.btnEventEntry) {
      this.btnEventEntry.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleEventModal(true);
      });
    }
    if (this.elHudEventIcon) {
      this.elHudEventIcon.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleEventModal(true);
      });
    }
    const btnCloseEvent = document.getElementById('btn-close-event');
    if (btnCloseEvent) {
      btnCloseEvent.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleEventModal(false);
      });
    }
    if (this.modalEvent) {
      this.modalEvent.addEventListener('click', (e) => {
        if (e.target === this.modalEvent) {
          this.sound.playClick();
          this.toggleEventModal(false);
        }
      });
    }
    const btnEventPrev = document.getElementById('btn-event-prev');
    if (btnEventPrev) {
      btnEventPrev.addEventListener('click', () => {
        this.sound.playClick();
        this.state.eventThemeIndex =
          (this.state.eventThemeIndex - 1 + EVENT_THEMES.length) % EVENT_THEMES.length;
        this.renderEventModal();
        this.syncActiveEventThemeInGame();
        this.saveProgress();
      });
    }
    const btnEventNext = document.getElementById('btn-event-next');
    if (btnEventNext) {
      btnEventNext.addEventListener('click', () => {
        this.sound.playClick();
        this.state.eventThemeIndex = (this.state.eventThemeIndex + 1) % EVENT_THEMES.length;
        this.renderEventModal();
        this.syncActiveEventThemeInGame();
        this.saveProgress();
      });
    }
    const btnEventJoin = document.getElementById('btn-event-join');
    if (btnEventJoin) {
      btnEventJoin.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleEventModal(false);
        if (this.state.currentScreen === 'game') {
          this.state.eventActive = true;
          this.syncActiveEventThemeInGame();
          this.saveProgress();
        } else {
          this.state.eventActive = true;
          this.startGame(false);
        }
      });
    }

    // 锦标赛弹窗事件
    if (this.btnTournamentEntry) {
      this.btnTournamentEntry.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleTournamentModal(true);
      });
    }
    const btnCloseTournament = document.getElementById('btn-close-tournament');
    if (btnCloseTournament) {
      btnCloseTournament.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleTournamentModal(false);
      });
    }
    if (this.modalTournament) {
      this.modalTournament.addEventListener('click', (e) => {
        if (e.target === this.modalTournament) {
          this.sound.playClick();
          this.toggleTournamentModal(false);
        }
      });
    }
    if (this.btnTournamentJoin) {
      this.btnTournamentJoin.addEventListener('click', () => {
        this.sound.playClick();
        if (this.state.tournamentActive && this.getNowMs() >= this.state.tournamentEndTime) {
          this.settleTournament();
          return;
        }
        if (!this.state.tournamentActive) {
          this.state.tournamentActive = true;
          this.state.tournamentScore = 0;
          this.state.tournamentEndTime = this.getNowMs() + TOURNAMENT_DURATION_MS;
          this.state.tournamentBots = this.createDefaultTournamentBots();
          if (this.elTournamentSettleNotice) {
            this.elTournamentSettleNotice.classList.remove('visible');
          }
        }
        this.toggleTournamentModal(false);
        this.startGame(false);
        this.updateDebugPanel();
      });
    }
    if (this.btnTournamentSettle) {
      this.btnTournamentSettle.addEventListener('click', () => {
        this.sound.playClick();
        this.settleTournament();
      });
    }

    // 幸运转盘弹窗事件
    if (this.btnWheelEntry) {
      this.btnWheelEntry.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleWheelModal(true);
      });
    }
    const btnCloseWheel = document.getElementById('btn-close-wheel');
    if (btnCloseWheel) {
      btnCloseWheel.addEventListener('click', () => {
        if (this.wheelSpinning) return;
        this.sound.playClick();
        this.toggleWheelModal(false);
      });
    }
    if (this.modalWheel) {
      this.modalWheel.addEventListener('click', (e) => {
        if (e.target === this.modalWheel && !this.wheelSpinning) {
          this.sound.playClick();
          this.toggleWheelModal(false);
        }
      });
    }
    if (this.btnWheelSpin) {
      this.btnWheelSpin.addEventListener('click', () => {
        this.spinWheel();
      });
    }

    // 激流勇进活动弹窗事件
    if (this.btnRapidsEntry) {
      this.btnRapidsEntry.addEventListener('click', () => {
        this.sound.playClick();
        this.rapidsInResultMode = false;
        this.toggleRapidsModal(true);
      });
    }
    const btnCloseRapids = document.getElementById('btn-close-rapids');
    if (btnCloseRapids) {
      btnCloseRapids.addEventListener('click', () => {
        if (this.rapidsAnimating) return;
        this.sound.playClick();
        this.toggleRapidsModal(false);
      });
    }
    if (this.modalRapids) {
      this.modalRapids.addEventListener('click', (e) => {
        if (e.target === this.modalRapids && !this.rapidsAnimating) {
          this.sound.playClick();
          this.toggleRapidsModal(false);
        }
      });
    }
    if (this.btnRapidsAction) {
      this.btnRapidsAction.addEventListener('click', () => {
        if (this.rapidsAnimating) return;
        this.sound.playClick();
        this.toggleRapidsModal(false);
        if (this.rapidsInResultMode) {
          this.rapidsInResultMode = false;
          return;
        }
        this.state.rapidsActive = true;
        this.updateDebugPanel();
        this.startGame(false);
      });
    }

    // 个人信息弹窗事件
    if (this.btnPlayerProfile) {
      this.btnPlayerProfile.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleProfileModal(true);
      });
    }
    const btnCloseProfile = document.getElementById('btn-close-profile');
    if (btnCloseProfile) {
      btnCloseProfile.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleProfileModal(false);
      });
    }
    if (this.modalProfile) {
      this.modalProfile.addEventListener('click', (e) => {
        if (e.target === this.modalProfile) {
          this.sound.playClick();
          this.toggleProfileModal(false);
        }
      });
    }
    if (this.elProfileIdInput) {
      const saveName = () => {
        const val = this.elProfileIdInput.value.trim();
        this.state.playerName = val || 'Player_01';
        this.saveProgress();
      };
      this.elProfileIdInput.addEventListener('input', saveName);
      this.elProfileIdInput.addEventListener('blur', () => {
        if (!this.elProfileIdInput.value.trim()) {
          this.elProfileIdInput.value = this.state.playerName;
        }
      });
    }

    // 左侧测试面板事件绑定
    document.querySelectorAll('[data-dbg-time]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        const deltaMs = Number(btn.getAttribute('data-dbg-time')) || 0;
        this.adjustVirtualTime(deltaMs);
      });
    });
    const btnTimeReset = document.getElementById('dbg-time-reset');
    if (btnTimeReset) {
      btnTimeReset.addEventListener('click', () => {
        this.sound.playClick();
        this.adjustVirtualTime(-this.state.virtualTimeOffsetMs);
      });
    }

    const btnDbgToggleCollect = document.getElementById('dbg-toggle-collect');
    if (btnDbgToggleCollect) {
      btnDbgToggleCollect.addEventListener('click', () => {
        this.sound.playClick();
        this.state.eventActive = !this.state.eventActive;
        if (this.state.currentScreen === 'game' && !this.state.isDaily && !this.state.isCustom) {
          if (this.state.eventActive) {
            this.syncActiveEventThemeInGame();
            this.renderCollectibles();
          } else {
            materialSet = null;
            this.tiles.forEach((t) => t.applyStyle());
            this.renderCollectibles();
          }
        }
        this.updateDebugPanel();
        this.saveProgress();
      });
    }

    const btnDbgAddCollect = document.getElementById('dbg-add-collect');
    if (btnDbgAddCollect) {
      btnDbgAddCollect.addEventListener('click', () => {
        this.sound.playClick();
        this.state.eventActive = true;
        this.state.eventProgress += 1;
        const reachedFive = this.state.eventProgress >= 5;
        if (reachedFive) {
          this.state.eventProgress = 0;
          this.state.coins += 20;
          this.sound.playVictory();
        }
        this.updateLobbyUI();
        if (this.state.currentScreen === 'game') {
          this.updateGameHUD();
          this.updateHudEventUI(reachedFive);
        }
        if (this.modalEvent && this.modalEvent.classList.contains('active')) {
          this.renderEventModal();
        }
        this.updateDebugPanel();
        this.saveProgress();
      });
    }

    const btnDbgToggleTour = document.getElementById('dbg-toggle-tournament');
    if (btnDbgToggleTour) {
      btnDbgToggleTour.addEventListener('click', () => {
        this.sound.playClick();
        if (!this.state.tournamentActive) {
          this.state.tournamentActive = true;
          this.state.tournamentScore = 0;
          this.state.tournamentEndTime = this.getNowMs() + TOURNAMENT_DURATION_MS;
          this.state.tournamentBots = this.createDefaultTournamentBots();
        } else {
          this.state.tournamentActive = false;
        }
        if (this.modalTournament && this.modalTournament.classList.contains('active')) {
          this.renderTournamentModal();
        }
        this.updateDebugPanel();
        this.saveProgress();
      });
    }

    const btnDbgAddTourPt = document.getElementById('dbg-add-tournament-pt');
    if (btnDbgAddTourPt) {
      btnDbgAddTourPt.addEventListener('click', () => {
        this.sound.playClick();
        if (!this.state.tournamentActive) {
          this.state.tournamentActive = true;
          this.state.tournamentEndTime = this.getNowMs() + TOURNAMENT_DURATION_MS;
          this.state.tournamentBots = this.createDefaultTournamentBots();
        }
        this.state.tournamentScore += 5;
        if (this.modalTournament && this.modalTournament.classList.contains('active')) {
          this.renderTournamentModal();
        }
        this.updateDebugPanel();
        this.saveProgress();
      });
    }

    const btnDbgResetDaily = document.getElementById('dbg-reset-daily');
    if (btnDbgResetDaily) {
      btnDbgResetDaily.addEventListener('click', () => {
        this.sound.playClick();
        this.dailyWinDays.delete(this.getDailyDayIndex());
        this.dailySession = null;
        this.updateLobbyUI();
        this.updateDebugPanel();
        this.saveProgress();
      });
    }

    const btnDbgToggleRapids = document.getElementById('dbg-toggle-rapids');
    if (btnDbgToggleRapids) {
      btnDbgToggleRapids.addEventListener('click', () => {
        this.sound.playClick();
        this.state.rapidsActive = !this.state.rapidsActive;
        this.updateDebugPanel();
        this.saveProgress();
      });
    }

    const btnDbgAddRapids = document.getElementById('dbg-add-rapids');
    if (btnDbgAddRapids) {
      btnDbgAddRapids.addEventListener('click', () => {
        this.sound.playClick();
        this.state.rapidsActive = true;
        const stageIdx = Math.min(this.state.rapidsClaimedStage, RAPIDS_STAGES.length - 1);
        const target = RAPIDS_STAGES[stageIdx].target;
        this.state.rapidsClearedCount = Math.max(this.state.rapidsClearedCount + 5, target);
        this.updateDebugPanel();
        this.saveProgress();
        this.switchScreen('result');
        this.checkAndTriggerRapidsAtResult();
      });
    }

    const btnDbgResetWheel = document.getElementById('dbg-reset-wheel');
    if (btnDbgResetWheel) {
      btnDbgResetWheel.addEventListener('click', () => {
        this.sound.playClick();
        this.state.wheelSpinsUsed = 0;
        this.state.wheelUpgraded = false;
        if (this.modalWheel && this.modalWheel.classList.contains('active')) {
          this.renderWheelModal();
        }
        this.updateDebugPanel();
        this.saveProgress();
      });
    }

    document.querySelectorAll('[data-dbg-coin]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sound.playClick();
        const delta = Number(btn.getAttribute('data-dbg-coin')) || 0;
        this.state.coins = Math.max(0, this.state.coins + delta);
        this.updateLobbyUI();
        if (this.elGameCoins) {
          this.elGameCoins.textContent = this.state.coins.toLocaleString();
        }
        this.updateDebugPanel();
        this.saveProgress();
      });
    });

    const btnDbgResetAll = document.getElementById('dbg-reset-all');
    if (btnDbgResetAll) {
      btnDbgResetAll.addEventListener('click', () => {
        this.sound.playClick();
        this.resetAllProgress();
      });
    }

    // 右侧局内测试操作面板事件
    if (this.btnDbgGameWin) {
      this.btnDbgGameWin.addEventListener('click', () => {
        this.quickWinCurrentLevel();
      });
    }
    if (this.btnDbgGameFillWord) {
      this.btnDbgGameFillWord.addEventListener('click', () => {
        this.quickFillNextWord();
      });
    }
    document.getElementById('dbg-game-bonus-word')?.addEventListener('click', () => {
      this.quickDiscoverBonusWord();
    });
    if (this.btnDbgGameUndo) {
      this.btnDbgGameUndo.addEventListener('click', () => {
        this.undoLastStep();
      });
    }

    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.sound.playClick();
      this.startGame(false);
    });
    if (this.btnDailyCheckin) {
      this.btnDailyCheckin.addEventListener('click', () => {
        this.sound.playClick();
        this.startGame(true);
      });
    }
    ['btn-lobby-settings', 'btn-pause'].forEach((id) => {
      document.getElementById(id).addEventListener('click', () => {
        this.sound.playClick();
        this.togglePause(true);
      });
    });
    this.btnToggleSound.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.btnToggleSound.textContent = `音效: ${this.sound.enabled ? '开' : '关'}`;
      if (this.sound.enabled) {
        this.sound.playClick();
      }
      this.saveProgress();
    });
    document.getElementById('btn-resume').addEventListener('click', () => {
      this.sound.playClick();
      this.togglePause(false);
    });
    document.getElementById('btn-quit-to-lobby').addEventListener('click', () => {
      this.sound.playClick();
      this.saveProgress();
      this.togglePause(false);
      if (this.state.isCustom && window.LevelEditor) { window.LevelEditor.open(); return; }
      this.switchScreen('lobby');
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
      this.sound.playClick();
      if (this.state.isCustom && window.LevelEditor) { window.LevelEditor.open(); return; }
      this.startGame(false);
    });

    const btnHint = document.getElementById('btn-hint');
    if (btnHint) {
      btnHint.addEventListener('click', () => {
        this.useHint();
      });
    }

    if (this.btnBonusWords) {
      this.btnBonusWords.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleBonusModal(true);
      });
    }

    const btnCloseBonus = document.getElementById('btn-close-bonus');
    if (btnCloseBonus) {
      btnCloseBonus.addEventListener('click', () => {
        this.sound.playClick();
        this.toggleBonusModal(false);
      });
    }
    if (this.modalBonus) {
      this.modalBonus.addEventListener('click', (e) => {
        if (e.target === this.modalBonus) {
          this.sound.playClick();
          this.toggleBonusModal(false);
        }
      });
    }

    // 棋盘滑动连接事件
    this.elBoardGrid.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', () => this.onPointerUp());
    window.addEventListener('pointercancel', () => this.onPointerUp());
    window.addEventListener('resize', () => this.fxResize());
  }

  fxResize() {
    if (!this.fxCv || !this.phoneFrame) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = this.phoneFrame.clientWidth || window.innerWidth;
    const h = this.phoneFrame.clientHeight || window.innerHeight;
    this.fxCv.width = Math.max(1, Math.round(w * dpr));
    this.fxCv.height = Math.max(1, Math.round(h * dpr));
  }

  fxBurst(tile, matName) {
    if (!this.fxCx || !this.phoneFrame) return;
    const key = matName && FX_DATA[matName] ? matName : 'Default';
    const nodes = FX_DATA[key];
    if (!nodes) return;
    const pr = this.phoneFrame.getBoundingClientRect();
    const tr = tile.el.getBoundingClientRect();
    const dpr = this.fxCv.width / (pr.width || 1);
    const ox = (tr.left - pr.left + tr.width * 0.5) * dpr;
    const oy = (tr.top - pr.top + tr.height * 0.5) * dpr;
    // 直接采用预览工程的 PXU = 100 参数，粒子尺寸与比例 100% 原样呈现
    const S = FX_PXU * dpr;

    const grp = [];
    for (const nd of nodes) {
      let count = 0;
      if (nd.b && nd.b.length) count = Math.round(pickConst(nd.b[0].n));
      else if (nd.rate && nd.rate.c) count = Math.round(nd.rate.c * nd.ss);
      if (count <= 0) continue;

      const parts = [];
      for (let i = 0; i < count; i++) {
        const a1 = Math.random() * Math.PI * 2;
        const rr = nd.sh[1] * (nd.sh[2] > 0 ? Math.sqrt(Math.random()) : 1);
        const a2 = Math.random() * Math.PI * 2;
        const spd = pickConst(nd.spd);
        const ct = Math.random();
        const c0 = nd.c[0], c1 = nd.c[1];
        parts.push({
          x: nd.p[0] + Math.cos(a1) * rr,
          y: nd.p[1] + Math.sin(a1) * rr,
          vx: Math.cos(a2) * spd,
          vy: Math.sin(a2) * spd,
          t: 0,
          life: Math.max(0.05, pickConst(nd.life)),
          sz: pickConst(nd.sz),
          szY: nd.sy ? pickConst(nd.sy) : 0,
          rot: pickConst(nd.rot),
          wr: Math.random(),
          wv: Math.random(),
          grv: pickConst(nd.grv),
          r: c0[0] + (c1[0] - c0[0]) * ct,
          g: c0[1] + (c1[1] - c0[1]) * ct,
          b: c0[2] + (c1[2] - c0[2]) * ct,
          a: c0[3] + (c1[3] - c0[3]) * ct,
        });
      }
      grp.push({ nd, parts, im: fxImage(nd.s), ar: nd.sw / nd.shh });
    }
    if (grp.length) fxBursts.push({ ox, oy, S, grp });
  }

  shatter(tile) {
    if (fxBreaks.has(tile)) return;
    const key = materialSet ? materialSet.name : 'Default';
    fxBreaks.set(tile, this.clock);
    tile.selected = false;
    tile.state = 'idle';
    tile.p = 0;
    tile.colorPhase = 0;
    tile.applyStyle();
    tile.el.style.pointerEvents = 'none';
    this.fxBurst(tile, FX_DATA[key] ? key : 'Default');
  }

  fxBreakStep() {
    for (const [t, at] of fxBreaks) {
      const age = this.clock - at;
      const op = age < BREAK_OUT ? 1 - age / BREAK_OUT : 0;
      t.el.style.opacity = op.toFixed(3);
    }
  }

  fxStep(dt) {
    for (let bi = fxBursts.length - 1; bi >= 0; bi--) {
      const B = fxBursts[bi];
      let live = 0;
      for (const G of B.grp) {
        const sim = G.nd.ss || 1;
        const parts = G.parts;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          const h = dt * sim;
          p.t += h;
          if (p.t >= p.life) {
            parts.splice(i, 1);
            continue;
          }
          live++;
          const u = p.t / p.life;
          p.vy += GRAV * p.grv * h;
          if (G.nd.vel && G.nd.vel.y) p.vy += curveSpec(G.nd.vel.y, u, p.wv);
          if (G.nd.vel && G.nd.vel.x) p.vx += curveSpec(G.nd.vel.x, u, p.wv);
          p.x += p.vx * h;
          p.y += p.vy * h;
          if (G.nd.roL) p.rot += curveSpec(G.nd.roL, u, p.wr) * h;
        }
      }
      if (!live) fxBursts.splice(bi, 1);
    }
  }

  fxDraw() {
    if (!this.fxCx) return;
    this.fxCx.clearRect(0, 0, this.fxCv.width, this.fxCv.height);
    for (const B of fxBursts) {
      for (const G of B.grp) {
        const img = G.im, nd = G.nd;
        if (!img.complete || !img.naturalWidth) continue;
        for (const p of G.parts) {
          const u = p.t / p.life;
          const k = nd.soL ? curveSpec(nd.soL, u, p.wr) : 1;
          if (k <= 0.002) continue;
          const side = p.sz * k * B.S;
          let w, h;
          if (p.szY) {
            w = side;
            h = p.szY * k * B.S;
          } else if (G.ar >= 1) {
            w = side;
            h = side / G.ar;
          } else {
            h = side;
            w = side * G.ar;
          }
          this.fxCx.globalAlpha = p.a < 0 ? 0 : p.a > 1 ? 1 : p.a;
          this.fxCx.save();
          this.fxCx.translate(B.ox + p.x * B.S, B.oy - p.y * B.S);
          this.fxCx.rotate(-p.rot);
          this.fxCx.drawImage(img, -w * 0.5, -h * 0.5, w, h);
          this.fxCx.restore();
        }
      }
    }
    this.fxCx.globalAlpha = 1;
  }

  frame(now) {
    const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;
    this.clock += dt;

    for (const t of this.tiles) {
      t.tick(this.clock);
    }
    this.fxBreakStep();
    this.fxStep(dt);
    this.fxDraw();

    if (this.state.tournamentActive && this.modalTournament && this.modalTournament.classList.contains('active')) {
      const remSec = Math.max(0, Math.floor((this.state.tournamentEndTime - this.getNowMs()) / 1000));
      if (remSec !== this.lastTournamentTimerSec) {
        this.lastTournamentTimerSec = remSec;
        if (this.elTournamentTimerText) {
          this.elTournamentTimerText.textContent = this.formatTournamentRemaining(remSec);
        }
        if (remSec === 0 && this.btnTournamentJoin) {
          this.btnTournamentJoin.textContent = '领取结算奖励';
        }
      }
    }

    const nowSec = Math.floor(this.getNowMs() / 1000);
    if (nowSec !== this.lastDebugClockSec) {
      this.lastDebugClockSec = nowSec;
      this.checkVirtualDayRollover();
      this.mountain.update();
      this.updateDebugPanel();
    }

    requestAnimationFrame((nextNow) => this.frame(nextNow));
  }

  switchScreen(target) {
    Object.entries(this.screens).forEach(([key, el]) => {
      el.classList.toggle('active', key === target);
    });
    this.state.currentScreen = target;
    if (this.elDebugGamePanel) {
      this.elDebugGamePanel.classList.toggle('active', target === 'game');
    }
    this.updateUndoButtonState();
  }

  getTodayDateTitle(now = this.getNowDate()) {
    const m = now.getMonth() + 1;
    const d = now.getDate();
    return `${m}月${d}日`;
  }

  getDailyDayIndex() {
    const now = this.getNowDate();
    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000;
  }

  getDailyStreak(today) {
    // 昨天的连胜保留到今天结束，今天通关后从今天开始计算。
    let day = this.dailyWinDays.has(today) ? today : today - 1;
    let streak = 0;
    while (this.dailyWinDays.has(day)) {
      streak += 1;
      day -= 1;
    }
    return streak;
  }

  adjustVirtualTime(deltaMs) {
    this.state.virtualTimeOffsetMs = (this.state.virtualTimeOffsetMs || 0) + deltaMs;
    this.checkVirtualDayRollover();
    if (this.state.currentScreen === 'game' && this.state.isDaily && this.elGameLevelId) {
      this.elGameLevelId.textContent = this.getTodayDateTitle();
    }
    if (this.modalTournament && this.modalTournament.classList.contains('active')) {
      this.renderTournamentModal();
    }
    if (this.modalWheel && this.modalWheel.classList.contains('active')) {
      this.renderWheelModal();
    }
    if (this.modalProfile && this.modalProfile.classList.contains('active')) {
      this.renderProfileModal();
    }
    this.updateLobbyUI();
    this.updateDebugPanel();
    this.saveProgress();
  }

  checkVirtualDayRollover() {
    const curDateKey = this.getTodayDateTitle();
    if (this.lastVirtualDateKey && curDateKey !== this.lastVirtualDateKey) {
      this.lastVirtualDateKey = curDateKey;
      this.dailySession = null;
      this.state.wheelSpinsUsed = 0;
      this.state.rapidsClearedCount = 0;
      this.state.rapidsClaimedStage = 0;
      this.updateLobbyUI();
      if (this.modalWheel && this.modalWheel.classList.contains('active')) {
        this.renderWheelModal();
      }
      if (this.modalRapids && this.modalRapids.classList.contains('active')) {
        this.renderRapidsModal();
      }
      this.saveProgress();
    }
  }

  updateDebugPanel() {
    if (this.elDbgVirtualTime) {
      this.elDbgVirtualTime.textContent = this.formatVirtualDateTime();
    }
    if (this.elDbgTimeOffsetTag) {
      const offMs = this.state.virtualTimeOffsetMs || 0;
      if (offMs === 0) {
        this.elDbgTimeOffsetTag.textContent = '实时';
      } else {
        const sign = offMs > 0 ? '+' : '-';
        const absH = Math.round(Math.abs(offMs) / 3600000);
        const days = Math.floor(absH / 24);
        const hours = absH % 24;
        const parts = [];
        if (days > 0) parts.push(`${days}天`);
        if (hours > 0 || parts.length === 0) parts.push(`${hours}小时`);
        this.elDbgTimeOffsetTag.textContent = `偏移 ${sign}${parts.join('')}`;
      }
    }

    if (this.elDbgStatusCollect) {
      const theme = EVENT_THEMES[this.state.eventThemeIndex % EVENT_THEMES.length];
      if (this.state.eventActive) {
        this.elDbgStatusCollect.textContent = `已开启 · ${theme.matName} (${this.state.eventProgress}/5)`;
        this.elDbgStatusCollect.classList.add('on');
      } else {
        this.elDbgStatusCollect.textContent = `未开启 (${this.state.eventProgress}/5)`;
        this.elDbgStatusCollect.classList.remove('on');
      }
    }

    if (this.elDbgStatusTournament) {
      if (!this.state.tournamentActive) {
        this.elDbgStatusTournament.textContent = '未开启';
        this.elDbgStatusTournament.classList.remove('on');
      } else {
        const list = this.getSortedTournamentList(this.state.tournamentScore);
        const rank = list.findIndex((u) => u.isPlayer) + 1;
        const remSec = Math.max(0, Math.floor((this.state.tournamentEndTime - this.getNowMs()) / 1000));
        if (remSec > 0) {
          this.elDbgStatusTournament.textContent = `进行中 · #${rank} (${this.state.tournamentScore}分 · ${this.formatTournamentRemaining(remSec)})`;
        } else {
          this.elDbgStatusTournament.textContent = `待结算 · #${rank} (${this.state.tournamentScore}分)`;
        }
        this.elDbgStatusTournament.classList.add('on');
      }
    }

    if (this.elDbgStatusDaily) {
      const completedToday = this.dailyWinDays.has(this.getDailyDayIndex());
      this.elDbgStatusDaily.textContent = completedToday
        ? `${this.getTodayDateTitle()} · 已完成`
        : `${this.getTodayDateTitle()} · 未完成`;
      this.elDbgStatusDaily.classList.toggle('on', completedToday);
    }

    if (this.elDbgStatusWheel) {
      const rem = Math.max(0, WHEEL_DAILY_MAX_SPINS - (this.state.wheelSpinsUsed || 0));
      const lv = this.state.wheelUpgraded ? 'LV.2(×2)' : 'LV.1(×1)';
      this.elDbgStatusWheel.textContent = `${lv} · 剩余 ${rem}/${WHEEL_DAILY_MAX_SPINS}`;
      this.elDbgStatusWheel.classList.toggle('on', rem > 0);
    }

    if (this.elDbgStatusRapids) {
      const stageIdx = Math.min(this.state.rapidsClaimedStage || 0, RAPIDS_STAGES.length - 1);
      const nextTarget = RAPIDS_STAGES[stageIdx].target;
      const doneAll = (this.state.rapidsClaimedStage || 0) >= RAPIDS_STAGES.length;
      if (this.state.rapidsActive) {
        this.elDbgStatusRapids.textContent = doneAll
          ? `已开启 · 今日通关(${this.state.rapidsClearedCount}/100)`
          : `已开启 · ${this.state.rapidsClearedCount}/${nextTarget}关 (阶段${stageIdx + 1}/5)`;
        this.elDbgStatusRapids.classList.add('on');
      } else {
        this.elDbgStatusRapids.textContent = `未开启 (${this.state.rapidsClearedCount}/${nextTarget}关)`;
        this.elDbgStatusRapids.classList.remove('on');
      }
    }

    if (this.elDbgCoinVal) {
      this.elDbgCoinVal.textContent = this.state.coins.toLocaleString();
    }
  }

  updateLobbyUI() {
    const levelId = this.state.levelIndex + 1;
    this.elStartLevelLabel.textContent = `LEVEL ${String(levelId).padStart(2, '0')}`;
    this.mountain.update();
    this.elCoins.textContent = this.state.coins.toLocaleString();
    this.elWheelCoins.textContent = this.elCoins.textContent;
    if (this.btnDailyCheckin && this.elDailyEntryCount && this.elDailyEntryStatus) {
      const today = this.getDailyDayIndex();
      const completedToday = this.dailyWinDays.has(today);
      const streak = this.getDailyStreak(today);
      this.elDailyEntryCount.textContent = `x${streak}`;
      this.elDailyEntryStatus.hidden = !completedToday;
      this.btnDailyCheckin.setAttribute('aria-label',
        `每日挑战 · 连胜 ${streak} 天${completedToday ? ' · 已完成' : ''}`);
    }
    if (this.elLobbyEventProg) {
      this.elLobbyEventProg.textContent = `${this.state.eventProgress}/5`;
    }
    this.updateLobbyAvatar();
  }

  updateLobbyAvatar() {
    const preset = AVATAR_PRESETS[(this.state.avatarIndex || 0) % AVATAR_PRESETS.length];
    if (this.elLobbyAvatar && preset) {
      this.elLobbyAvatar.classList.add('has-custom');
      this.elLobbyAvatar.style.background = preset.bg;
      this.elLobbyAvatar.innerHTML = preset.svg;
    }
    if (this.elProfileAvatarPreview && preset) {
      this.elProfileAvatarPreview.style.background = preset.bg;
      this.elProfileAvatarPreview.innerHTML = preset.svg;
    }
  }

  toggleProfileModal(open) {
    if (!this.modalProfile) return;
    if (open) {
      this.renderProfileModal();
    }
    this.modalProfile.classList.toggle('active', open);
  }

  renderProfileModal() {
    this.ensureCurrentWeekStats();
    this.updateLobbyAvatar();

    if (this.elProfileIdInput) {
      this.elProfileIdInput.value = this.state.playerName || 'Player_01';
    }

    if (this.elProfileAvatarGrid) {
      this.elProfileAvatarGrid.innerHTML = '';
      const curIdx = (this.state.avatarIndex || 0) % AVATAR_PRESETS.length;
      AVATAR_PRESETS.forEach((preset, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'profile-avatar-opt' + (idx === curIdx ? ' on' : '');
        btn.style.background = preset.bg;
        btn.title = preset.label;
        btn.innerHTML = preset.svg;
        btn.addEventListener('click', () => {
          this.sound.playClick();
          this.state.avatarIndex = idx;
          this.updateLobbyAvatar();
          this.renderProfileModal();
          this.saveProgress();
        });
        this.elProfileAvatarGrid.appendChild(btn);
      });
    }

    if (this.elProfileStatLevels) {
      this.elProfileStatLevels.textContent = String(this.weeklyStats.levelsCleared || 0);
    }
    if (this.elProfileStatNew) {
      this.elProfileStatNew.textContent = String(this.weeklyStats.newWordsCount || 0);
    }
    if (this.elProfileStatReview) {
      this.elProfileStatReview.textContent = String(this.weeklyStats.reviewedWordsCount || 0);
    }

    if (this.elProfileBarChart) {
      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const counts = this.weeklyStats.dailyWords || [0, 0, 0, 0, 0, 0, 0];
      const maxCount = Math.max(10, ...counts);
      const todayIdx = this.getCurrentWeekDayIndex();

      this.elProfileBarChart.innerHTML = '';
      dayLabels.forEach((label, idx) => {
        const val = counts[idx] || 0;
        const heightPct = val > 0 ? Math.max(8, Math.round((val / maxCount) * 100)) : 4;
        const col = document.createElement('div');
        col.className = 'chart-col' + (idx === todayIdx ? ' is-today' : '');
        col.innerHTML = `
          <span class="chart-val">${val}</span>
          <div class="chart-bar-wrap">
            <div class="chart-bar-fill" style="height: ${heightPct}%"></div>
          </div>
          <span class="chart-day">${label}</span>
        `;
        this.elProfileBarChart.appendChild(col);
      });
    }
  }

  toggleEventModal(open) {
    if (!this.modalEvent) return;
    if (open) {
      this.renderEventModal();
    }
    this.modalEvent.classList.toggle('active', open);
  }

  renderEventModal() {
    const theme = EVENT_THEMES[this.state.eventThemeIndex % EVENT_THEMES.length];
    if (this.elEventBanner) {
      this.elEventBanner.style.background = theme.bg;
    }
    if (this.elEventThemeTitle) {
      this.elEventThemeTitle.textContent = theme.title;
    }
    if (this.elEventItemPreview) {
      this.elEventItemPreview.textContent = `□ ${theme.itemName}`;
    }
    if (this.elEventProgressText) {
      this.elEventProgressText.textContent = `${this.state.eventProgress} / 5`;
    }
    if (this.elEventProgressFill) {
      this.elEventProgressFill.style.width = `${(this.state.eventProgress / 5) * 100}%`;
    }
    if (this.elLobbyEventProg) {
      this.elLobbyEventProg.textContent = `${this.state.eventProgress}/5`;
    }
    const btnEventJoin = document.getElementById('btn-event-join');
    if (btnEventJoin) {
      btnEventJoin.textContent = this.state.currentScreen === 'game' ? 'OK' : 'JOIN';
    }
  }

  syncActiveEventThemeInGame() {
    if (this.state.currentScreen !== 'game' || this.state.isDaily || this.state.isCustom || !this.state.eventActive) return;
    const theme = EVENT_THEMES[this.state.eventThemeIndex % EVENT_THEMES.length];
    materialSet = MATERIALS.find((m) => m.name === theme.matName) || MATERIALS[0];
    this.tiles.forEach((t) => t.applyStyle());
    this.collectibles.forEach((item) => {
      item.name = theme.itemName;
      const box = item.el ? item.el.querySelector('.collectible-item-box') : null;
      if (box) box.textContent = `□ ${theme.itemName}`;
    });
  }

  showEventToast(msg) {
    if (!this.elEventHudToast) return;
    this.elEventHudToast.textContent = msg;
    this.elEventHudToast.classList.add('visible');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.elEventHudToast.classList.remove('visible');
    }, 1800);
  }

  // ============ 锦标赛逻辑 ============
  formatTournamentRemaining(totalSec) {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  getTournamentRewardByRank(rank) {
    if (rank === 1) return 200;
    if (rank === 2) return 100;
    if (rank === 3) return 50;
    return 0;
  }

  getSortedTournamentList(playerScore = this.state.tournamentScore) {
    const bots = (this.state.tournamentBots || this.createDefaultTournamentBots()).map((b, idx) => ({
      id: b.id,
      name: b.name,
      score: b.score,
      isPlayer: false,
      order: typeof b.order === 'number' ? b.order : idx,
    }));
    const playerEntry = {
      id: 'player',
      name: `${this.state.playerName || 'Player_01'} (YOU)`,
      score: playerScore,
      isPlayer: true,
      order: -1,
    };
    const all = [...bots, playerEntry];
    all.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.isPlayer !== b.isPlayer) return a.isPlayer ? -1 : 1;
      return a.order - b.order;
    });
    return all;
  }

  toggleTournamentModal(open) {
    if (!this.modalTournament) return;
    if (open) {
      if (this.elTournamentSettleNotice && this.state.tournamentActive) {
        this.elTournamentSettleNotice.classList.remove('visible');
      }
      this.renderTournamentModal();
    }
    this.modalTournament.classList.toggle('active', open);
  }

  renderTournamentModal() {
    if (!this.elTournamentLeaderboard) return;

    if (this.elTournamentTimerText) {
      if (!this.state.tournamentActive) {
        this.elTournamentTimerText.textContent = '24:00:00';
      } else {
        const remSec = Math.max(0, Math.floor((this.state.tournamentEndTime - this.getNowMs()) / 1000));
        this.elTournamentTimerText.textContent = this.formatTournamentRemaining(remSec);
      }
    }

    const list = this.getSortedTournamentList(this.state.tournamentScore);
    this.elTournamentLeaderboard.innerHTML = '';

    list.forEach((entry, idx) => {
      const rank = idx + 1;
      const reward = this.getTournamentRewardByRank(rank);
      const row = document.createElement('div');
      row.className = 't-row' + (entry.isPlayer ? ' is-player' : '');

      const rankClass = rank <= 3 ? ` rank-${rank}` : '';
      const rewardHtml =
        reward > 0
          ? `<span class="t-reward-tag"><span class="icon-coin"></span><span>${reward}</span></span>`
          : '';

      row.innerHTML = `
        <div class="t-row-left">
          <span class="t-rank-badge${rankClass}">${rank}</span>
          <span class="t-name">${entry.name}</span>
        </div>
        <div class="t-row-right">
          ${rewardHtml}
          <span class="t-score">${entry.score} 分</span>
        </div>
      `;
      this.elTournamentLeaderboard.appendChild(row);
    });

    if (this.btnTournamentJoin) {
      if (this.state.tournamentActive && this.getNowMs() >= this.state.tournamentEndTime) {
        this.btnTournamentJoin.textContent = '领取结算奖励';
      } else {
        this.btnTournamentJoin.textContent = 'JOIN';
      }
    }

    if (this.btnTournamentSettle) {
      this.btnTournamentSettle.classList.toggle('visible', !!this.state.tournamentActive);
    }
  }

  settleTournament() {
    if (!this.state.tournamentActive) return;
    const list = this.getSortedTournamentList(this.state.tournamentScore);
    const playerIdx = list.findIndex((u) => u.isPlayer);
    const finalRank = playerIdx >= 0 ? playerIdx + 1 : 11;
    const reward = this.getTournamentRewardByRank(finalRank);

    if (reward > 0) {
      this.state.coins += reward;
      this.sound.playVictory();
    } else {
      this.sound.playClick();
    }

    if (this.elTournamentSettleNotice) {
      this.elTournamentSettleNotice.textContent =
        reward > 0
          ? `本轮结算：第 ${finalRank} 名，获得奖励 +${reward} 金币！`
          : `本轮结算：第 ${finalRank} 名（前 3 名可获得金币奖励）`;
      this.elTournamentSettleNotice.classList.add('visible');
    }

    // 重置锦标赛状态，等待下一轮 JOIN
    this.state.tournamentActive = false;
    this.state.tournamentScore = 0;
    this.state.tournamentEndTime = 0;
    this.state.tournamentBots = this.createDefaultTournamentBots();
    this.levelTournamentPoints = 0;

    this.updateLobbyUI();
    this.renderTournamentModal();
    this.saveProgress();
  }

  playTournamentRankAnimation(oldScore, newScore, targetPts, clearBonusPts, onDone) {
    if (!this.modalTournamentRankup || !this.elRankupList || !this.elRankupStage) {
      onDone();
      return;
    }

    const oldList = this.getSortedTournamentList(oldScore);
    const newList = this.getSortedTournamentList(newScore);
    const oldPlayerIdx = oldList.findIndex((u) => u.isPlayer);
    const newPlayerIdx = newList.findIndex((u) => u.isPlayer);

    const STEP_H = 48; // 42px 行高 + 6px 间距
    const STAGE_INNER_H = 232;
    const totalListH = oldList.length * STEP_H - 6;
    const maxScroll = Math.max(0, totalListH - STAGE_INNER_H);

    const getScrollForIdx = (idx) => {
      const center = idx * STEP_H + 21 - STAGE_INNER_H / 2;
      return Math.max(0, Math.min(maxScroll, center));
    };

    const gained = newScore - oldScore;
    if (this.elRankupGainPill) {
      this.elRankupGainPill.textContent = `目标 +${targetPts} · 通关 +${clearBonusPts}（+${gained} 分）`;
    }

    this.elRankupList.innerHTML = '';
    this.elRankupList.style.height = `${totalListH}px`;
    this.elRankupList.style.transition = 'none';
    this.elRankupList.style.transform = `translateY(${-getScrollForIdx(oldPlayerIdx)}px)`;

    const rowMap = new Map();
    oldList.forEach((entry, idx) => {
      const rank = idx + 1;
      const row = document.createElement('div');
      row.className = 'rankup-row' + (entry.isPlayer ? ' is-player' : '');
      row.style.transition = 'none';
      row.style.transform = `translateY(${idx * STEP_H}px)`;

      const rankClass = rank <= 3 ? ` rank-${rank}` : '';
      const deltaBadgeHtml = entry.isPlayer
        ? `<span class="rankup-delta-badge" id="rankup-delta-badge">+${gained}</span>`
        : '';

      row.innerHTML = `
        <div class="t-row-left">
          <span class="t-rank-badge${rankClass}">${rank}</span>
          <span class="t-name">${entry.name}</span>
        </div>
        <div class="t-row-right">
          ${deltaBadgeHtml}
          <span class="t-score">${entry.score} 分</span>
        </div>
      `;
      this.elRankupList.appendChild(row);
      rowMap.set(entry.id, row);
    });

    this.modalTournamentRankup.classList.add('active');

    const playerRow = rowMap.get('player');
    const playerScoreEl = playerRow ? playerRow.querySelector('.t-score') : null;
    const deltaBadge = playerRow ? playerRow.querySelector('.rankup-delta-badge') : null;

    // 阶段 1：积分跳动增长
    setTimeout(() => {
      if (deltaBadge) deltaBadge.classList.add('show');
      if (playerRow) {
        playerRow.style.transition = 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease';
        playerRow.classList.add('boosting');
        playerRow.style.transform = `translateY(${oldPlayerIdx * STEP_H}px) scale(1.03)`;
      }
      const startAt = performance.now();
      const dur = 460;
      let lastTickVal = oldScore;
      const tickScore = (now) => {
        const p = Math.min(1, (now - startAt) / dur);
        const cur = Math.round(oldScore + (newScore - oldScore) * p);
        if (playerScoreEl) playerScoreEl.textContent = `${cur} 分`;
        if (cur !== lastTickVal) {
          lastTickVal = cur;
          this.sound.playSelect(cur - oldScore);
        }
        if (p < 1) {
          requestAnimationFrame(tickScore);
        }
      };
      requestAnimationFrame(tickScore);
    }, 220);

    // 阶段 2：排名上下移动
    setTimeout(() => {
      this.elRankupList.style.transition = 'transform 0.68s cubic-bezier(0.22, 1, 0.36, 1)';
      this.elRankupList.style.transform = `translateY(${-getScrollForIdx(newPlayerIdx)}px)`;

      if (newPlayerIdx < oldPlayerIdx) {
        this.sound.playValidWord();
      }

      newList.forEach((entry, newIdx) => {
        const row = rowMap.get(entry.id);
        if (!row) return;
        const newRank = newIdx + 1;
        row.style.transition = 'transform 0.68s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease';
        row.style.transform = entry.isPlayer
          ? `translateY(${newIdx * STEP_H}px) scale(1.03)`
          : `translateY(${newIdx * STEP_H}px)`;

        const badge = row.querySelector('.t-rank-badge');
        if (badge) {
          badge.textContent = String(newRank);
          badge.className = 't-rank-badge' + (newRank <= 3 ? ` rank-${newRank}` : '');
        }
      });
    }, 800);

    // 阶段 3：落位收起缩放
    setTimeout(() => {
      if (playerRow) {
        playerRow.classList.remove('boosting');
        playerRow.style.transform = `translateY(${newPlayerIdx * STEP_H}px) scale(1)`;
      }
    }, 1520);

    // 阶段 4：自动关闭弹窗并进入结算界面
    setTimeout(() => {
      this.modalTournamentRankup.classList.remove('active');
      setTimeout(() => {
        onDone();
      }, 220);
    }, 2250);
  }

  // ============ 幸运转盘逻辑 ============
  getWheelCurrentRewards(upgraded = this.state.wheelUpgraded) {
    const mult = upgraded ? 2 : 1;
    return WHEEL_BASE_REWARDS.map((v) => v * mult);
  }

  toggleWheelModal(open) {
    if (!this.modalWheel) return;
    if (open) {
      if (this.elWheelUpgradeBanner) {
        this.elWheelUpgradeBanner.classList.remove('visible');
      }
      if (this.elWheelRewardToast) {
        this.elWheelRewardToast.classList.remove('highlight');
        this.elWheelRewardToast.textContent = '';
      }
      this.renderWheelModal();
    }
    this.modalWheel.classList.toggle('active', open);
  }

  renderWheelModal() {
    if (!this.elWheelSectors) return;

    const upgraded = !!this.state.wheelUpgraded;
    const rewards = this.getWheelCurrentRewards(upgraded);

    this.modalWheel.classList.toggle('upgraded', upgraded);

    this.elWheelSectors.innerHTML = '';
    rewards.forEach((val, idx) => {
      const item = document.createElement('div');
      item.className = 'wheel-sector-item';
      item.style.setProperty('--sector-angle', `${idx * 60}deg`);
      item.innerHTML = `
        <img src="assets/wheel/prize-${WHEEL_PRIZE_ART[idx]}.png" alt="" />
        <span class="wheel-sector-val" data-sector-idx="${idx}">${val}</span>
      `;
      this.elWheelSectors.appendChild(item);
    });

    this.updateWheelControlsUI();
  }

  updateWheelControlsUI() {
    const used = this.state.wheelSpinsUsed || 0;
    const remaining = Math.max(0, WHEEL_DAILY_MAX_SPINS - used);
    if (this.elWheelQuotaText) {
      this.elWheelQuotaText.textContent = `今日剩余：${remaining} / ${WHEEL_DAILY_MAX_SPINS} 次`;
    }
    if (!this.btnWheelSpin) return;
    this.btnWheelSpin.dataset.free = String(used === 0);

    if (this.wheelSpinning) {
      this.btnWheelSpin.disabled = true;
      return;
    }

    if (remaining <= 0) {
      this.btnWheelSpin.disabled = true;
      this.btnWheelSpin.textContent = '今日次数已用完';
    } else if (used === 0) {
      this.btnWheelSpin.disabled = false;
      this.btnWheelSpin.textContent = 'Spin';
    } else {
      const videoRem = WHEEL_DAILY_MAX_SPINS - used;
      this.btnWheelSpin.disabled = false;
      this.btnWheelSpin.textContent = `看视频转动 (${videoRem}/5)`;
    }
  }

  spinWheel() {
    if (this.wheelSpinning) return;
    const used = this.state.wheelSpinsUsed || 0;
    if (used >= WHEEL_DAILY_MAX_SPINS) return;

    this.wheelSpinning = true;
    this.sound.playClick();
    this.updateWheelControlsUI();

    const isFirstEverSpin = !this.state.wheelUpgraded;
    const rewards = this.getWheelCurrentRewards(this.state.wheelUpgraded);
    const winIdx = Math.floor(Math.random() * rewards.length);
    const prize = rewards[winIdx];

    if (this.elWheelUpgradeBanner) {
      this.elWheelUpgradeBanner.classList.remove('visible');
    }
    if (this.elWheelRewardToast) {
      this.elWheelRewardToast.classList.remove('highlight');
      this.elWheelRewardToast.textContent = used === 0 ? '免费抽奖转动中...' : '视频奖励转动中...';
    }

    // 计算目标旋转角度，使第 winIdx 个扇区（winIdx * 60°）停在正上方指针（0°）处
    const targetMod = (360 - winIdx * 60) % 360;
    const currentMod = ((this.wheelRotation % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 360;
    const jitter = (Math.random() - 0.5) * 18;
    this.wheelRotation += 360 * 5 + delta + jitter;

    if (this.elWheelDisc) {
      this.elWheelDisc.style.transform = `rotate(${this.wheelRotation.toFixed(1)}deg)`;
    }

    // 转动期间播放轻快音效节拍
    for (let i = 1; i <= 8; i++) {
      setTimeout(() => {
        if (this.wheelSpinning) this.sound.playSelect(i);
      }, i * 320);
    }

    setTimeout(() => {
      this.state.wheelSpinsUsed = used + 1;
      this.state.coins += prize;
      this.sound.playVictory();
      this.updateLobbyUI();
      if (this.elGameCoins) {
        this.elGameCoins.textContent = this.state.coins.toLocaleString();
      }
      if (this.elWheelRewardToast) {
        this.elWheelRewardToast.classList.add('highlight');
        this.elWheelRewardToast.textContent = `恭喜获得 +${prize} 金币！`;
      }
      this.saveProgress();

      // 首次转转盘后触发转盘升级动画（仅能升级 1 次，奖励翻倍）
      if (isFirstEverSpin) {
        setTimeout(() => {
          this.playWheelUpgradeAnimation(() => {
            this.wheelSpinning = false;
            this.updateWheelControlsUI();
          });
        }, 520);
      } else {
        this.wheelSpinning = false;
        this.updateWheelControlsUI();
      }
    }, 3150);
  }

  playWheelUpgradeAnimation(onComplete) {
    this.state.wheelUpgraded = true;
    this.modalWheel.classList.add('upgraded');
    this.saveProgress();

    if (this.elWheelUpgradeBanner) {
      this.elWheelUpgradeBanner.classList.add('visible');
    }
    if (this.elWheelDisc) {
      this.elWheelDisc.classList.add('upgrading');
    }
    if (this.elWheelRewardToast) {
      this.elWheelRewardToast.textContent = '转盘已升级！所有扇区金币奖励永久 ×2';
    }

    const doubledRewards = this.getWheelCurrentRewards(true);
    const valEls = this.elWheelSectors
      ? [...this.elWheelSectors.querySelectorAll('.wheel-sector-val')]
      : [];

    valEls.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add('pop-up');
        el.textContent = String(doubledRewards[idx]);
        this.sound.playSelect(idx);
        setTimeout(() => {
          el.classList.remove('pop-up');
        }, 280);
      }, idx * 110);
    });

    setTimeout(() => {
      this.sound.playValidWord();
    }, 680);

    setTimeout(() => {
      if (this.elWheelDisc) {
        this.elWheelDisc.classList.remove('upgrading');
      }
      if (this.elWheelUpgradeBanner) {
        this.elWheelUpgradeBanner.classList.remove('visible');
      }
      if (onComplete) onComplete();
    }, 1550);
  }

  // ============ 激流勇进活动逻辑 ============
  toggleRapidsModal(open) {
    if (!this.modalRapids) return;
    if (open) {
      this.renderRapidsModal(this.state.rapidsClaimedStage);
    } else if (this.elRapidsRiverStage) {
      this.elRapidsRiverStage.classList.remove('rushing');
    }
    this.modalRapids.classList.toggle('active', open);
  }

  renderRapidsModal(displayClaimedStage = this.state.rapidsClaimedStage, isRushing = false) {
    if (!this.elRapidsNodesTrack) return;

    const claimed = Math.max(0, Math.min(RAPIDS_STAGES.length, displayClaimedStage || 0));
    const curStageIdx = Math.min(claimed, RAPIDS_STAGES.length - 1);
    const curStage = RAPIDS_STAGES[curStageIdx];
    const allDone = claimed >= RAPIDS_STAGES.length;

    if (this.elRapidsStageTag) {
      this.elRapidsStageTag.textContent = allDone
        ? 'RAPIDS RUSH · 今日全阶段已完成'
        : `RAPIDS RUSH · 阶段 ${curStageIdx + 1} / ${RAPIDS_STAGES.length}`;
    }
    if (this.elRapidsProgressText) {
      this.elRapidsProgressText.textContent = allDone
        ? `今日累计通关：${this.state.rapidsClearedCount} / 100 关（全部达成）`
        : `今日累计通关：${this.state.rapidsClearedCount} / ${curStage.target} 关`;
    }

    // 节点间距：小船在下方 y≈180~250，当前目标节点位于小船正前方 y=96，后续节点依次在上方
    const NODE_STEP = 68;
    const BASE_TARGET_Y = 96;
    this.elRapidsNodesTrack.innerHTML = '';

    RAPIDS_STAGES.forEach((st, idx) => {
      const node = document.createElement('div');
      const isDone = idx < claimed;
      const isCurrent = idx === claimed;
      node.className =
        'rapids-node' + (isDone ? ' done' : '') + (isCurrent ? ' current' : '');
      node.style.top = `${-idx * NODE_STEP}px`;

      const statusText = `${st.target} 关`;
      node.innerHTML = `
        <span class="rapids-node-target">${statusText}</span>
        <span class="rapids-node-reward">
          <span class="icon-coin"></span>
          <span>${st.reward}</span>
        </span>
      `;
      this.elRapidsNodesTrack.appendChild(node);
    });

    const anchorIdx = Math.min(claimed, RAPIDS_STAGES.length);
    const trackY = BASE_TARGET_Y + anchorIdx * NODE_STEP;
    if (!isRushing) {
      this.elRapidsNodesTrack.style.transition = 'none';
      this.elRapidsNodesTrack.style.transform = `translateY(${trackY}px)`;
    }

    if (this.elRapidsRewardToast && !this.rapidsAnimating) {
      this.elRapidsRewardToast.classList.remove('highlight');
      this.elRapidsRewardToast.textContent = allDone
        ? '今日 5 个阶段奖励已全部领取！'
        : `下一阶段目标：累计通关 ${curStage.target} 关，奖励 +${curStage.reward} 金币`;
    }

    if (this.btnRapidsAction) {
      this.btnRapidsAction.disabled = !!this.rapidsAnimating;
      this.btnRapidsAction.textContent = this.rapidsInResultMode ? '确认' : 'JOIN';
    }
  }

  checkAndTriggerRapidsAtResult() {
    if (!this.state.rapidsActive) return;
    const claimed = this.state.rapidsClaimedStage || 0;
    if (claimed >= RAPIDS_STAGES.length) return;

    const targetStage = RAPIDS_STAGES[claimed];
    if (this.state.rapidsClearedCount < targetStage.target) return;

    // 达到完成节点：在结算界面上弹出活动弹窗，播放划船向前动画（船不动，河流与节点向下快速移动）
    this.rapidsInResultMode = true;
    this.rapidsAnimating = true;

    const prevClaimed = claimed;
    this.renderRapidsModal(prevClaimed, false);
    this.modalRapids.classList.add('active');

    if (this.elRapidsRewardToast) {
      this.elRapidsRewardToast.classList.remove('highlight');
      this.elRapidsRewardToast.textContent = `达成 ${targetStage.target} 关节点！小船加速前进中...`;
    }

    const NODE_STEP = 68;
    const BASE_TARGET_Y = 96;
    const nextClaimed = prevClaimed + 1;
    const nextTrackY = BASE_TARGET_Y + nextClaimed * NODE_STEP;

    setTimeout(() => {
      if (this.elRapidsRiverStage) {
        this.elRapidsRiverStage.classList.add('rushing');
      }
      if (this.elRapidsNodesTrack) {
        this.elRapidsNodesTrack.style.transition =
          'transform 1.25s cubic-bezier(0.22, 1, 0.36, 1)';
        this.elRapidsNodesTrack.style.transform = `translateY(${nextTrackY}px)`;
      }
      for (let i = 0; i < 4; i++) {
        setTimeout(() => this.sound.playSelect(i), i * 260);
      }
    }, 180);

    setTimeout(() => {
      if (this.elRapidsRiverStage) {
        this.elRapidsRiverStage.classList.remove('rushing');
      }
      this.state.rapidsClaimedStage = nextClaimed;
      this.state.coins += targetStage.reward;
      this.rapidsAnimating = false;

      this.sound.playVictory();
      this.updateLobbyUI();
      if (this.elGameCoins) {
        this.elGameCoins.textContent = this.state.coins.toLocaleString();
      }
      this.renderRapidsModal(nextClaimed, false);

      if (this.elRapidsRewardToast) {
        this.elRapidsRewardToast.classList.add('highlight');
        this.elRapidsRewardToast.textContent = `恭喜完成 ${targetStage.target} 关阶段节点 · 获得 +${targetStage.reward} 金币！`;
      }
      if (this.btnRapidsAction) {
        this.btnRapidsAction.disabled = false;
        this.btnRapidsAction.textContent = '确认';
      }
      this.updateDebugPanel();
      this.saveProgress();
    }, 1500);
  }

  // 关卡编辑器试玩：不影响主线进度/金币/活动
  startCustomLevel(level) {
    if (typeof BONUS_WORDS !== 'undefined' && level.bonus) level.bonus.forEach((w) => BONUS_WORDS.add(w));
    this._pendingCustom = level;
    this.startGame(false);
  }

  mainLevelDifficulty() {
    // Demo 难度标记对应现有 10 张主线棋盘，轮播时沿用。
    const difficulties = [0, 2, 2, 0, 2, 0, 3, 3, 4, 4];
    return difficulties[this.state.levelIndex % LEVELS.length] || 0;
  }

  startGame(isDaily = false) {
    this.gameRun = {};
    this.customLevel = this._pendingCustom || null;
    this._pendingCustom = null;
    this.state.isCustom = !!this.customLevel;
    if (this.state.isCustom) isDaily = false;
    this.state.isDaily = isDaily;
    this.state.score = 0;
    this.state.paused = false;
    this.solvedWords.clear();
    this.bonusWords.clear();
    this.selectedChain = [];
    this.undoStack = [];
    this.isDragging = false;
    this.feedbackLock = false;
    fxBreaks.clear();
    fxBursts.length = 0;

    // 活动开启且在主玩法中时，棋盘切换为活动主题对应材质
    if (this.state.eventActive && !isDaily && !this.state.isCustom) {
      const theme = EVENT_THEMES[this.state.eventThemeIndex % EVENT_THEMES.length];
      materialSet = MATERIALS.find((m) => m.name === theme.matName) || MATERIALS[0];
    } else {
      materialSet = null;
    }

    this.currentLevel = this.customLevel || (isDaily
      ? DAILY_LEVEL
      : LEVELS[this.state.levelIndex % LEVELS.length]);

    const savedSession = this.state.isCustom ? null : isDaily
      ? (this.dailySession && this.dailySession.date === this.getTodayDateTitle() ? this.dailySession : null)
      : (this.mainSession && this.mainSession.levelIndex === this.state.levelIndex ? this.mainSession : null);

    if (savedSession) {
      this.state.score = savedSession.score || 0;
      this.levelTournamentPoints =
        typeof savedSession.levelTournamentPoints === 'number'
          ? savedSession.levelTournamentPoints
          : 0;
      (savedSession.solvedWords || []).forEach((w) => this.solvedWords.add(w));
      (savedSession.bonusWords || []).forEach((w) => this.bonusWords.add(w));
    } else {
      this.levelTournamentPoints = 0;
    }

    this.renderTargetZone(savedSession);
    this.renderBoardGrid(savedSession);
    this.renderCollectibles(savedSession);
    this.clearLines();
    this.updateCurrentWordBar('');
    this.updateGameHUD();
    this.updateBonusUI();
    this.switchScreen('game');
    this.mountain.update();
    this.saveProgress();
  }

  toggleBonusModal(open) {
    if (!this.modalBonus) return;
    if (open) {
      this.renderBonusModal();
    }
    this.modalBonus.classList.toggle('active', open);
  }

  updateBonusUI(justReachedFive = false) {
    if (this.elBonusCount) {
      this.elBonusCount.textContent = String(this.bonusWords.size);
    }
    if (this.elBonusRingBar) {
      const C = 150.8;
      if (justReachedFive) {
        this.elBonusRingBar.classList.add('full');
        this.elBonusRingBar.style.strokeDashoffset = '0';
        this.launchDandelion();
        setTimeout(() => {
          if (!this.elBonusRingBar) return;
          this.elBonusRingBar.classList.remove('full');
          const curStep = this.bonusProgress % 5;
          this.elBonusRingBar.style.strokeDashoffset = (C * (1 - curStep / 5)).toFixed(2);
        }, 420);
      } else {
        const step = this.bonusProgress % 5;
        this.elBonusRingBar.classList.remove('full');
        this.elBonusRingBar.style.strokeDashoffset = (C * (1 - step / 5)).toFixed(2);
      }
    }
  }

  launchDandelion() {
    if (!this.phoneFrame || !this.btnBonusWords || !this.elTargetWords) return;

    const hiddenSlots = [
      ...this.elTargetWords.querySelectorAll(
        '.target-word:not(.solved) .target-slot:not(.filled):not(.hinted):not(.dandelion-pending)'
      ),
    ];
    if (hiddenSlots.length === 0) return;

    const targetSlot = hiddenSlots[Math.floor(Math.random() * hiddenSlots.length)];
    targetSlot.classList.add('dandelion-pending');

    const frameRect = this.phoneFrame.getBoundingClientRect();
    const fromRect = this.btnBonusWords.getBoundingClientRect();
    const toRect = targetSlot.getBoundingClientRect();

    const startX = fromRect.left - frameRect.left + fromRect.width / 2;
    const startY = fromRect.top - frameRect.top + fromRect.height / 2;
    const endX = toRect.left - frameRect.left + toRect.width / 2;
    const endY = toRect.top - frameRect.top + toRect.height / 2;

    // 控制点向屏幕内侧微拱，形成轻盈飘飞弧线
    const ctrlX = (startX + endX) * 0.5 + (endX > startX ? -48 : 48);
    const ctrlY = Math.min(startY, endY) - 42;

    const dandelion = document.createElement('div');
    dandelion.className = 'flying-dandelion';
    dandelion.style.left = `${startX}px`;
    dandelion.style.top = `${startY}px`;
    dandelion.innerHTML = `
      <svg viewBox="0 0 48 48" width="42" height="42">
        <g stroke="#fffbe6" stroke-width="1.5" stroke-linecap="round" fill="none">
          <path d="M24 22 C23 30, 21 36, 18 42" stroke="#ffe599" stroke-width="1.8"/>
          <ellipse cx="17.5" cy="42.5" rx="2" ry="3.2" transform="rotate(20 17.5 42.5)" fill="#e6b450" stroke="none"/>
          <line x1="24" y1="22" x2="24" y2="6"/>
          <line x1="24" y1="22" x2="16" y2="8"/>
          <line x1="24" y1="22" x2="32" y2="8"/>
          <line x1="24" y1="22" x2="10" y2="13"/>
          <line x1="24" y1="22" x2="38" y2="13"/>
          <line x1="24" y1="22" x2="8" y2="20"/>
          <line x1="24" y1="22" x2="40" y2="20"/>
          <line x1="24" y1="22" x2="13" y2="26"/>
          <line x1="24" y1="22" x2="35" y2="26"/>
        </g>
        <g fill="#ffffff">
          <circle cx="24" cy="22" r="2.6" fill="#fff2b2"/>
          <circle cx="24" cy="6" r="2"/>
          <circle cx="16" cy="8" r="1.8"/>
          <circle cx="32" cy="8" r="1.8"/>
          <circle cx="10" cy="13" r="1.7"/>
          <circle cx="38" cy="13" r="1.7"/>
          <circle cx="8" cy="20" r="1.5"/>
          <circle cx="40" cy="20" r="1.5"/>
          <circle cx="13" cy="26" r="1.4"/>
          <circle cx="35" cy="26" r="1.4"/>
        </g>
      </svg>
    `;
    this.phoneFrame.appendChild(dandelion);

    const duration = 860;
    const t0 = performance.now();
    let lastSporeAt = 0;

    const tick = (now) => {
      const rawU = Math.min(1, (now - t0) / duration);
      // 柔和缓入缓出
      const u = rawU < 0.5 ? 2 * rawU * rawU : 1 - Math.pow(-2 * rawU + 2, 2) / 2;
      const inv = 1 - u;

      const x = inv * inv * startX + 2 * inv * u * ctrlX + u * u * endX;
      const y = inv * inv * startY + 2 * inv * u * ctrlY + u * u * endY;
      const sway = Math.sin(rawU * Math.PI * 3) * 14;
      const scale = 0.85 + Math.sin(rawU * Math.PI) * 0.3;

      dandelion.style.transform = `translate(${(x - startX).toFixed(1)}px, ${(y - startY).toFixed(1)}px) rotate(${sway.toFixed(1)}deg) scale(${scale.toFixed(2)})`;

      if (now - lastSporeAt > 95 && rawU < 0.88) {
        lastSporeAt = now;
        this.spawnDandelionSpore(x, y, (Math.random() - 0.5) * 26, 10 + Math.random() * 18);
      }

      if (rawU < 1) {
        requestAnimationFrame(tick);
      } else {
        targetSlot.classList.remove('dandelion-pending');
        if (!targetSlot.classList.contains('filled')) {
          targetSlot.textContent = targetSlot.dataset.letter;
          targetSlot.classList.add('hinted');
          this.sound.playSelect(4);
          this.saveProgress();
        }
        for (let i = 0; i < 8; i++) {
          const ang = (Math.PI * 2 * i) / 8;
          const dist = 18 + Math.random() * 14;
          this.spawnDandelionSpore(endX, endY, Math.cos(ang) * dist, Math.sin(ang) * dist);
        }
        dandelion.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
        dandelion.style.opacity = '0';
        setTimeout(() => dandelion.remove(), 240);
      }
    };

    requestAnimationFrame(tick);
  }

  spawnDandelionSpore(x, y, dx, dy) {
    if (!this.phoneFrame) return;
    const sp = document.createElement('div');
    sp.className = 'dandelion-spore';
    sp.style.left = `${x}px`;
    sp.style.top = `${y}px`;
    this.phoneFrame.appendChild(sp);
    requestAnimationFrame(() => {
      sp.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(0.3)`;
      sp.style.opacity = '0';
    });
    setTimeout(() => sp.remove(), 560);
  }

  renderBonusModal() {
    if (!this.elBonusWordsList) return;
    this.elBonusWordsList.innerHTML = '';
    if (this.bonusWords.size === 0) {
      const empty = document.createElement('div');
      empty.className = 'bonus-empty';
      empty.textContent = '暂未收集到额外词';
      this.elBonusWordsList.appendChild(empty);
      return;
    }
    for (const w of this.bonusWords) {
      const chip = document.createElement('div');
      chip.className = 'bonus-word-chip';
      chip.textContent = w;
      this.elBonusWordsList.appendChild(chip);
    }
  }

  togglePause(paused) {
    const inGame = this.state.currentScreen === 'game';
    document.getElementById('btn-resume').textContent = inGame ? '继续' : '关闭';
    document.getElementById('btn-quit-to-lobby').hidden = !inGame;
    this.state.paused = paused;
    this.modalPause.classList.toggle('active', paused);
  }

  updateGameHUD() {
    if (this.state.isCustom) {
      this.elGameLevelId.textContent = '试玩';
    } else if (this.state.isDaily) {
      this.elGameLevelId.textContent = this.getTodayDateTitle();
    } else {
      const levelId = this.state.levelIndex + 1;
      this.elGameLevelId.textContent = `Level ${levelId}`;
    }
    this.elGameCoins.textContent = this.state.coins.toLocaleString();
    this.updateHudEventUI(false);
  }

  updateHudEventUI(justReachedFive = false) {
    if (!this.elHudEventIcon) return;
    this.elHudEventIcon.classList.toggle('active', !this.state.isDaily);

    const C = 138.23;
    if (this.elHudEventCount) {
      this.elHudEventCount.textContent = justReachedFive ? '5' : String(this.state.eventProgress);
    }
    if (this.elHudEventRingBar) {
      if (justReachedFive) {
        this.elHudEventRingBar.classList.add('full');
        this.elHudEventRingBar.style.strokeDashoffset = '0';
        setTimeout(() => {
          if (!this.elHudEventRingBar) return;
          this.elHudEventRingBar.classList.remove('full');
          const step = this.state.eventProgress % 5;
          this.elHudEventRingBar.style.strokeDashoffset = (C * (1 - step / 5)).toFixed(2);
          if (this.elHudEventCount) {
            this.elHudEventCount.textContent = String(this.state.eventProgress);
          }
        }, 420);
      } else {
        const step = this.state.eventProgress % 5;
        this.elHudEventRingBar.classList.remove('full');
        this.elHudEventRingBar.style.strokeDashoffset = (C * (1 - step / 5)).toFixed(2);
      }
    }
  }

  renderTargetZone(savedSession = null) {
    this.elTargetWords.innerHTML = '';
    const count = this.currentLevel.targets.length;

    this.elTargetWords.classList.toggle('many-targets', count > 10);
    let rows = count;
    if (count < 9) {
      this.elTargetWords.classList.remove('two-cols');
      this.elTargetWords.style.gridTemplateRows = '';
    } else {
      rows = Math.ceil(count / 2);
      this.elTargetWords.classList.add('two-cols');
      this.elTargetWords.style.gridTemplateRows = `repeat(${rows}, auto)`;
    }
    this.elTargetWords.dataset.rows = String(rows);

    const hintedSet = new Set(
      (savedSession?.hintedSlots || []).map((h) => `${h.word}:${h.idx}`)
    );

    const sortedTargets = [...this.currentLevel.targets].sort(
      (a, b) => a.length - b.length || a.localeCompare(b)
    );

    sortedTargets.forEach((word) => {
      const wordEl = document.createElement('div');
      const isSolved = this.solvedWords.has(word);
      wordEl.className = 'target-word' + (isSolved ? ' solved' : '');
      wordEl.dataset.word = word;

      [...word].forEach((ch, idx) => {
        const slot = document.createElement('div');
        slot.className = 'target-slot';
        slot.dataset.letter = ch;
        if (isSolved) {
          slot.textContent = ch;
          slot.classList.add('filled');
        } else if (hintedSet.has(`${word}:${idx}`)) {
          slot.textContent = ch;
          slot.classList.add('hinted');
        }
        wordEl.appendChild(slot);
      });

      this.elTargetWords.appendChild(wordEl);
    });
  }

  useHint(count = 1) {
    if (this.state.currentScreen !== 'game' || this.state.paused || this.feedbackLock) return false;
    let revealed = 0;
    while (revealed < count && this.revealHint()) revealed += 1;
    if (revealed) this.saveProgress();
    return revealed > 0;
  }

  revealHint() {

    const wordEls = [...this.elTargetWords.querySelectorAll('.target-word')].filter(
      (el) => !this.solvedWords.has(el.dataset.word) && !el.classList.contains('solved')
    );
    if (wordEls.length === 0) return;

    const maxLen = Math.max(...wordEls.map((el) => el.dataset.word.length));

    // 按第 1 个字母 (idx=0) → 第 2 个字母 (idx=1) → 以此类推 的优先级检索未揭示格子
    for (let idx = 0; idx < maxLen; idx++) {
      const candidates = [];
      for (const wordEl of wordEls) {
        const slots = wordEl.querySelectorAll('.target-slot');
        const slot = slots[idx];
        if (
          slot &&
          !slot.classList.contains('filled') &&
          !slot.classList.contains('hinted') &&
          !slot.classList.contains('dandelion-pending')
        ) {
          candidates.push(slot);
        }
      }
      if (candidates.length > 0) {
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        picked.textContent = picked.dataset.letter;
        picked.classList.add('hinted');
        this.sound.playSelect(idx + 2);
        return true;
      }
    }
  }

  renderBoardGrid(savedSession = null) {
    this.elBoardGrid.innerHTML = '';
    this.tiles = [];

    const grid = this.currentLevel.grid;
    const layers = savedSession?.tileLayers || this.currentLevel.layers;
    const rows = grid.length;
    const cols = grid[0].length;
    const isFiveCols = cols === 5;
    this.elBoardGrid.classList.toggle('cols-5', isFiveCols);
    const tilePxu = isFiveCols ? (56 / 66) * TILE_PXU : TILE_PXU;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const lv = layers[r] && typeof layers[r][c] === 'number' ? layers[r][c] : this.currentLevel.layers[r][c];
        const tile = new Tile(r, c, grid[r][c], lv, tilePxu);
        if (lv <= 0) {
          tile.el.style.opacity = '0';
          tile.el.style.pointerEvents = 'none';
          tile.use.textContent = '';
        }
        cell.appendChild(tile.el);
        this.elBoardGrid.appendChild(cell);
        this.tiles.push(tile);
      }
    }
  }

  renderCollectibles(savedSession = null) {
    if (!this.elBoardCollectibles) return;
    this.elBoardCollectibles.innerHTML = '';
    this.collectibles = [];

    if (!this.state.eventActive || this.state.isDaily || this.state.isCustom) return;

    const theme = EVENT_THEMES[this.state.eventThemeIndex % EVENT_THEMES.length];
    let placements;
    if (savedSession?.collectibles && savedSession.collectibles.length > 0) {
      placements = savedSession.collectibles;
    } else {
      const rLeft = Math.floor(Math.random() * 2);
      const rRight = Math.floor(Math.random() * 2);
      placements = [
        { r: rLeft, c: 0, collected: false },
        { r: rRight, c: 2, collected: false },
      ];
    }

    const step = 66 + 7;
    const span = 66 * 2 + 7;

    placements.forEach((pos) => {
      const el = document.createElement('div');
      el.className = 'collectible-item' + (pos.collected ? ' collected' : '');
      el.style.left = `${pos.c * step}px`;
      el.style.top = `${pos.r * step}px`;
      el.style.width = `${span}px`;
      el.style.height = `${span}px`;
      el.innerHTML = `<div class="collectible-item-box">□ ${theme.itemName}</div>`;
      this.elBoardCollectibles.appendChild(el);

      this.collectibles.push({
        r: pos.r,
        c: pos.c,
        name: theme.itemName,
        el,
        collected: !!pos.collected,
      });
    });
  }

  checkBuriedCollectibles() {
    if (!this.state.eventActive || this.state.isDaily || this.state.isCustom || this.collectibles.length === 0) return;

    for (const item of this.collectibles) {
      if (item.collected) continue;

      // 检查该 2×2 区域上的 4 个字母格是否已全部消除
      const coveredTiles = this.tiles.filter(
        (t) =>
          (t.row === item.r || t.row === item.r + 1) &&
          (t.col === item.c || t.col === item.c + 1)
      );
      const allCleared =
        coveredTiles.length === 4 && coveredTiles.every((t) => t.layers <= 0);

      if (allCleared) {
        item.collected = true;
        item.el.classList.add('collected');
        this.collectEventItem(item);
      }
    }
  }

  collectEventItem(item) {
    this.state.eventProgress += 1;
    const reachedFive = this.state.eventProgress >= 5;
    if (reachedFive) {
      this.state.eventProgress -= 5;
    }

    if (this.phoneFrame && item.el && this.elHudEventIcon) {
      const frameRect = this.phoneFrame.getBoundingClientRect();
      const fromRect = item.el.getBoundingClientRect();
      const toRect = this.elHudEventIcon.getBoundingClientRect();
      const startX = fromRect.left - frameRect.left + fromRect.width / 2;
      const startY = fromRect.top - frameRect.top + fromRect.height / 2;
      const dx = toRect.left - frameRect.left + toRect.width / 2 - startX;
      const dy = toRect.top - frameRect.top + toRect.height / 2 - startY;

      const flyer = document.createElement('div');
      flyer.className = 'flying-collectible';
      flyer.textContent = `□ ${item.name}`;
      flyer.style.left = `${startX}px`;
      flyer.style.top = `${startY}px`;
      this.phoneFrame.appendChild(flyer);

      requestAnimationFrame(() => {
        flyer.style.transform = `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px)) scale(0.55)`;
      });

      setTimeout(() => {
        flyer.style.opacity = '0';
        this.elHudEventIcon.classList.remove('pop');
        void this.elHudEventIcon.offsetWidth;
        this.elHudEventIcon.classList.add('pop');
        this.updateHudEventUI(reachedFive);

        if (reachedFive) {
          this.state.coins += 20;
          this.updateGameHUD();
          this.updateLobbyUI();
          this.showEventToast(`收集满 5/5！获得奖励 +20 金币`);
        } else {
          this.updateLobbyUI();
          this.showEventToast(`收集到 ${item.name} (${this.state.eventProgress}/5)`);
        }
        this.saveProgress();
      }, 460);

      setTimeout(() => flyer.remove(), 620);
    } else {
      if (reachedFive) {
        this.state.coins += 20;
        this.showEventToast(`收集满 5/5！获得奖励 +20 金币`);
      } else {
        this.showEventToast(`收集到 ${item.name} (${this.state.eventProgress}/5)`);
      }
      this.updateGameHUD();
      this.updateLobbyUI();
      this.saveProgress();
    }
  }

  flyLettersToTarget(matchedTiles, targetEl) {
    if (!targetEl || !this.phoneFrame) return;
    const slots = targetEl.querySelectorAll('.target-slot');
    const frameRect = this.phoneFrame.getBoundingClientRect();

    matchedTiles.forEach((tile, idx) => {
      const slot = slots[idx];
      if (!slot) return;

      const fromRect = tile.el.getBoundingClientRect();
      const toRect = slot.getBoundingClientRect();
      const startX = fromRect.left - frameRect.left + fromRect.width / 2;
      const startY = fromRect.top - frameRect.top + fromRect.height / 2;
      const dx = toRect.left - frameRect.left + toRect.width / 2 - startX;
      const dy = toRect.top - frameRect.top + toRect.height / 2 - startY;

      const flyer = document.createElement('div');
      flyer.className = 'flying-letter';
      flyer.textContent = tile.letter;
      flyer.style.left = `${startX}px`;
      flyer.style.top = `${startY}px`;
      this.phoneFrame.appendChild(flyer);

      setTimeout(() => {
        flyer.style.transform = `translate(${dx}px, ${dy}px) scale(0.88)`;
      }, 16 + idx * 45);

      setTimeout(() => {
        slot.textContent = tile.letter;
        slot.classList.add('filled');
        flyer.style.opacity = '0';
      }, 310 + idx * 45);

      setTimeout(() => {
        flyer.remove();
      }, 520 + idx * 45);
    });

    setTimeout(() => {
      targetEl.classList.add('solved');
    }, 320 + matchedTiles.length * 45);
  }

  getTileFromPoint(clientX, clientY) {
    let best = null, bestD = Infinity;
    for (const t of this.tiles) {
      if (t.layers <= 0 || fxBreaks.has(t)) continue;
      const r = t.el.getBoundingClientRect();
      if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) continue;
      const dx = clientX - (r.left + r.width / 2);
      const dy = clientY - (r.top + r.height / 2);
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = t;
      }
    }
    return best;
  }

  isOrthogonalAdjacent(a, b) {
    const dr = Math.abs(a.row - b.row);
    const dc = Math.abs(a.col - b.col);
    return dr + dc === 1;
  }

  onPointerDown(e) {
    if (this.state.currentScreen !== 'game' || this.state.paused || this.feedbackLock) return;
    const tile = this.getTileFromPoint(e.clientX, e.clientY);
    if (!tile) return;

    e.preventDefault();
    this.isDragging = true;
    this.selectedChain = [tile];
    tile.markSelected(this.clock);
    tile.down(this.clock);
    this.sound.playSelect(0);
    this.updatePointerPos(e.clientX, e.clientY);
    this.refreshSelectionUI();
  }

  onPointerMove(e) {
    if (!this.isDragging || this.state.paused || this.feedbackLock) return;
    e.preventDefault();
    this.updatePointerPos(e.clientX, e.clientY);

    const tile = this.getTileFromPoint(e.clientX, e.clientY);
    if (tile) {
      const lastTile = this.selectedChain[this.selectedChain.length - 1];
      if (tile !== lastTile) {
        // 回退上一格可撤销
        if (this.selectedChain.length > 1 && tile === this.selectedChain[this.selectedChain.length - 2]) {
          this.selectedChain.pop().up(this.clock);
        } else if (!this.selectedChain.includes(tile) && this.isOrthogonalAdjacent(lastTile, tile)) {
          // 每次不能重复连接某块，且仅允许横向/竖向相邻连接
          this.selectedChain.push(tile);
          tile.markSelected(this.clock);
          tile.down(this.clock);
          this.sound.playSelect(this.selectedChain.length - 1);
        }
      }
    }

    this.refreshSelectionUI();
  }

  onPointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.pointerPos = null;

    if (this.selectedChain.length === 0) return;

    const word = this.selectedChain.map((t) => t.letter).join('');
    const isTarget =
      this.currentLevel.targets.includes(word) && !this.solvedWords.has(word);
    const isBonus =
      !this.currentLevel.targets.includes(word) &&
      word.length >= 3 &&
      BONUS_WORDS.has(word);

    if (isTarget) {
      this.handleValidWord(word);
    } else if (isBonus) {
      this.handleBonusWord(word);
    } else {
      this.handleInvalidWord();
    }
  }

  updatePointerPos(clientX, clientY) {
    const rect = this.elBoardContainer.getBoundingClientRect();
    this.pointerPos = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  refreshSelectionUI() {
    const word = this.selectedChain.map((t) => t.letter).join('');
    this.updateCurrentWordBar(word);
    this.renderLines();
  }

  updateCurrentWordBar(word, status = '') {
    this.elCurrentWordBar.textContent = word;
    this.elCurrentWordBar.className = 'current-word-bar';
    if (word.length > 0) {
      this.elCurrentWordBar.classList.add('visible');
    }
    if (status) {
      this.elCurrentWordBar.classList.add(status);
    }
  }

  getTileCenter(tile) {
    const containerRect = this.elBoardContainer.getBoundingClientRect();
    const tileRect = tile.el.getBoundingClientRect();
    return {
      x: tileRect.left - containerRect.left + tileRect.width / 2,
      y: tileRect.top - containerRect.top + tileRect.height / 2,
    };
  }

  renderLines(color = null) {
    this.elBoardLines.innerHTML = '';
    if (this.selectedChain.length === 0) return;

    const strokeColor = color || selectedPalette.Base;
    const points = this.selectedChain.map((t) => this.getTileCenter(t));
    if (this.isDragging && this.pointerPos && this.selectedChain.length > 0) {
      points.push(this.pointerPos);
    }

    if (points.length < 2) return;

    const pathData = points
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', strokeColor);
    path.setAttribute('stroke-width', '10');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.style.opacity = '0.85';
    this.elBoardLines.appendChild(path);
  }

  clearLines() {
    this.elBoardLines.innerHTML = '';
  }

  updateUndoButtonState() {
    if (this.btnDbgGameUndo) {
      this.btnDbgGameUndo.disabled = !this.undoStack || this.undoStack.length === 0;
    }
  }

  pushUndoSnapshot() {
    if (!this.currentLevel || this.tiles.length === 0) return;
    if (!this.undoStack) this.undoStack = [];
    this.undoStack.push({
      session: this.captureCurrentSession(),
      eventProgress: this.state.eventProgress,
      coins: this.state.coins,
      weeklyStats: JSON.parse(JSON.stringify(this.weeklyStats || this.createDefaultWeeklyStats())),
      learnedWordsAllTime: Array.from(this.learnedWordsAllTime || []),
    });
    this.updateUndoButtonState();
  }

  undoLastStep() {
    if (
      this.state.currentScreen !== 'game' ||
      this.feedbackLock ||
      !this.undoStack ||
      this.undoStack.length === 0
    ) {
      return;
    }

    const snap = this.undoStack.pop();
    if (!snap || !snap.session) return;

    this.sound.playClick();
    fxBreaks.clear();
    fxBursts.length = 0;

    const s = snap.session;
    this.state.score = s.score || 0;
    this.levelTournamentPoints =
      typeof s.levelTournamentPoints === 'number' ? s.levelTournamentPoints : 0;
    this.state.eventProgress = snap.eventProgress;
    this.state.coins = snap.coins;
    this.weeklyStats = snap.weeklyStats;
    this.learnedWordsAllTime = new Set(snap.learnedWordsAllTime);

    this.solvedWords.clear();
    (s.solvedWords || []).forEach((w) => this.solvedWords.add(w));
    this.bonusWords.clear();
    (s.bonusWords || []).forEach((w) => this.bonusWords.add(w));

    this.selectedChain = [];
    this.renderTargetZone(s);
    this.renderBoardGrid(s);
    this.renderCollectibles(s);
    this.clearLines();
    this.updateCurrentWordBar('');
    this.updateGameHUD();
    this.updateBonusUI();
    this.updateLobbyUI();
    this.updateDebugPanel();
    this.updateUndoButtonState();
    this.saveProgress();
  }

  findChainForWord(word) {
    if (!word || !this.tiles || this.tiles.length === 0) return [];
    const chars = [...word];
    const activeTiles = this.tiles.filter((t) => t.layers > 0);

    // DFS 搜寻相邻且可用层数 > 0 的合法路径
    const visited = new Set();
    const path = [];
    const dfs = (idx, lastTile) => {
      if (idx === chars.length) return true;
      const targetCh = chars[idx];
      for (const t of activeTiles) {
        if (visited.has(t) || t.letter !== targetCh) continue;
        if (lastTile) {
          const dr = Math.abs(t.row - lastTile.row);
          const dc = Math.abs(t.col - lastTile.col);
          if (dr > 1 || dc > 1 || (dr === 0 && dc === 0)) continue;
        }
        visited.add(t);
        path.push(t);
        if (dfs(idx + 1, t)) return true;
        path.pop();
        visited.delete(t);
      }
      return false;
    };

    if (dfs(0, null)) return path;

    // 兜底：若棋盘曾被手动破坏导致无相邻路径，按字母匹配可用格子
    const fallback = [];
    const used = new Set();
    for (const ch of chars) {
      const found =
        activeTiles.find((t) => !used.has(t) && t.letter === ch) ||
        this.tiles.find((t) => !used.has(t) && t.letter === ch);
      if (found) {
        used.add(found);
        fallback.push(found);
      }
    }
    return fallback;
  }

  quickFillNextWord() {
    if (
      this.state.currentScreen !== 'game' ||
      this.state.paused ||
      this.feedbackLock ||
      !this.currentLevel
    ) {
      return;
    }

    const sortedTargets = [...this.currentLevel.targets].sort(
      (a, b) => a.length - b.length || a.localeCompare(b)
    );
    const nextWord = sortedTargets.find((w) => !this.solvedWords.has(w));
    if (!nextWord) return;

    this.selectedChain = this.findChainForWord(nextWord);
    this.handleValidWord(nextWord);
  }

  quickDiscoverBonusWord() {
    if (
      this.state.currentScreen !== 'game' ||
      this.state.paused ||
      this.isDragging ||
      this.feedbackLock ||
      !this.currentLevel
    ) {
      return;
    }

    for (const word of BONUS_WORDS) {
      if (word.length < 3 || this.currentLevel.targets.includes(word) || this.bonusWords.has(word)) continue;
      this.handleBonusWord(word);
      return;
    }
  }

  quickWinCurrentLevel() {
    if (
      this.state.currentScreen !== 'game' ||
      this.state.paused ||
      this.feedbackLock ||
      !this.currentLevel
    ) {
      return;
    }

    this.feedbackLock = true;
    const unsolved = this.currentLevel.targets.filter((w) => !this.solvedWords.has(w));
    unsolved.forEach((w) => {
      this.solvedWords.add(w);
      this.recordWordLearned(w);
      this.state.score += w.length * 100;
      if (this.state.tournamentActive && !this.state.isDaily && !this.state.isCustom) {
        this.levelTournamentPoints += 1;
      }
    });

    this.tiles.forEach((t) => {
      if (t.layers > 0) {
        t.layers = 0;
        t.use.textContent = '';
        t.el.style.opacity = '0';
        t.el.style.pointerEvents = 'none';
      }
    });
    this.checkBuriedCollectibles();
    this.renderTargetZone();
    this.updateGameHUD();

    this.completeLevel(180);
  }

  completeLevel(delay) {
    const run = this.gameRun;
    if (!run || run.completed || this.state.currentScreen !== 'game') return;
    run.completed = true;
    const isMain = !this.state.isDaily && !this.state.isCustom;
    const shouldRunTournamentAnim = isMain && this.state.tournamentActive &&
      this.getNowMs() < this.state.tournamentEndTime;
    const targetPts = this.levelTournamentPoints;
    const clearBonusPts = 3;
    const oldScore = this.state.tournamentScore;
    const newScore = oldScore + targetPts + clearBonusPts;
    if (shouldRunTournamentAnim) {
      this.state.tournamentScore = newScore;
      this.levelTournamentPoints = 0;
    }

    const mountainPromotion = this.state.isCustom ? null : this.mountain.awardClear();
    if (isMain) {
      this.state.levelIndex += 1;
      this.mainSession = null;
    } else if (this.state.isDaily) {
      this.dailyWinDays.add(this.getDailyDayIndex());
      this.dailySession = null;
    }
    if (!this.state.isCustom) this.recordLevelCleared();

    this.undoStack = [];
    this.updateUndoButtonState();
    this.saveProgress();

    const finish = () => {
      if (this.gameRun !== run) return;
      this.feedbackLock = false;
      this.finishGame(mountainPromotion);
    };
    setTimeout(() => {
      if (this.gameRun !== run) return;
      if (shouldRunTournamentAnim) {
        this.playTournamentRankAnimation(oldScore, newScore, targetPts, clearBonusPts, finish);
      } else {
        finish();
      }
    }, delay);
  }

  handleValidWord(word) {
    const run = this.gameRun;
    this.pushUndoSnapshot();
    this.feedbackLock = true;
    const isFirstSolveInLevel = !this.solvedWords.has(word);
    this.solvedWords.add(word);
    this.sound.playValidWord();

    if (isFirstSolveInLevel) {
      this.recordWordLearned(word);
    }

    // 计分
    this.state.score += word.length * 100;
    if (this.state.tournamentActive && !this.state.isDaily && !this.state.isCustom) {
      this.levelTournamentPoints += 1;
    }
    this.updateGameHUD();

    const matchedTiles = [...this.selectedChain];
    const targetEl = this.elTargetWords.querySelector(`[data-word="${word}"]`);
    this.flyLettersToTarget(matchedTiles, targetEl);

    let anyVanished = false;
    matchedTiles.forEach((t) => {
      t.layers = Math.max(0, t.layers - 1);
      t.use.textContent = t.layers > 0 ? t.layers : '';
      // 仅当层数归 0 格子消失时播放碎块效果；其余情况仅正常回弹
      if (t.layers <= 0) {
        anyVanished = true;
        this.shatter(t);
      } else {
        t.up(this.clock);
      }
    });

    if (anyVanished) {
      this.sound.playTileVanish();
      this.checkBuriedCollectibles();
    }

    this.updateCurrentWordBar(word, 'valid');
    this.renderLines('#7c8f6b');

    setTimeout(() => {
      if (this.gameRun !== run) return;
      this.selectedChain = [];
      this.clearLines();
      this.updateCurrentWordBar('');

      if (this.solvedWords.size === this.currentLevel.targets.length) {
        this.completeLevel(480);
      } else {
        this.feedbackLock = false;
        this.saveProgress();
      }
    }, 260);
  }

  handleBonusWord(word) {
    const run = this.gameRun;
    this.feedbackLock = true;
    const isNew = !this.bonusWords.has(word);
    if (isNew) {
      this.bonusWords.add(word);
      this.bonusProgress += 1;
      this.recordWordLearned(word);
      this.sound.playValidWord();
      this.saveProgress();
    } else {
      this.sound.playClick();
    }

    // 额外词连接成功后，不减少字母格子层数，仅回弹复位
    const matchedTiles = [...this.selectedChain];
    matchedTiles.forEach((t) => t.up(this.clock));
    const lastTile = matchedTiles.at(-1);
    const reachedFive = isNew && this.bonusProgress % 5 === 0;

    if (isNew && lastTile && this.btnBonusWords && this.phoneFrame) {
      const frameRect = this.phoneFrame.getBoundingClientRect();
      const fromRect = lastTile.el.getBoundingClientRect();
      const toRect = this.btnBonusWords.getBoundingClientRect();
      const startX = fromRect.left - frameRect.left + fromRect.width / 2;
      const startY = fromRect.top - frameRect.top + fromRect.height / 2;
      const dx = toRect.left - frameRect.left + toRect.width / 2 - startX;
      const dy = toRect.top - frameRect.top + toRect.height / 2 - startY;

      const flyer = document.createElement('div');
      flyer.className = 'flying-letter flying-bonus';
      flyer.textContent = '';
      flyer.style.left = `${startX}px`;
      flyer.style.top = `${startY}px`;
      this.phoneFrame.appendChild(flyer);

      setTimeout(() => {
        flyer.style.transform = `translate(${dx}px, ${dy}px) scale(0.75)`;
      }, 16);

      setTimeout(() => {
        flyer.style.opacity = '0';
        if (this.gameRun !== run) return;
        this.updateBonusUI(reachedFive);
        this.btnBonusWords.classList.remove('pop');
        void this.btnBonusWords.offsetWidth;
        this.btnBonusWords.classList.add('pop');
      }, 310);

      setTimeout(() => {
        flyer.remove();
      }, 500);
    } else {
      if (isNew) this.updateBonusUI(reachedFive);
      if (this.btnBonusWords) {
        this.btnBonusWords.classList.remove('pop');
        void this.btnBonusWords.offsetWidth;
        this.btnBonusWords.classList.add('pop');
      }
    }

    this.updateCurrentWordBar(word, 'valid');
    this.renderLines('#b99a5b');

    setTimeout(() => {
      if (this.gameRun !== run) return;
      this.selectedChain = [];
      this.clearLines();
      this.updateCurrentWordBar('');
      this.feedbackLock = false;
    }, 240);
  }

  handleInvalidWord() {
    this.feedbackLock = true;
    this.sound.playInvalidWord();
    const word = this.selectedChain.map((t) => t.letter).join('');

    this.selectedChain.forEach((t) => t.up(this.clock));
    this.updateCurrentWordBar(word, 'invalid');
    this.renderLines('#b5654a');

    setTimeout(() => {
      this.selectedChain = [];
      this.clearLines();
      this.updateCurrentWordBar('');
      this.feedbackLock = false;
    }, 240);
  }

  finishGame(mountainPromotion = null) {
    this.sound.playVictory();

    const prevStep = this.state.chestProgress % 5;
    let nextStep = prevStep;
    let chestUnlocked = false;

    if (!this.state.isCustom) {
      nextStep = prevStep + 1;
      if (nextStep >= 5) {
        chestUnlocked = true;
        this.state.coins += 20;
        this.state.chestProgress = 0;
      } else {
        this.state.chestProgress = nextStep;
      }
      if (!this.state.isDaily && this.state.rapidsActive) {
        this.state.rapidsClearedCount = (this.state.rapidsClearedCount || 0) + 1;
      }
    }

    this.updateLobbyUI();
    this.updateDebugPanel();
    this.saveProgress();

    this.elResultNextLevel.textContent = this.state.isCustom ? '返回编辑器' : `Level ${this.state.levelIndex + 1}`;
    this.elResultRewardLabel.textContent = '宝箱奖励';

    if (this.elResultChestCard) {
      this.elResultChestCard.classList.remove('unlocked');
    }
    if (this.elResultChestLabel) {
      this.elResultChestLabel.textContent = '关卡宝箱';
    }
    if (this.elResultChestStep) {
      this.elResultChestStep.textContent = `${prevStep}/5`;
    }
    if (this.elResultChestFill) {
      this.elResultChestFill.style.transition = 'none';
      this.elResultChestFill.style.width = `${(prevStep / 5) * 100}%`;
    }

    this.switchScreen('result');

    const run = this.gameRun;
    const showRapids = () => {
      if (!this.state.isCustom && !this.state.isDaily && this.state.rapidsActive) {
        setTimeout(() => {
          if (this.gameRun === run && this.state.currentScreen === 'result') {
            this.checkAndTriggerRapidsAtResult();
          }
        }, 620);
      }
    };
    if (mountainPromotion) this.mountain.show(mountainPromotion, showRapids);
    else showRapids();

    setTimeout(() => {
      if (this.gameRun !== run || this.state.currentScreen !== 'result') return;
      if (this.elResultChestFill) {
        this.elResultChestFill.style.transition = 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        this.elResultChestFill.style.width = `${(nextStep / 5) * 100}%`;
      }
      if (this.elResultChestStep) {
        this.elResultChestStep.textContent = `${nextStep}/5`;
      }
      if (chestUnlocked) {
        setTimeout(() => {
          if (this.gameRun !== run || this.state.currentScreen !== 'result') return;
          this.elResultRewardLabel.textContent = '已获得';
          if (this.elResultChestCard) {
            this.elResultChestCard.classList.add('unlocked');
          }
          if (this.elResultChestLabel) {
            this.elResultChestLabel.textContent = '宝箱开启 · +20 金币';
          }
          this.sound.playValidWord();
        }, 460);
      }
    }, 120);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameFramework();
});
