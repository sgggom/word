/* 关卡编辑器：大厅按空格（触屏长按封面标题）打开 */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const WP = window.WP;
const STORE = 'wordpages.editor';
const MIN_W = 2, MAX_W = 6, MIN_H = 2, MAX_H = 5;
const TIER = window.TIER || {};
const tierName = k => t('tiers')[k];
const tierTag = w => TIER[w] ? `<em class="tier t${TIER[w]}">${tierName(TIER[w])}</em>` : '';

/* ---------- 存储 ---------- */
function blank(W = 4, H = 3){
  return {id:null, name:'', W, H, letters:Array(W*H).fill(''), words:[], extras:[],
    curtains:[{req:2, cells:[]},{req:4, cells:[]}]};
}
let store;
try{ store = JSON.parse(localStorage.getItem(STORE) || 'null'); }catch(e){ store = null; }
if(!store || !store.draft) store = {draft: blank(), saved: []};
let D = store.draft;
function persist(){ try{ localStorage.setItem(STORE, JSON.stringify(store)); }catch(e){} }

/* ---------- 词汇：现有关卡与词典里出现过的所有单词 ---------- */
let trie = null;
function buildTrie(){
  const words = new Set();
  const addLv = arr => (arr || []).forEach(l => { l.t.split(' ').forEach(w => words.add(w)); if(l.e) l.e.split(' ').forEach(w => words.add(w)); });
  (window.BOOKS || []).forEach(b => addLv(b.levels)); addLv(window.DAILY); addLv(window.REF_LEVELS); addLv(window.REF_DAILY);
  Object.keys(window.DEFS || {}).forEach(w => words.add(w));
  Object.keys(window.REF_DEFS || {}).forEach(w => words.add(w));
  Object.keys(TIER).forEach(w => words.add(w));
  trie = {};
  for(const w of words){
    if(!/^[A-Z]{3,}$/.test(w)) continue;
    let n = trie; for(const ch of w) n = n[ch] = n[ch] || {}; n.$ = w;
  }
}

/* ---------- 网格算法 ---------- */
const N = () => D.W * D.H;
function nb(i){
  const W = D.W, H = D.H, r = Math.floor(i / W), c = i % W, o = [];
  if(r > 0) o.push(i - W); if(r < H - 1) o.push(i + W);
  if(c > 0) o.push(i - 1); if(c < W - 1) o.push(i + 1);
  return o;
}
function pathsOf(word, limit = 300){
  const res = [], used = new Uint8Array(N()), p = [];
  (function start(){
    for(let s = 0; s < N(); s++) dfs(s, 0);
  })();
  function dfs(i, k){
    if(res.length >= limit || used[i] || D.letters[i] !== word[k]) return;
    used[i] = 1; p.push(i);
    if(k === word.length - 1) res.push(p.slice());
    else nb(i).forEach(n => dfs(n, k + 1));
    used[i] = 0; p.pop();
  }
  return res;
}
function scanWords(){
  if(!trie) buildTrie();
  const found = new Set(), used = new Uint8Array(N());
  function dfs(i, node){
    const nx = node[D.letters[i]]; if(!nx) return;
    used[i] = 1;
    if(nx.$) found.add(nx.$);
    nb(i).forEach(n => { if(!used[n]) dfs(n, nx); });
    used[i] = 0;
  }
  for(let i = 0; i < N(); i++) if(D.letters[i]) dfs(i, trie);
  return [...found];
}
function activeCurtains(){ return D.curtains.filter(c => c.cells.length).map(c => ({req: Math.max(1, c.req | 0), cells: new Set(c.cells)})); }
function orderFeasible(assign, curt){
  if(!curt.length) return true;
  const left = assign.map((_, i) => i); let found = 0;
  while(left.length){
    const closed = new Set(); curt.forEach(c => { if(found < c.req) c.cells.forEach(x => closed.add(x)); });
    const k = left.findIndex(i => !assign[i].some(x => closed.has(x)));
    if(k < 0) return false;
    left.splice(k, 1); found++;
  }
  return true;
}
/* 为每个目标词挑一条路径，使所有格子都被用到，并满足幕布顺序 */
function analyze(){
  const res = {paths: {}, counts: null, uncovered: [], errors: [], empty: D.letters.filter(x => !x).length};
  D.words.forEach(w => res.paths[w] = pathsOf(w));
  const bad = D.words.filter(w => !res.paths[w].length);
  if(res.empty || !D.words.length || bad.length){ res.bad = bad; return res; }
  const union = new Set(); D.words.forEach(w => res.paths[w].forEach(p => p.forEach(x => union.add(x))));
  res.uncovered = [...Array(N()).keys()].filter(i => !union.has(i));
  if(res.uncovered.length) return res;
  const curt = activeCurtains();
  const order = D.words.slice().sort((a, b) => res.paths[a].length - res.paths[b].length);
  const pick = {}; let budget = 150000, timeout = false;
  const cov = new Uint8Array(N());
  function rec(k, covered){
    if(--budget < 0){ timeout = true; return false; }
    if(k === order.length){
      if(covered !== N()) return false;
      return orderFeasible(D.words.map(w => pick[w]), curt);
    }
    const w = order[k];
    for(const p of res.paths[w]){
      let add = 0; p.forEach(x => { if(!cov[x]++) add++; });
      pick[w] = p;
      if(rec(k + 1, covered + add)) return true;
      p.forEach(x => cov[x]--);
    }
    return false;
  }
  if(rec(0, 0)){
    res.counts = Array(N()).fill(0);
    D.words.forEach(w => pick[w].forEach(x => res.counts[x]++));
    res.assign = pick;
  } else res.fail = timeout ? 'timeout' : (curt.length ? 'curtain' : 'cover');
  return res;
}
function toLevel(a){
  const rows = []; for(let r = 0; r < D.H; r++) rows.push(D.letters.slice(r * D.W, r * D.W + D.W).join(''));
  const words = D.words.slice().sort((x, y) => x.length - y.length || x.localeCompare(y));
  const lv = {id: D.id || ('c' + Date.now().toString(36)), name: D.name.trim(), g: rows.join(','), t: words.join(' '),
    e: D.extras.slice().sort().join(' '), n: a.counts.map(c => c.toString(36)).join('')};
  const o = D.curtains.filter(c => c.cells.length).map(c => [Math.max(1, c.req | 0), c.cells.slice().sort((x, y) => x - y)]);
  if(o.length) lv.o = o;
  return lv;
}
function fromLevel(lv){
  const rows = lv.g.split(','), H = rows.length, W = rows[0].length;
  const d = blank(W, H);
  d.id = lv.id && String(lv.id).startsWith('c') ? lv.id : null;
  d.name = lv.name || '';
  d.letters = rows.join('').split('');
  d.words = lv.t ? lv.t.split(' ') : [];
  d.extras = lv.e ? lv.e.split(' ') : [];
  (lv.o || []).slice(0, 2).forEach(([req, cells], k) => { d.curtains[k] = {req, cells: cells.slice()}; });
  return d;
}

/* ---------- 渲染 ---------- */
let mode = 'letter', A = null, timer = null;
const gridEl = $('#edGrid');

function render(){
  $('#edW').textContent = D.W; $('#edH').textContent = D.H;
  $('#edName').value = D.name;
  document.querySelectorAll('#edMode button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
  $('#edReqWrap').hidden = mode === 'letter';
  if(mode !== 'letter') $('#edReq').value = D.curtains[+mode].req;
  buildGrid();
  refresh();
  renderSaved();
}
function buildGrid(){
  gridEl.innerHTML = '';
  gridEl.style.setProperty('--cols', D.W);
  gridEl.classList.toggle('paint', mode !== 'letter');
  for(let i = 0; i < N(); i++){
    const cell = document.createElement('div'); cell.className = 'ed-tile'; cell.dataset.i = i;
    cell.innerHTML = `<input maxlength="2" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="${t('ed.cell', i + 1)}"><span class="cnt"></span>`;
    const inp = cell.querySelector('input');
    inp.value = D.letters[i];
    inp.readOnly = mode !== 'letter';
    gridEl.appendChild(cell);
  }
}
function refresh(){
  A = analyze();
  const tiles = gridEl.children;
  for(let i = 0; i < tiles.length; i++){
    const t = tiles[i];
    t.classList.toggle('empty', !D.letters[i]);
    t.classList.toggle('unc', A.uncovered.includes(i));
    t.querySelector('.cnt').textContent = A.counts ? A.counts[i] : '';
    t.querySelectorAll('.cur').forEach(x => x.remove());
    D.curtains.forEach((c, k) => {
      if(!c.cells.includes(i)) return;
      const cv = document.createElement('div'); cv.className = 'cur' + (k ? ' b' : '');
      cv.innerHTML = `<span>${'AB'[k]}</span>`; t.appendChild(cv);
    });
  }
  // 词表
  $('#edWordCount').textContent = D.words.length;
  $('#edWords').innerHTML = D.words.length ? D.words.map(w => {
    const n = (A.paths[w] || []).length;
    return `<span class="chip${n ? '' : ' bad'}">${w}${tierTag(w)}<em>${n ? (n > 1 ? t('ed.routes', n) : '') : t('ed.noRoute')}</em><button class="x" data-del="${w}" aria-label="${t('aria.delete')}">×</button></span>`;
  }).join('') : `<span class="none">${t('ed.noWords')}</span>`;
  $('#edExtraCount').textContent = D.extras.length;
  $('#edExtras').innerHTML = D.extras.length ? D.extras.map(w => `<span class="chip">${w}<button class="x" data-delx="${w}" aria-label="${t('aria.delete')}">×</button></span>`).join('') : `<span class="none">${t('ed.extrasHint')}</span>`;
  renderSugg();
  // 检查项
  const items = [];
  items.push([A.empty === 0, A.empty ? t('ed.chk.empty', A.empty) : t('ed.chk.filled')]);
  items.push([D.words.length >= 1 && !(A.bad || []).length,
    !D.words.length ? t('ed.chk.needWord') : ((A.bad || []).length ? t('ed.chk.bad', A.bad) : t('ed.chk.allOk', D.words.length))]);
  const ready = A.empty === 0 && D.words.length && !(A.bad || []).length;
  if(ready){
    if(A.uncovered.length) items.push([false, t('ed.chk.uncovered', A.uncovered.length)]);
    else if(A.counts) items.push([true, t('ed.chk.counts')]);
    else items.push([false, A.fail === 'curtain' ? t('ed.chk.curtain')
      : (A.fail === 'timeout' ? t('ed.chk.timeout') : t('ed.chk.noCombo'))]);
  }
  const curt = D.curtains.map((c, k) => [c, k]).filter(([c]) => c.cells.length);
  curt.forEach(([c, k]) => {
    const tooMany = c.req >= D.words.length;
    items.push([!tooMany, t('ed.chk.curt', 'AB'[k], c.cells.length, c.req, tooMany)]);
  });
  $('#edStatus').innerHTML = items.map(([ok, s]) => `<li class="${ok ? 'ok' : 'bad'}">${s}</li>`).join('') + statsHtml();
  $('#edPlay').disabled = !playable();
}
/* 关卡信息：与游戏内「本页信息」一致 */
function statsHtml(){
  if(!A || !A.assign) return '';
  const words = D.words, n = words.length;
  let rev = 0, straight = 0, one = 0, multi = 0;
  words.forEach(w => {
    const p = A.assign[w], a = p[0], b = p[p.length - 1];
    const ar = Math.floor(a / D.W), ac = a % D.W, br = Math.floor(b / D.W), bc = b % D.W;
    if(ac > bc || (ac === bc && ar > br)) rev++;
    let turns = 0;
    for(let k = 2; k < p.length; k++) if(p[k] - p[k - 1] !== p[k - 1] - p[k - 2]) turns++;
    if(turns === 0) straight++; else if(turns === 1) one++; else multi++;
  });
  const sel = [0, 0, 0, 0, 0, 0]; A.counts.forEach(c => { if(c >= 2) sel[Math.min(c, 5)]++; });
  const tiers = [0, 0, 0, 0, 0, 0]; words.forEach(w => tiers[TIER[w] || 0]++);
  const extras = new Set(D.extras); (suggCache || []).forEach(w => { if(!D.words.includes(w)) extras.add(w); });
  const tierStr = [1, 2, 3, 4, 5].filter(k => tiers[k]).map(k => `<span class="tier t${k}">${tierName(k)} ${t('ed.pct', tiers[k], Math.round(100 * tiers[k] / n))}</span>`).join('')
    + (tiers[0] ? `<span class="tier">${t('tier.none')} ${tiers[0]}</span>` : '');
  return `<li class="stats"><div class="info-tiers">${tierStr}</div><dl>
    <dt>${t('info.extras')}</dt><dd>${extras.size}</dd>
    <dt>${t('info.rev')}</dt><dd>${t('info.pct', rev, n, Math.round(100 * rev / n) + '%')}</dd>
    <dt>${t('info.multi')}</dt><dd>${t('info.multiVal', sel)}</dd>
    <dt>${t('info.straight')}</dt><dd>${straight}</dd><dt>${t('info.oneTurn')}</dt><dd>${one}</dd><dt>${t('info.multiTurn')}</dt><dd>${multi}</dd>
  </dl></li>`;
}
function playable(){ return !!(A && A.counts) && D.curtains.every(c => !c.cells.length || c.req < D.words.length); }
let suggCache = null;
function renderSugg(){
  if(!suggCache) suggCache = scanWords();
  const s = suggCache.filter(w => !D.words.includes(w) && !D.extras.includes(w))
    .sort((a, b) => b.length - a.length || a.localeCompare(b));
  $('#edSugg').innerHTML = s.length ? s.slice(0, 80).map(w => `<button class="chip" data-add="${w}">${w}${tierTag(w)}</button>`).join('')
    : `<span class="none">${D.letters.some(Boolean) ? t('ed.noMore') : t('ed.fillFirst')}</span>`;
}
function changed(letters){
  if(letters) suggCache = null;
  persist();
  clearTimeout(timer); timer = setTimeout(refresh, 120);
}
function renderSaved(){
  $('#edSavedCount').textContent = store.saved.length;
  $('#edSaved').innerHTML = store.saved.length ? store.saved.map((l, k) => `
    <div class="ed-item${l.id === D.id ? ' cur' : ''}">
      <span class="nm">${esc(l.name || t('ed.untitled'))}<small>${l.g.replace(/,/g, ' / ')}</small></span>
      <button class="text-btn" data-load="${k}">${t('ed.edit')}</button>
      <button class="text-btn" data-play="${k}">${t('ed.try')}</button>
      <button class="text-btn" data-rm="${k}">${t('ed.del')}</button>
    </div>`).join('') : `<span class="none" style="font-size:13px;color:var(--ink-faint)">${t('ed.savedEmpty')}</span>`;
}
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- 交互：网格 ---------- */
function focusCell(i){ const t = gridEl.children[i]; if(t) t.querySelector('input').focus(); }
gridEl.addEventListener('input', e => {
  const t = e.target.closest('.ed-tile'); if(!t || mode !== 'letter') return;
  const i = +t.dataset.i;
  const ch = (e.target.value.toUpperCase().match(/[A-Z]/g) || []).pop() || '';
  e.target.value = ch; D.letters[i] = ch;
  changed(true);
  if(ch && i + 1 < N()) focusCell(i + 1);
});
gridEl.addEventListener('keydown', e => {
  const t = e.target.closest('.ed-tile'); if(!t) return;
  const i = +t.dataset.i, W = D.W;
  const mv = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -W, ArrowDown: W}[e.key];
  if(mv != null){ e.preventDefault(); const j = i + mv; if(j >= 0 && j < N()) focusCell(j); return; }
  if(e.key === 'Backspace' && mode === 'letter' && !e.target.value && i > 0){
    e.preventDefault(); D.letters[i - 1] = ''; gridEl.children[i - 1].querySelector('input').value = ''; focusCell(i - 1); changed(true);
  }
});
gridEl.addEventListener('focusin', e => { if(e.target.select) e.target.select(); });
gridEl.addEventListener('click', e => {
  const t = e.target.closest('.ed-tile'); if(!t || mode === 'letter') return;
  const i = +t.dataset.i, k = +mode;
  D.curtains.forEach((c, j) => { if(j !== k) c.cells = c.cells.filter(x => x !== i); });
  const c = D.curtains[k];
  c.cells = c.cells.includes(i) ? c.cells.filter(x => x !== i) : c.cells.concat(i);
  e.target.blur();
  changed(false); refresh();
});

/* ---------- 交互：尺寸 / 画笔 ---------- */
document.querySelectorAll('[data-dim]').forEach(b => b.onclick = () => {
  const dim = b.dataset.dim, d = +b.dataset.d;
  const W2 = dim === 'W' ? Math.min(MAX_W, Math.max(MIN_W, D.W + d)) : D.W;
  const H2 = dim === 'H' ? Math.min(MAX_H, Math.max(MIN_H, D.H + d)) : D.H;
  if(W2 === D.W && H2 === D.H) return;
  const map = i => { const r = Math.floor(i / D.W), c = i % D.W; return (r < H2 && c < W2) ? r * W2 + c : -1; };
  const letters = Array(W2 * H2).fill('');
  D.letters.forEach((ch, i) => { const j = map(i); if(j >= 0) letters[j] = ch; });
  D.curtains.forEach(c => { c.cells = c.cells.map(map).filter(j => j >= 0); });
  D.letters = letters; D.W = W2; D.H = H2;
  suggCache = null; persist(); render();
});
document.querySelectorAll('#edMode button').forEach(b => b.onclick = () => { mode = b.dataset.mode; render(); });
$('#edReq').addEventListener('input', e => {
  if(mode === 'letter') return;
  D.curtains[+mode].req = Math.max(1, Math.min(30, parseInt(e.target.value, 10) || 1));
  changed(false);
});
$('#edRandom').onclick = () => {
  const freq = 'EEEEEEEEAAAAAAARRRRRRIIIIIIOOOOOOTTTTTTNNNNNSSSSSLLLLCCCUUUDDDPPMMHHGGBBFYWKV';
  D.letters = D.letters.map(ch => ch || freq[Math.floor(Math.random() * freq.length)]);
  suggCache = null; persist(); render();
};
$('#edClearLetters').onclick = () => { D.letters = D.letters.map(() => ''); suggCache = null; persist(); render(); };
$('#edName').addEventListener('input', e => { D.name = e.target.value; persist(); });

/* ---------- 交互：单词 ---------- */
function addWord(raw, extra){
  const w = String(raw).toUpperCase().replace(/[^A-Z]/g, '');
  if(w.length < 3){ WP.toast(t('ed.min3')); return false; }
  if(D.words.includes(w) || D.extras.includes(w)){ WP.toast(t('ed.dup')); return false; }
  (extra ? D.extras : D.words).push(w);
  changed(false); refresh();
  return true;
}
$('#edAddForm').addEventListener('submit', e => {
  e.preventDefault();
  const inp = $('#edWordIn');
  if(addWord(inp.value)) inp.value = '';
});
$('#edWords').addEventListener('click', e => { const w = e.target.dataset.del; if(w){ D.words = D.words.filter(x => x !== w); changed(false); refresh(); } });
$('#edExtras').addEventListener('click', e => { const w = e.target.dataset.delx; if(w){ D.extras = D.extras.filter(x => x !== w); changed(false); refresh(); } });
$('#edSugg').addEventListener('click', e => { const w = e.target.dataset.add; if(w) addWord(w); });
$('#edScan').onclick = () => { suggCache = null; refresh(); WP.toast(t('ed.rescanned')); };
$('#edAllExtra').onclick = () => {
  const s = (suggCache || scanWords()).filter(w => !D.words.includes(w) && !D.extras.includes(w));
  if(!s.length){ WP.toast(t('ed.noneLeft')); return; }
  D.extras.push(...s); changed(false); refresh();
};

/* ---------- 交互：试玩 / 保存 / 导入导出 ---------- */
function current(){ if(!playable()){ WP.toast(t('ed.incomplete')); return null; } return toLevel(A); }
$('#edPlay').onclick = () => { const lv = current(); if(lv) WP.playCustom(lv); };
$('#edSave').onclick = () => {
  const lv = current(); if(!lv) return;
  D.id = lv.id;
  const k = store.saved.findIndex(x => x.id === lv.id);
  if(k >= 0) store.saved[k] = lv; else store.saved.unshift(lv);
  persist(); renderSaved(); WP.toast(t('ed.saved'));
};
$('#edNew').onclick = () => {
  WP.modal({title: t('ed.newTitle'), body: `<p style="margin:0;text-align:center">${t('ed.newBody')}</p>`,
    buttons: [{label: t('cancel')}, {label: t('ed.new'), primary: true, onClick: () => { store.draft = D = blank(D.W, D.H); suggCache = null; mode = 'letter'; persist(); render(); }}]});
};
$('#edExport').onclick = () => {
  const lv = current(); if(!lv) return;
  const ta = document.createElement('textarea'); ta.className = 'ed-io'; ta.readOnly = true; ta.value = JSON.stringify(lv);
  const body = document.createElement('div');
  body.innerHTML = `<p style="margin:0 0 8px;font-size:13px">${t('ed.exportBody')}</p>`;
  body.appendChild(ta);
  WP.modal({title: t('ed.exportTitle'), body, buttons: [{label: t('ed.close')}, {label: t('ed.copy'), primary: true, onClick: () => {
    (navigator.clipboard ? navigator.clipboard.writeText(ta.value) : Promise.reject()).then(() => WP.toast(t('ed.copied')), () => { ta.select(); document.execCommand('copy'); WP.toast(t('ed.copied')); });
  }}]});
  setTimeout(() => ta.select(), 50);
};
$('#edImport').onclick = () => {
  const ta = document.createElement('textarea'); ta.className = 'ed-io';
  ta.placeholder = t('ed.importPh');
  const body = document.createElement('div'); body.appendChild(ta);
  WP.modal({title: t('ed.importTitle'), body, buttons: [{label: t('cancel')}, {label: t('ed.import'), primary: true, onClick: () => {
    try{
      let v = JSON.parse(ta.value.trim());
      if(Array.isArray(v)) v = v[0];
      if(!v || typeof v.g !== 'string' || !/^[A-Z]+(,[A-Z]+)*$/.test(v.g)) throw 0;
      const rows = v.g.split(',');
      if(rows.some(r => r.length !== rows[0].length) || rows[0].length > MAX_W || rows.length > MAX_H) throw 0;
      v.id = null;
      store.draft = D = fromLevel(v); suggCache = null; mode = 'letter'; persist(); render();
      WP.toast(t('ed.imported'));
    }catch(e){ WP.toast(t('ed.importBad')); }
  }}]});
  setTimeout(() => ta.focus(), 50);
};
$('#edSaved').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.load != null){ store.draft = D = fromLevel(store.saved[+b.dataset.load]); suggCache = null; mode = 'letter'; persist(); render(); }
  if(b.dataset.play != null) WP.playCustom(store.saved[+b.dataset.play]);
  if(b.dataset.rm != null){
    const k = +b.dataset.rm, lv = store.saved[k];
    WP.modal({title: t('ed.rmTitle'), body: `<p style="margin:0;text-align:center">${t('ed.rmBody', esc(lv.name || t('ed.untitled')))}</p>`,
      buttons: [{label: t('cancel')}, {label: t('ed.del'), primary: true, onClick: () => { store.saved.splice(k, 1); if(D.id === lv.id) D.id = null; persist(); renderSaved(); }}]});
  }
});

window.Editor = {render};
})();
