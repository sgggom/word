/* ============================================================
   关卡编辑器：点击大厅 logo 打开
   - 自动生成（tools/levelgen.js，按关卡序号选择难度档位）
   - 手动编辑：点击格子改字母/层数，编辑目标词
   - 实时分析：可解性、解法数、陷阱词、共用格、额外词
   - 试玩 / 复制 JSON
   ============================================================ */
(function () {
  const $ = (id) => document.getElementById(id);
  const screen = $('screen-editor');
  if (!screen || !window.LevelGen) return;

  const extra = typeof BONUS_WORDS !== 'undefined' ? Array.from(BONUS_WORDS) : [];
  const DICT = LevelGen.loadDict(window.WORDS_TEXT || '', extra);

  const PROFILE_TEXT = {
    tutorial: '教学：3–4 词，解法唯一，少量共用格',
    early: '早期：4–5 词，开始出现诱人的错路',
    mid: '中期：5–6 词，更多共用格，允许 2 种解法',
    late: '后期：6–8 词，共用格多、陷阱多',
  };

  const st = {
    rows: 3, cols: 4,
    grid: [], layers: [],
    sel: 0, seed: Date.now() % 100000,
    analysis: null,
  };

  function blank() {
    st.grid = Array.from({ length: st.rows }, () => Array(st.cols).fill(''));
    st.layers = Array.from({ length: st.rows }, () => Array(st.cols).fill(1));
    st.sel = 0;
    st.analysis = null;
  }

  function parseTargets() {
    return $('ed-targets').value.toUpperCase().split(/[^A-Z]+/).filter((w) => w.length >= 3);
  }

  function currentLevel() {
    return { grid: st.grid.map((r) => r.slice()), layers: st.layers.map((r) => r.slice()), targets: parseTargets() };
  }

  /* ---------- 渲染 ---------- */
  function renderProfile() {
    const n = Math.max(1, +$('ed-level-no').value || 1);
    const p = LevelGen.profileFor(n);
    $('ed-profile').textContent = PROFILE_TEXT[p.name] || p.name;
  }

  function renderBoard() {
    const el = $('ed-board');
    el.style.setProperty('--ed-cols', st.cols);
    el.innerHTML = '';
    st.grid.forEach((row, r) => row.forEach((ch, c) => {
      const idx = r * st.cols + c;
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'ed-cell' + (idx === st.sel ? ' sel' : '') + (ch ? '' : ' empty');
      cell.innerHTML = `<span class="ed-letter">${ch || '·'}</span><span class="ed-layer">${st.layers[r][c]}</span>`;
      cell.addEventListener('click', () => { st.sel = idx; renderBoard(); syncCellEdit(true); });
      el.appendChild(cell);
    }));
  }

  function syncCellEdit(focus) {
    const r = Math.floor(st.sel / st.cols), c = st.sel % st.cols;
    $('ed-letter').value = st.grid[r][c];
    $('ed-layer-val').textContent = st.layers[r][c];
    if (focus) { $('ed-letter').focus(); $('ed-letter').select(); }
  }

  function renderReport() {
    const box = $('ed-report');
    const a = st.analysis;
    if (!a) { box.textContent = '点击"自动生成"或"分析"'; return; }
    if (a.error) { box.innerHTML = `<div class="ed-bad">${a.error}</div>`; return; }
    const lv = currentLevel();
    const chip = (ok, text) => `<span class="ed-chip ${ok ? 'ok' : 'bad'}">${text}</span>`;
    const trapDetail = lv.targets
      .map((w, i) => (a.fatal[i] > 0 ? `${w}（${a.fatal[i]} 条错路）` : null))
      .filter(Boolean).join('、') || '无';
    const unknown = a.bonus.filter((w) => typeof BONUS_WORDS !== 'undefined' && !BONUS_WORDS.has(w)).length;
    box.innerHTML = `
      <div class="ed-chips">
        ${chip(a.solvable, a.solvable ? '可解' : '无解')}
        ${chip(a.solutions === 1, `解法 ${a.solutions}${a.capped ? '+' : ''}`)}
        ${chip(a.coverage === 1, a.coverage === 1 ? '全覆盖' : '有空格')}
        ${chip(a.trapWords > 0, `陷阱词 ${a.trapWords}/${lv.targets.length}`)}
        ${chip(a.sharedCells >= 3, `共用格 ${a.sharedCells}`)}
        ${chip(a.vowelRatio >= 0.2 && a.vowelRatio <= 0.6, `元音 ${Math.round(a.vowelRatio * 100)}%`)}
      </div>
      <div class="ed-line"><b>陷阱词</b>${trapDetail}</div>
      <div class="ed-line"><b>额外词 ${a.bonusCount}</b>${a.bonus.join(' ') || '无'}${unknown ? `<br><i>试玩时会自动加入词表（${unknown} 个新词）</i>` : ''}</div>
      <div class="ed-line"><b>最高层数</b>${a.maxLayer}　<b>词长</b>${a.lengths.join('/')}</div>`;
  }

  function renderAll() {
    $('ed-size').value = `${st.rows}x${st.cols}`;
    renderProfile();
    renderBoard();
    syncCellEdit(false);
    renderReport();
  }

  /* ---------- 分析 ---------- */
  function analyze() {
    const lv = currentLevel();
    if (lv.grid.some((row) => row.some((ch) => !/^[A-Z]$/.test(ch)))) { st.analysis = { error: '请先给所有格子填上字母' }; return renderReport(); }
    if (!lv.targets.length) { st.analysis = { error: '请填写至少 1 个目标词（≥3 字母）' }; return renderReport(); }
    st.analysis = LevelGen.analyze(lv, DICT);
    renderReport();
  }

  /* ---------- 自动生成 ---------- */
  function generate() {
    const btn = $('ed-generate');
    btn.disabled = true;
    btn.textContent = '生成中…';
    setTimeout(() => {
      const n = Math.max(1, +$('ed-level-no').value || 1);
      let res = null;
      for (let k = 0; k < 6 && !res; k++) {
        st.seed += 7919;
        res = LevelGen.generateLevel({ levelNumber: n, rows: st.rows, cols: st.cols, dict: DICT, seed: st.seed });
      }
      btn.disabled = false;
      btn.textContent = '自动生成';
      if (!res) { st.analysis = { error: '这次没生成出来，再试一次' }; return renderReport(); }
      st.grid = res.level.grid;
      st.layers = res.level.layers;
      $('ed-targets').value = res.level.targets.join(' ');
      st.analysis = res.analysis;
      renderAll();
    }, 30);
  }

  /* ---------- 事件 ---------- */
  function open() {
    if (!st.grid.length) blank();
    renderAll();
    window.game.switchScreen('editor');
  }
  window.LevelEditor = { open };

  const logo = $('game-logo');
  const openFromLogo = () => { window.game.sound.playClick(); open(); };
  logo.addEventListener('click', openFromLogo);
  logo.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openFromLogo(); });

  $('ed-back').addEventListener('click', () => { window.game.sound.playClick(); window.game.switchScreen('lobby'); });
  $('ed-level-no').addEventListener('input', renderProfile);
  $('ed-size').addEventListener('change', () => {
    const [r, c] = $('ed-size').value.split('x').map(Number);
    st.rows = r; st.cols = c; blank(); $('ed-targets').value = ''; renderAll();
  });
  $('ed-generate').addEventListener('click', generate);
  $('ed-analyze').addEventListener('click', analyze);

  $('ed-letter').addEventListener('input', () => {
    const r = Math.floor(st.sel / st.cols), c = st.sel % st.cols;
    const v = $('ed-letter').value.toUpperCase().replace(/[^A-Z]/g, '');
    st.grid[r][c] = v;
    $('ed-letter').value = v;
    if (v) st.sel = Math.min(st.sel + 1, st.rows * st.cols - 1);
    renderBoard();
    if (v) syncCellEdit(true);
  });
  const bumpLayer = (d) => {
    const r = Math.floor(st.sel / st.cols), c = st.sel % st.cols;
    st.layers[r][c] = Math.max(1, Math.min(9, st.layers[r][c] + d));
    renderBoard(); syncCellEdit(false);
  };
  $('ed-layer-minus').addEventListener('click', () => bumpLayer(-1));
  $('ed-layer-plus').addEventListener('click', () => bumpLayer(1));

  $('ed-play').addEventListener('click', () => {
    analyze();
    const a = st.analysis;
    if (!a || a.error) return;
    const lv = currentLevel();
    lv.bonus = a.bonus;
    window.game.sound.playClick();
    window.game.startCustomLevel(lv);
  });

  $('ed-copy').addEventListener('click', () => {
    const lv = currentLevel();
    const text = JSON.stringify(lv, null, 2);
    const done = () => { $('ed-copy').textContent = '已复制'; setTimeout(() => ($('ed-copy').textContent = '复制 JSON'), 1200); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
    else done();
  });

  blank();
})();
