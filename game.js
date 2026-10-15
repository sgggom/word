(() => {
'use strict';

/* ================= 基础 ================= */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
/* 关卡来源：原创关卡（随仓库发布）或本地的参考关卡（data/reference，不提交） */
const HAS_REF = !!window.REF_LEVELS;
let SET = 'orig';
try{ if(HAS_REF && localStorage.getItem('wordpages.set')==='ref') SET='ref'; }catch(e){}
/* 原创关卡分 5 册（按词汇难度比例生成）；参考关卡视为单独一册 */
const BOOKS = SET==='ref' ? [{name:'参考关卡', sub:'', ref:true, levels:window.REF_LEVELS||[]}] : (window.BOOKS||[]);
const DAILY = (SET==='ref' ? window.REF_DAILY : window.DAILY) || [];
const DEFS = (SET==='ref' ? window.REF_DEFS : window.DEFS) || {};
const ZH_DEFS = window.DEFS || {};          // 分级词表的中文释义（两套关卡都可查）
const TIER = window.TIER || {};             // 单词难度档位 1-5
const CHAPTER_SIZE = 20;
const COST_HINT = 20, COST_FIRE = 60;
const STORE_KEY = SET==='ref' ? 'wordpages.v1' : 'wordpages.orig.v2';

const POS = {n:'n.', v:'v.', a:'adj.', s:'adj.', r:'adv.'};

/* 文案见 i18n.js */
const tierName = k => t('tiers')[k];
const chapterName = k => { const a=t('chapter.names'); return a[k%a.length]; };
const bookName = b => BOOKS[b].ref ? t('book.ref') : t('book.name', b, BOOKS[b].name);
const bookSub = b => BOOKS[b].ref ? '' : t('book.sub', b, BOOKS[b].sub);
const pick = a => a[Math.floor(Math.random()*a.length)];
const fmt = (s,...a) => s.replace(/\{(\d)\}/g,(_,i)=>a[i]);
function todayKey(d=new Date()){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dayOfYear(d=new Date()){return Math.floor((d - new Date(d.getFullYear(),0,0))/864e5);}

/* ================= 存档 ================= */
const DEFAULT_SAVE = {v:1, level:0, coins:100, sound:true, words:{}, daily:{}, cur:null, tips:{}};
let save;
try{ save = Object.assign({}, DEFAULT_SAVE, JSON.parse(localStorage.getItem(STORE_KEY)||'{}')); }
catch(e){ save = Object.assign({}, DEFAULT_SAVE); }
function persist(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(save)); }catch(e){} }

/* 当前册：save.level / save.cur 始终表示当前册的进度，其他册的进度收在 save.shelf 里 */
let book = Math.min(save.book||0, Math.max(0, BOOKS.length-1));
let LEVELS = (BOOKS[book]||{levels:[]}).levels;
function bookProgress(b){ return b===book ? save.level : ((save.shelf||{})[b]||{}).level||0; }
function switchBook(nb){
  if(nb===book || !BOOKS[nb]) return;
  save.shelf = save.shelf || {};
  save.shelf[book] = {level:save.level, cur: save.cur && save.cur.mode==='c' ? save.cur : null};
  const s2 = save.shelf[nb] || {};
  save.level = s2.level || 0;
  if(!save.cur || save.cur.mode==='c') save.cur = s2.cur || null;
  book = nb; save.book = nb; LEVELS = BOOKS[nb].levels;
  persist();
}

/* ================= 音效 ================= */
let actx = null;
function ac(){
  if(!save.sound) return null;
  if(!actx){ try{ actx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } }
  if(actx.state==='suspended') actx.resume();
  return actx;
}
function tone(freq, dur=.18, type='sine', vol=.12, delay=0){
  const a=ac(); if(!a) return;
  const t=a.currentTime+delay, o=a.createOscillator(), g=a.createGain();
  o.type=type; o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t+dur+.02);
}
function noise(dur=.35, from=2400, to=500, vol=.18){
  const a=ac(); if(!a) return;
  const len=Math.floor(a.sampleRate*dur), buf=a.createBuffer(1,len,a.sampleRate), ch=buf.getChannelData(0);
  for(let i=0;i<len;i++) ch[i]=(Math.random()*2-1)*Math.pow(1-i/len,1.5);
  const s=a.createBufferSource(); s.buffer=buf;
  const f=a.createBiquadFilter(); f.type='bandpass'; f.Q.value=.8;
  f.frequency.setValueAtTime(from,a.currentTime); f.frequency.exponentialRampToValueAtTime(to,a.currentTime+dur);
  const g=a.createGain(); g.gain.value=vol;
  s.connect(f).connect(g).connect(a.destination); s.start();
}
const sfx = {
  tick(n){ tone(392*Math.pow(2,Math.min(n,12)/12), .12, 'triangle', .07); },
  found(){ tone(659,.2,'sine',.1); tone(988,.35,'sine',.09,.09); },
  extra(){ tone(784,.15,'triangle',.08); tone(1175,.25,'triangle',.07,.07); },
  bad(){ tone(140,.22,'square',.04); noise(.12,600,200,.08); },
  page(){ noise(.45,3000,600,.16); },
  done(){ [523,659,784,1047].forEach((f,i)=>tone(f,.4,'sine',.09,i*.11)); },
  reveal(){ tone(1319,.25,'sine',.06); tone(1760,.3,'sine',.05,.08); },
};

/* ================= 过渡动画工具 ================= */
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_OUT = 'cubic-bezier(.22,1,.36,1)';      // 入场：快起缓停
const EASE_IN  = 'cubic-bezier(.55,0,.75,.2)';     // 退场：缓起快走
/* 一组元素依次浮现 */
function stagger(nodes, {delay=60, step=32, max=14, y=10, dur=520}={}){
  if(calm() || !Element.prototype.animate) return;
  [...nodes].filter(Boolean).slice(0, max).forEach((n,i)=>n.animate(
    [{opacity:0, transform:`translateY(${y}px)`},{opacity:1, transform:'none'}],
    {duration:dur, delay:delay+i*step, easing:EASE_OUT, fill:'backwards'}));
}
/* 高度展开 / 收起（open=true 展开）；done 在结束后调用 */
function slide(el, open, done){
  el.getAnimations().forEach(a=>a.cancel());
  if(calm() || !el.animate){ done&&done(); return; }
  const cs=getComputedStyle(el);
  const full={height:el.offsetHeight+'px', paddingTop:cs.paddingTop, paddingBottom:cs.paddingBottom,
    marginTop:cs.marginTop, marginBottom:cs.marginBottom, opacity:1, transform:'none'};
  const zero={height:'0px', paddingTop:'0px', paddingBottom:'0px', marginTop:'0px', marginBottom:'0px', opacity:0, transform:'translateY(-6px)'};
  el.style.overflow='hidden';
  const a=el.animate(open?[zero,full]:[full,zero], {duration:open?420:300, easing:open?EASE_OUT:'cubic-bezier(.4,0,.2,1)'});
  a.onfinish=()=>{ el.style.overflow=''; done&&done(); };
}

/* ================= 屏幕切换 ================= */
/* 层级：封面 0，目录/每日/词典/编辑器 1，游戏 2；从深往浅为"返回" */
const DEPTH = {home:0, toc:1, daily:1, dict:1, editor:1, game:2};
let screen = null;
function show(id){
  const prev = screen; screen = id;
  $$('.screen').forEach(s=>s.classList.toggle('active', s.id===id));
  updateInk();
  if(id==='home') renderHome();
  if(id==='toc') renderToc();
  if(id==='daily') renderDaily();
  if(id==='dict') renderDict();
  if(id==='editor' && window.Editor) window.Editor.render();
  if(prev!==id) transitScreen(prev, id);
}
/* 屏幕间过渡：旧屏保留显示并退场，新屏入场 */
function transitScreen(prev, id){
  const to=$('#'+id), from=prev?$('#'+prev):null;
  $$('.screen').forEach(s=>{ if(s!==to && s!==from){ s.classList.remove('leaving'); s.style.zIndex=''; } });
  const panelOf = s => s.firstElementChild;
  [to, from].forEach(s=>{ if(s){ panelOf(s).getAnimations().forEach(a=>a.cancel()); s.classList.remove('leaving'); s.style.zIndex=''; } });
  if(calm() || !to.animate) return;
  const pIn=panelOf(to), back = from && DEPTH[id] < DEPTH[prev];
  let kIn, kOut, oIn={duration:560, delay:70, easing:EASE_OUT, fill:'backwards'}, oOut={duration:320, easing:EASE_IN, fill:'forwards'};
  if(!from){                                   // 首次打开
    kIn=[{opacity:0, transform:'translateY(14px) scale(.98)'},{opacity:1, transform:'none'}];
    oIn={...oIn, duration:800, delay:40};
  } else if(prev==='home' && id==='game'){     // 翻开封面
    kOut=[{opacity:1, transform:'none'},{opacity:0, transform:'perspective(1800px) rotateY(-32deg) translateX(-6%)'}];
    kIn=[{opacity:0, transform:'scale(.95)'},{opacity:1, transform:'none'}];
    oOut={...oOut, duration:460}; oIn={...oIn, duration:700, delay:160};
  } else if(prev==='game' && id==='home'){     // 合上封面
    kOut=[{opacity:1, transform:'none'},{opacity:0, transform:'scale(.95)'}];
    kIn=[{opacity:0, transform:'perspective(1800px) rotateY(-32deg) translateX(-6%)'},{opacity:1, transform:'none'}];
    oIn={...oIn, duration:700, delay:120};
  } else if(back){                             // 返回：上层纸页下沉，下层从略大处归位
    kOut=[{opacity:1, transform:'none'},{opacity:0, transform:'translateY(26px) scale(.985)'}];
    kIn=[{opacity:0, transform:'scale(1.035)'},{opacity:1, transform:'none'}];
    oIn={...oIn, delay:40};
  } else {                                     // 前进：下层后退，新纸页自下浮起
    kOut=[{opacity:1, transform:'none'},{opacity:0, transform:'scale(.96)'}];
    kIn=[{opacity:0, transform:'translateY(30px) scale(.985)'},{opacity:1, transform:'none'}];
  }
  if(from){
    from.classList.add('leaving');
    from.style.zIndex = back ? 2 : 0;
    const pOut=panelOf(from);
    pOut.style.transformOrigin = prev==='home' ? 'left center' : '';
    const a=pOut.animate(kOut, oOut);
    a.onfinish=()=>{ from.classList.remove('leaving'); from.style.zIndex=''; pOut.style.transformOrigin=''; a.cancel(); };
  }
  pIn.style.transformOrigin = id==='home' && prev==='game' ? 'left center' : '';
  pIn.animate(kIn, oIn).onfinish=()=>{ pIn.style.transformOrigin=''; };
  // 内容依次浮现
  const d=oIn.delay+120;
  if(id==='home' && !from) stagger($$('.cover-frame > *'), {delay:d+80, step:70, y:8, dur:700});
  else if(id==='home') stagger($$('.cover-actions > *'), {delay:d, step:45, y:8});
  if(id==='toc') stagger($('#tocList').children, {delay:d, step:28, max:16});
  if(id==='daily') stagger($$('.daily-body > *'), {delay:d, step:60});
  if(id==='dict') stagger([$('.dict-search'), ...$('#dictList').children], {delay:d, step:22, max:18, y:6});
  if(id==='editor') stagger($$('.ed-col'), {delay:d, step:90, y:12});
}
function updateInk(bump){
  $$('.ink-val').forEach(e=>e.textContent=save.coins);
  if(bump) $$('.ink-count').forEach(e=>{e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump');});
}
let toastT;
function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),1600);
}
/* 弹窗：打开时遮罩淡入、卡片浮起；已打开时换内容做轻微交叉淡化；关闭时卡片下沉淡出 */
let modalClosing=null;
function modal({title, body, buttons=[], dismiss=true}){
  const m=$('#modal'), card=m.firstElementChild;
  const swap = !m.hidden;               // 已打开（或正在关闭）时直接换内容
  if(modalClosing){ modalClosing.forEach(a=>a.cancel()); modalClosing=null; }
  $('#mTitle').textContent=title;
  const b=$('#mBody'); b.innerHTML=''; if(typeof body==='string') b.innerHTML=body; else if(body) b.appendChild(body);
  const bt=$('#mBtns'); bt.innerHTML='';
  buttons.forEach(o=>{
    const x=document.createElement('button'); x.className='plate'+(o.primary?' primary':''); x.textContent=o.label;
    x.onclick=()=>{ closeModal(); o.onClick&&o.onClick(); }; bt.appendChild(x);
  });
  m.hidden=false;
  m.onclick = e => { if(dismiss && e.target===m) closeModal(); };
  if(calm() || !card.animate) return;
  if(swap){
    card.animate([{opacity:.4, transform:'scale(.985)'},{opacity:1, transform:'none'}], {duration:360, easing:EASE_OUT});
    stagger(card.children, {delay:0, step:40, y:5, dur:380});
  } else {
    m.animate([{opacity:0},{opacity:1}], {duration:280, easing:'ease-out'});
    card.animate([{opacity:0, transform:'translateY(22px) scale(.96) rotate(-.6deg)'},{opacity:1, transform:'none'}], {duration:520, easing:EASE_OUT});
    stagger(card.children, {delay:90, step:50, y:6, dur:460});
  }
}
function closeModal(){
  const m=$('#modal'), card=m.firstElementChild;
  if(m.hidden || modalClosing) return;
  if(calm() || !card.animate){ m.hidden=true; return; }
  const o={duration:240, easing:EASE_IN, fill:'forwards'};
  const a=[m.animate([{opacity:1},{opacity:0}], {...o, duration:280}),
           card.animate([{opacity:1, transform:'none'},{opacity:0, transform:'translateY(12px) scale(.97)'}], o)];
  modalClosing=a;
  a[0].onfinish=()=>{ if(modalClosing!==a) return; modalClosing=null; m.hidden=true; a.forEach(x=>x.cancel()); };
}

/* ================= 封面 ================= */
function campaignIdx(){ return Math.min(save.level, LEVELS.length-1); }
function renderHome(){
  const i = save.cur && save.cur.mode==='c' ? save.cur.idx : campaignIdx();
  $('#contSub').textContent = t('cont.sub', BOOKS.length>1 ? bookName(book) : '', bookSub(book), Math.floor(i/CHAPTER_SIZE), i+1);
  $('#coverTag').textContent = SET==='ref' ? t('cover.tagRef') : t('cover.tag');
  // 实景皮肤封面：章节号 / 本章进度
  const pad=n=>String(n).padStart(2,'0'), inCh=i%CHAPTER_SIZE+1;
  $('#phChap').textContent=pad(Math.floor(i/CHAPTER_SIZE)+1);
  $('#phCount').textContent=$('#phBarN').textContent=`${inCh} / ${CHAPTER_SIZE}`;
  $('#phBar').style.width=(inCh/CHAPTER_SIZE*100)+'%';
  $$('#home .phLvl').forEach(e=>e.textContent=pad(i+1));
}

/* ================= 目录 ================= */
let tocOpen = -1;
function chapterTitle(k){ return t('chapter', k); }
function renderToc(anim={}){
  const list=$('#tocList'), keep=list.scrollTop; list.innerHTML='';
  const nCh=Math.ceil(LEVELS.length/CHAPTER_SIZE);
  const curCh=Math.floor(campaignIdx()/CHAPTER_SIZE);
  if(tocOpen<0) tocOpen=curCh;
  const frag=document.createDocumentFragment();
  if(BOOKS.length>1){
    const shelf=document.createElement('div'); shelf.className='shelf';
    BOOKS.forEach((bk,b)=>{
      const n=bk.levels.length, done=Math.min(n, bookProgress(b));
      const bar=(bk.mix||[]).map((x,t)=>x?`<i class="t${t+1}" style="flex:${x}" title="${tierName(t+1)} ${x}%"></i>`:'').join('');
      const el=document.createElement('button');
      el.className='vol'+(b===book?' on':'');
      el.innerHTML=`<b>${bookName(b)}</b><span>${bookSub(b)}</span><em class="mixbar">${bar}</em><small>${done} / ${n}</small>`;
      el.onclick=()=>{ if(b===book) return; switchBook(b); tocOpen=-1; renderToc({book:true}); };
      shelf.appendChild(el);
    });
    frag.appendChild(shelf);
    const legend=document.createElement('div'); legend.className='mix-legend';
    legend.innerHTML=[1,2,3,4,5].map(k=>`<span><i class="t${k}"></i>${tierName(k)}</span>`).join('');
    frag.appendChild(legend);
  }
  for(let k=0;k<nCh;k++){
    const first=k*CHAPTER_SIZE, last=Math.min(LEVELS.length,first+CHAPTER_SIZE)-1;
    const locked = first>save.level;
    const doneN = Math.max(0, Math.min(save.level, last+1)-first);
    const row=document.createElement('button');
    row.className='chap-row'+(locked?' locked':'');
    row.innerHTML=`<span class="cn">${chapterTitle(k)}</span><span class="ct">${chapterName(k)}</span><span class="dots"></span><span class="cp">${first+1}</span><span class="cs">${locked?'<svg><use href="#i-lock"/></svg>':doneN+'/'+(last-first+1)}</span>`;
    row.onclick=()=>{
      if(locked){ toast(t('toc.locked')); return; }
      const cur=list.querySelector('.chap-pages');
      if(tocOpen===k){ tocOpen=-2; if(cur){ row.classList.remove('open'); slide(cur, false, ()=>cur.remove()); } return; }
      // 旧章节收起与新章节展开同时进行
      tocOpen=k; renderToc({open:k, old:cur});
    };
    frag.appendChild(row);
    if(k===tocOpen && !locked){
      row.classList.add('open');
      const pg=document.createElement('div'); pg.className='chap-pages'; pg.dataset.ch=k;
      for(let i=first;i<=last;i++){
        const b=document.createElement('button');
        const st = i<save.level?'done':(i===save.level?'cur':'lock');
        b.className='pg '+st; b.textContent=i+1;
        if(st!=='lock') b.onclick=()=>startLevel('c',i);
        pg.appendChild(b);
      }
      frag.appendChild(pg);
    }
  }
  list.appendChild(frag);
  const open=list.querySelector('.chap-pages');
  if(anim.open!=null || anim.book){
    list.scrollTop=keep;
    if(anim.book) stagger(list.querySelectorAll('.chap-row, .chap-pages'), {delay:0, step:26, max:12, y:6, dur:440});
    else if(open){
      // 旧章节的页码仍在收起：用克隆占位，避免列表跳动
      const rows=[...list.querySelectorAll('.chap-row')], old=anim.old, ok=old?+old.dataset.ch:-1;
      if(old && rows[ok]){ old.style.pointerEvents='none'; rows[ok].after(old); list.scrollTop=keep; slide(old, false, ()=>old.remove()); }
      slide(open, true);
      stagger(open.children, {delay:80, step:14, max:30, y:6, dur:380});
      setTimeout(()=>{ const r=open.getBoundingClientRect(), lr=list.getBoundingClientRect();
        if(r.bottom>lr.bottom || r.top<lr.top) open.previousElementSibling.scrollIntoView({block:'nearest', behavior:'smooth'}); }, 320);
    }
  }
  else if(open && tocOpen>0) open.previousElementSibling.scrollIntoView({block:'center'});
}

/* ================= 每日一页 ================= */
function dailyStreak(){
  let d=new Date(), n=0;
  if(!save.daily[todayKey(d)]) d.setDate(d.getDate()-1);
  while(save.daily[todayKey(d)]){ n++; d.setDate(d.getDate()-1); }
  return n;
}
function renderDaily(){
  const d=new Date();
  $('#dMonth').textContent=t('daily.month', d);
  $('#dDay').textContent=d.getDate();
  $('#dWeek').textContent=t('daily.week', d);
  $('#dStreak').textContent=dailyStreak();
  $('#dTotal').textContent=Object.keys(save.daily).length;
  const strip=$('#dWeekStrip'); strip.innerHTML='';
  const mon=new Date(d); mon.setDate(d.getDate()-((d.getDay()+6)%7));
  for(let i=0;i<7;i++){
    const x=new Date(mon); x.setDate(mon.getDate()+i);
    const k=todayKey(x);
    const el=document.createElement('div');
    el.className=(save.daily[k]?'done ':'')+(k===todayKey(d)?'today':'');
    el.innerHTML=`${t('daily.strip')[i]}<i>${save.daily[k]?'✓':x.getDate()}</i>`;
    strip.appendChild(el);
  }
  const done=!!save.daily[todayKey(d)];
  $('#btnDailyPlay').textContent = done ? t('daily.replay') : t('daily.play');
}

/* ================= 词典 ================= */
function renderDict(){
  const q=($('#dictQ').value||'').trim().toUpperCase();
  const all=Object.keys(save.words).sort();
  $('#dictCount').textContent=t('dict.count', all.length);
  const list=$('#dictList'); list.innerHTML='';
  const ws = q ? all.filter(w=>w.includes(q)) : all;
  if(!ws.length){
    list.innerHTML=`<div class="d-empty">${all.length?t('dict.noMatch'):t('dict.empty')}</div>`;
    return;
  }
  let html='', cur='';
  ws.slice(0,600).forEach(w=>{
    if(w[0]!==cur){ cur=w[0]; html+=`<div class="d-letter">${cur}</div>`; }
    const d=DEFS[w]||ZH_DEFS[w];
    const sense = d ? d.slice(0,2).map(s=>`<i>${POS[s[0]]||''}</i><span>${esc(s[1])}</span>`).join(t('def.sep')) : `<span style="opacity:.6">${t('def.none')}</span>`;
    html+=`<div class="d-entry"><b>${w.toLowerCase()}</b>${sense}</div>`;
  });
  if(ws.length>600) html+=`<div class="d-empty">${t('dict.more', ws.length-600)}</div>`;
  list.innerHTML=html;
}
function esc(s){ return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

/* ================= 关卡模型 ================= */
let L = null;   // 当前关卡（静态）
let P = null;   // 当前进度（动态）
let mode = 'c', idx = 0, dailyKey = '';

function parseLevel(d){
  const rows=d.g.split(','), H=rows.length, W=rows[0].length;
  const words=d.t.split(' ');
  return {
    id:d.id, rows, H, W, N:H*W, letters:rows.join(''),
    words, types: d.ty ? d.ty.split('').map(Number) : words.map(()=>0),
    tiers: d.lv ? d.lv.split('').map(Number) : words.map(w=>TIER[w]||0),
    extras: d.e ? d.e.split(' ') : [],
    counts0: d.n.split('').map(ch=>parseInt(ch,36)),
    curtains: (d.o||[]).map(([req,cells])=>({req,cells})),
  };
}
function freshPlay(){
  return {counts:L.counts0.slice(), found:L.words.map(()=>false), order:[], extras:[], rev:L.words.map(()=>[]), mistakes:0, hist:[], done:false};
}
const nFound = () => P.order.length;
function closedSet(foundN){
  const s=new Set();
  L.curtains.forEach(c=>{ if(foundN<c.req) c.cells.forEach(x=>s.add(x)); });
  return s;
}
function usable(i){ return P.counts[i]>0 && !closedSet(nFound()).has(i); }
function adj(a,b){
  const ar=Math.floor(a/L.W), ac=a%L.W, br=Math.floor(b/L.W), bc=b%L.W;
  return Math.abs(ar-br)+Math.abs(ac-bc)===1;
}

/* 寻找某个单词在可用字砖上的所有路径 */
function pathsFor(word, avail, limit=400){
  const {W,H,letters}=L, res=[], used=new Uint8Array(L.N);
  const path=[];
  function dfs(i,k){
    if(res.length>=limit) return;
    if(!avail[i] || used[i] || letters[i]!==word[k]) return;
    used[i]=1; path.push(i);
    if(k===word.length-1) res.push(path.slice());
    else{
      const r=Math.floor(i/W), c=i%W;
      if(r>0) dfs(i-W,k+1);
      if(r<H-1) dfs(i+W,k+1);
      if(c>0) dfs(i-1,k+1);
      if(c<W-1) dfs(i+1,k+1);
    }
    used[i]=0; path.pop();
  }
  for(let i=0;i<L.N;i++) dfs(i,0);
  return res;
}

/* 求解剩余单词：返回步骤序列；null 表示无解；'?' 表示超出预算 */
function solve(counts=P.counts, found=P.found, foundN=nFound()){
  const remaining=[]; found.forEach((f,i)=>{ if(!f) remaining.push(i); });
  const cnt=counts.slice(), failed=new Set();
  let budget=60000;
  function rec(rem, foundN){
    if(!rem.length) return [];
    const key=cnt.join('')+'|'+rem.join(',');
    if(failed.has(key)) return null;
    if(--budget<0) throw 0;
    const closed=closedSet(foundN);
    const avail=cnt.map((c,i)=>c>0 && !closed.has(i));
    let opts=rem.map(w=>({w, ps:pathsFor(L.words[w], avail)}));
    if(closed.size===0){
      if(opts.some(o=>!o.ps.length)){ failed.add(key); return null; }
      opts.sort((a,b)=>a.ps.length-b.ps.length); opts=[opts[0]];
    } else opts=opts.filter(o=>o.ps.length).sort((a,b)=>a.ps.length-b.ps.length);
    for(const o of opts){
      const seen=new Set();
      for(const p of o.ps){
        const sig=p.slice().sort((a,b)=>a-b).join(',');   // 同样的格子集合效果相同
        if(seen.has(sig)) continue; seen.add(sig);
        p.forEach(i=>cnt[i]--);
        const r=rec(rem.filter(x=>x!==o.w), foundN+1);
        p.forEach(i=>cnt[i]++);
        if(r) return [{w:o.w,p}, ...r];
      }
    }
    failed.add(key); return null;
  }
  try{ return rec(remaining, foundN); }catch(e){ return '?'; }
}

/* ================= 开始关卡 ================= */
let customLevel = null;   // 编辑器试玩的关卡
function levelData(m,i){ return m==='e' ? customLevel : (m==='d' ? DAILY[i] : LEVELS[i]); }
function dailyIndex(){ return (dayOfYear()-1) % DAILY.length; }

function startLevel(m, i, opts={}){
  const go = () => {
    if(screen!=='game') show('game');
    loadLevel(m, i);
  };
  if(screen==='game' && opts.turn) pageTurn(()=>loadLevel(m,i));
  else go();
}
function loadLevel(m, i){
  mode=m; idx=i; dailyKey = m==='d' ? todayKey() : '';
  L = parseLevel(levelData(m,i));
  const c=save.cur;
  if(m!=='e' && c && c.mode===m && c.idx===i && c.id===L.id && (m!=='d' || c.key===dailyKey) && !c.play.done){
    P = Object.assign(freshPlay(), c.play);
  } else {
    P = freshPlay();
  }
  if(m!=='e'){ save.cur = {mode:m, idx:i, id:L.id, key:dailyKey, play:P}; persist(); }
  renderGame();
}

/* ================= 渲染游戏页 ================= */
function renderGame(){
  closeModal();
  const ch=Math.floor(idx/CHAPTER_SIZE);
  if(mode==='e'){
    $('#chapTitle').textContent=t('game.editTitle');
    $('#lvlTitle').textContent=customLevel.name ? t('game.customName', customLevel.name) : t('game.custom');
    $('#folioL').textContent='— ✎ —'; $('#folioR').textContent='— ✎ —';
  } else if(mode==='d'){
    const d=new Date();
    $('#chapTitle').textContent=t('daily.chap', d);
    $('#lvlTitle').textContent=t('daily.lvl');
    $('#folioL').textContent='— ✦ —'; $('#folioR').textContent='— '+d.getDate()+' —';
  } else {
    $('#chapTitle').textContent=`${BOOKS.length>1 ? bookName(book)+' · ' : ''}${chapterTitle(ch)} · ${chapterName(ch)}`;
    $('#lvlTitle').textContent=t('page', idx+1);
    $('#folioL').textContent=`— ${idx*2+2} —`; $('#folioR').textContent=`— ${idx*2+3} —`;
  }
  $$('#game .phLvl').forEach(e=>e.textContent=mode==='c' ? String(idx+1).padStart(2,'0') : (mode==='d' ? t('daily.lvl') : '✎'));
  $('#footnote').innerHTML=''; $('#footnote').classList.remove('show');
  $('#curWord').textContent=''; $('#curWord').className='cur-word';
  $$('.done-card').forEach(e=>e.remove());
  renderWords();
  buildGrid();
  updateTools();
  updateInk();
  showTipIfAny();
  if(P.done) showDone(true);
}

function renderWords(){
  const box=$('#words'); box.innerHTML='';
  const narrow=matchMedia('(max-width:820px)').matches;
  const maxLen=Math.max(...L.words.map(w=>w.length));
  let lw = L.words.length>10 ? 22 : (L.words.length>6 ? 26 : 32);
  if(narrow) lw = L.words.length>10 ? 17 : (maxLen>7 ? 18 : (L.words.length>6 ? 21 : 25));
  box.style.setProperty('--lw', lw+'px');
  L.words.forEach((w,i)=>{
    const el=document.createElement('div');
    el.className='w'+(P.found[i]?' found':''); el.dataset.i=i;
    let h='';
    for(let k=0;k<w.length;k++){
      const rev=P.rev[i].includes(k);
      h+=`<span class="lt${rev?' rev':''}" style="animation-delay:${k*45}ms">${(P.found[i]||rev)?w[k]:''}</span>`;
    }
    if(L.tiers[i]>=4) h+=`<span class="mark t${L.tiers[i]}" title="${tierName(L.tiers[i])}">${L.tiers[i]===5?'◆':'◇'}</span>`;
    else if(L.types[i]===2) h+=`<span class="mark hard" title="${t('mark.hard')}">★</span>`;
    else if(L.types[i]===1) h+=`<span class="mark" title="${t('mark.rare')}">◆</span>`;
    el.innerHTML=h;
    el.onclick=()=>{ if(P.found[i]) showDef(w); };
    box.appendChild(el);
  });
  updateProg();
  renderInfo();
}
function updateProg(){ $('#listProg').textContent=`${nFound()} / ${L.words.length}`; }
function refreshWord(i, anim){
  const el=$(`#words .w[data-i="${i}"]`); if(!el) return;
  const w=L.words[i];
  el.classList.toggle('found', P.found[i]);
  el.querySelectorAll('.lt').forEach((s,k)=>{
    const rev=P.rev[i].includes(k);
    s.classList.toggle('rev', rev);
    s.textContent=(P.found[i]||rev)?w[k]:'';
    if(anim){ s.style.animation='none'; void s.offsetWidth; s.style.animation=''; }
  });
  if(anim && !P.found[i]){ el.classList.remove('hinted'); void el.offsetWidth; el.classList.add('hinted'); }
}
function defHTML(w){
  const d=DEFS[w]||ZH_DEFS[w];
  const sense = d ? d.slice(0,2).map(s=>`<i>${POS[s[0]]||''}</i><span>${esc(s[1])}</span>`).join(t('def.sep')) : `<span style="opacity:.7">${t('def.noneWord')}</span>`;
  return `<b>${w.toLowerCase()}</b>${TIER[w]?`<em class="tier t${TIER[w]}">${tierName(TIER[w])}</em>`:''}${sense}`;
}
function showDef(w){
  const f=$('#footnote');
  f.innerHTML=defHTML(w);
  f.classList.add('show');
  f.classList.remove('swap'); void f.offsetWidth; f.classList.add('swap');
}

/* ---------- 本页信息 ---------- */
/* 用求解器得到一组与使用次数一致的路径，统计：倒序 / 直线 / 一拐 / 多拐 */
function levelStats(){
  if(L.stats) return L.stats;
  const sol=solve(L.counts0, L.words.map(()=>false), 0);
  const st={extras:L.extras.length, words:L.words.length, rev:0, straight:0, oneTurn:0, multiTurn:0, multi:[0,0,0,0,0,0], tiers:[0,0,0,0,0,0], ok:Array.isArray(sol)};
  L.counts0.forEach(c=>{ if(c>=2) st.multi[Math.min(c,5)]++; });
  L.tiers.forEach(t=>st.tiers[t||0]++);
  if(st.ok) sol.forEach(({p})=>{
    const a=p[0], b=p[p.length-1], ar=Math.floor(a/L.W), ac=a%L.W, br=Math.floor(b/L.W), bc=b%L.W;
    // 起点在终点左侧为正序；同一列时自上而下为正序
    if(ac>bc || (ac===bc && ar>br)) st.rev++;
    let turns=0;
    for(let k=2;k<p.length;k++) if(p[k]-p[k-1]!==p[k-1]-p[k-2]) turns++;
    if(turns===0) st.straight++; else if(turns===1) st.oneTurn++; else st.multiTurn++;
  });
  return L.stats=st;
}
function renderInfo(){
  const box=$('#info'); if(!box) return;
  const open=!!save.tips.infoOpen;
  $('#btnInfo').classList.toggle('on', open);
  box.hidden=!open;
  if(!open) return;
  const s=levelStats(), pct=n=>s.words?Math.round(100*n/s.words)+'%':'—';
  const tiers=[1,2,3,4,5].filter(k=>s.tiers[k]).map(k=>`<span class="tier t${k}">${tierName(k)} ${s.tiers[k]}</span>`).join('');
  box.innerHTML=`
    ${tiers?`<div class="info-tiers">${tiers}</div>`:''}
    <dl>
      <dt>${t('info.extras')}</dt><dd>${s.extras}</dd>
      <dt>${t('info.rev')}</dt><dd>${s.ok?t('info.pct', s.rev, s.words, pct(s.rev)):'—'}</dd>
      <dt>${t('info.multi')}</dt><dd>${t('info.multiVal', s.multi)}</dd>
      <dt>${t('info.straight')}</dt><dd>${s.ok?s.straight:'—'}</dd>
      <dt>${t('info.oneTurn')}</dt><dd>${s.ok?s.oneTurn:'—'}</dd>
      <dt>${t('info.multiTurn')}</dt><dd>${s.ok?s.multiTurn:'—'}</dd>
    </dl>`;
}

/* ---------- 字砖 ---------- */
let tiles=[];
function buildGrid(){
  const g=$('#grid'); g.innerHTML='';
  g.style.setProperty('--cols', L.W);
  tiles=[];
  for(let i=0;i<L.N;i++){
    const t=document.createElement('div');
    t.className='tile'; t.dataset.i=i;
    t.innerHTML=`<span class="ch">${L.letters[i]}</span><span class="cnt"></span>`;
    g.appendChild(t); tiles.push(t);
  }
  L.curtains.forEach((c,ci)=>{
    const first=Math.min(...c.cells);
    const n=document.createElement('div'); n.className='curt-num'; n.dataset.c=ci; n.innerHTML='<b></b>';
    tiles[first].appendChild(n);
  });
  sizeGrid();
  refreshTiles();
}
function sizeGrid(){
  if(!L) return;
  const wrap=$('#gridWrap'), narrow=matchMedia('(max-width:820px)').matches;
  const gap = narrow ? 8 : 10;
  const aw=wrap.clientWidth-8, ah=wrap.clientHeight-8;
  let t=Math.min(narrow?78:92, (aw-gap*(L.W-1))/L.W);
  if(ah>40) t=Math.min(t,(ah-gap*(L.H-1))/L.H);
  t=Math.max(40,Math.floor(t));
  const g=$('#grid'); g.style.setProperty('--tile',t+'px'); g.style.setProperty('--gap',gap+'px');
  wrap.style.setProperty('--tile',t+'px');
}
function refreshTiles(changed=[], opened=[]){
  const closed=closedSet(nFound());
  tiles.forEach((t,i)=>{
    const c=P.counts[i];
    t.classList.toggle('curt', closed.has(i));
    t.classList.toggle('spent', c<=0);
    t.querySelector('.cnt').textContent = c>0 ? c : '';
  });
  changed.forEach(i=>{ const t=tiles[i]; t.classList.remove('cntdown','pop'); void t.offsetWidth; t.classList.add(P.counts[i]>0?'cntdown':'pop'); });
  opened.forEach(i=>{ const t=tiles[i]; t.classList.add('opening'); setTimeout(()=>t.classList.remove('opening'),800); });
  $$('.curt-num').forEach(n=>{
    const c=L.curtains[+n.dataset.c], left=c.req-nFound();
    n.hidden = left<=0; n.querySelector('b').textContent=left;
  });
}

/* ---------- 输入：滑动 ---------- */
let path=[], dragging=false, pid=null;
const gridWrap=$('#gridWrap');
function cellAt(x,y,strict){
  const g=$('#grid').getBoundingClientRect();
  const st=getComputedStyle($('#grid'));
  const t=parseFloat(st.getPropertyValue('--tile')), gap=parseFloat(st.getPropertyValue('--gap'));
  const rx=x-g.left, ry=y-g.top;
  const c=Math.floor(rx/(t+gap)), r=Math.floor(ry/(t+gap));
  if(c<0||r<0||c>=L.W||r>=L.H) return -1;
  const cx=c*(t+gap)+t/2, cy=r*(t+gap)+t/2;
  if(strict){ if(Math.hypot(rx-cx, ry-cy) > t*.48) return -1; }
  else if(rx-c*(t+gap)>t || ry-r*(t+gap)>t) return -1;
  return r*L.W+c;
}
gridWrap.addEventListener('pointerdown', e=>{
  if(!L || P.done || dragging) return;
  const i=cellAt(e.clientX,e.clientY,false);
  if(i<0 || !usable(i)) return;
  ac();
  dragging=true; pid=e.pointerId;
  try{ gridWrap.setPointerCapture(pid); }catch(_){}
  path=[i];
  $('#curWord').className='cur-word';
  sfx.tick(0); updatePath();
  e.preventDefault();
});
gridWrap.addEventListener('pointermove', e=>{
  if(!dragging || e.pointerId!==pid) return;
  const i=cellAt(e.clientX,e.clientY,true);
  if(i>=0 && i!==path[path.length-1]){
    if(path.length>1 && i===path[path.length-2]){ path.pop(); sfx.tick(path.length-1); }
    else if(!path.includes(i) && usable(i)){
      const last=path[path.length-1];
      if(adj(last,i)){ path.push(i); sfx.tick(path.length-1); }
      else{
        // 快速划过时补上中间那一格
        const lr=Math.floor(last/L.W), lc=last%L.W, ir=Math.floor(i/L.W), ic=i%L.W;
        if((lr===ir && Math.abs(lc-ic)===2) || (lc===ic && Math.abs(lr-ir)===2)){
          const mid=((lr+ir)/2)*L.W+(lc+ic)/2;
          if(!path.includes(mid) && usable(mid)){ path.push(mid,i); sfx.tick(path.length-1); }
        }
      }
    }
  }
  updatePath();
});
function endDrag(e){
  if(!dragging || (e && e.pointerId!==pid)) return;
  dragging=false;
  try{ gridWrap.releasePointerCapture(pid); }catch(_){}
  const p=path.slice(); path=[];
  updatePath(true);
  submit(p);
}
gridWrap.addEventListener('pointerup', endDrag);
gridWrap.addEventListener('pointercancel', endDrag);

function updatePath(keepWord){
  tiles.forEach((t,i)=>t.classList.toggle('sel', path.includes(i)));
  if(!keepWord) $('#curWord').textContent = path.map(i=>L.letters[i]).join('');
}

/* ---------- 飞字动画：先在上方展示单词，再飞向词表 / 批注 ---------- */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const SHOW_MS = 760, FLY_MS = 640, STAGGER = 55;   // 展示时长 / 飞行时长 / 字母间隔
let flyEnd=0;   // 本次动画结束的时间（毫秒）
function canFly(){ return !reduceMotion.matches && !!document.body.animate; }

/* 把单词拆成逐个字母排在「当前单词」处，返回每个字母的位置与字号 */
function showcase(word){
  const c=$('#curWord');
  c.className='cur-word'; c.style.visibility='hidden';
  c.innerHTML=[...word].map(ch=>`<span>${ch}</span>`).join('');
  const fs=parseFloat(getComputedStyle(c).fontSize);
  const rects=[...c.children].map(x=>x.getBoundingClientRect());
  c.textContent=''; c.style.visibility='';
  return {rects, fs};
}
/* 一个字母：先在原地放大「印」一下并停留，再沿弧线飞到 to */
function flyLetter(ch, from, to, fs, {delay=0, scale=.5, fade=false, cls='', done}={}){
  const d=document.createElement('span');
  d.className='fly'+(cls?' '+cls:''); d.textContent=ch;
  d.style.cssText=`left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;font-size:${fs}px`;
  document.body.appendChild(d);
  const dx=(to.left+to.width/2)-(from.left+from.width/2), dy=(to.top+to.height/2)-(from.top+from.height/2);
  const lift=Math.min(80, 24+Math.abs(dx)*.1);
  const total=SHOW_MS+FLY_MS, o=t=>t/total;
  const a=d.animate([
    {transform:'translate(0,0) scale(1)', offset:0},
    {transform:'translate(0,-6px) scale(1.32)', offset:o(SHOW_MS*.28)},
    {transform:'translate(0,0) scale(1.08)', offset:o(SHOW_MS*.55)},
    {transform:'translate(0,0) scale(1.08)', opacity:1, offset:o(SHOW_MS)},
    {transform:`translate(${dx*.45}px,${dy*.45-lift}px) scale(${(1.08+scale)/2}) rotate(-6deg)`, opacity:1, offset:o(SHOW_MS+FLY_MS*.45)},
    {transform:`translate(${dx}px,${dy}px) scale(${scale})`, opacity:fade?0:1, offset:1},
  ], {duration:total, delay, easing:'ease-in-out', fill:'both'});
  a.onfinish=()=>{ d.remove(); done&&done(); };
  return total+delay;
}
/* 目标词：展示后逐个字母落进词表空格 */
function flyToWord(ti){
  const w=L.words[ti], el=$(`#words .w[data-i="${ti}"]`);
  if(!el || !canFly()){ flashWord('ok', w); refreshWord(ti, true); return 0; }
  const {rects, fs}=showcase(w);
  el.scrollIntoView({block:'nearest'});
  const slots=[...el.querySelectorAll('.lt')];
  slots.forEach(x=>{ x.classList.remove('land'); x.classList.add('pending'); });
  let end=0;
  slots.forEach((slot,k)=>{
    const to=slot.getBoundingClientRect();
    end=Math.max(end, flyLetter(w[k], rects[k], to, fs, {delay:k*STAGGER, scale:(to.width*.82)/fs, cls:'ok',
      done:()=>{ slot.classList.remove('pending'); slot.classList.add('land'); sfx.tick(k+3); }}));
  });
  return end;
}
/* 额外单词：展示后缩小着飞进「批注」按钮 */
function flyToExtras(word){
  const bump=()=>{ const b=$('#extraBadge'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); };
  const btn=$('#btnExtras svg');
  if(!btn || !canFly()){ flashWord('extra', word); bump(); return; }
  const {rects, fs}=showcase(word);
  const to=btn.getBoundingClientRect();
  rects.forEach((r,k)=>flyLetter(word[k], r, to, fs, {delay:k*STAGGER, scale:.22, fade:true, cls:'extra',
    done: k===rects.length-1 ? bump : null}));
}

/* ---------- 判定 ---------- */
function flashWord(cls, text){
  const c=$('#curWord');
  if(text!=null) c.textContent=text;
  c.className='cur-word'; void c.offsetWidth; c.className='cur-word '+cls;
}
function submit(p){
  const cw=$('#curWord');
  if(p.length<3){ cw.textContent=''; return; }
  const s=p.map(i=>L.letters[i]).join('');
  const ti=L.words.findIndex((w,i)=>w===s && !P.found[i]);
  if(ti>=0){
    const sp=safePath(ti,p);
    if(!sp){ flashWord('dup'); toast(t('toast.later')); return; }
    acceptWord(ti,sp); return;
  }
  if(L.words.includes(s)){ flashWord('dup'); toast(t('toast.dupWord')); return; }
  if(L.extras.includes(s)){
    if(P.extras.includes(s)){ flashWord('dup'); toast(t('toast.dupExtra')); return; }
    P.extras.push(s); addToDict(s);
    save.coins+=1; updateInk(true);
    sfx.extra(); toast(t('toast.extra', s.toLowerCase()));
    flyToExtras(s);
    updateTools(); persist(); return;
  }
  P.mistakes++; flashWord('bad'); sfx.bad(); persist();
}
function addToDict(w){ if(!save.words[w]) save.words[w]=1; }

/* 玩家划出的路径若会导致死局，换成同一单词的另一条可行路径 */
function safePath(ti, p){
  const ok = q => {
    const counts=P.counts.slice(), found=P.found.slice();
    q.forEach(i=>counts[i]--); found[ti]=true;
    if(found.every(Boolean)) return true;
    const saved=P.order; P.order=saved.concat(ti);   // solve() 用 nFound() 判断幕布
    const r=solve(counts, found);
    P.order=saved;
    return r!==null;
  };
  if(ok(p)) return p;
  const closed=closedSet(nFound());
  const avail=P.counts.map((c,i)=>c>0 && !closed.has(i));
  const alt=pathsFor(L.words[ti], avail).find(q=>ok(q));
  if(alt) return alt;
  return solve()===null ? p : null;   // 本来就已无解时照常收下；否则说明现在写这个词会堵死后面的路
}
function acceptWord(ti, p){
  P.hist.push({counts:P.counts.slice(), found:P.found.slice(), order:P.order.slice()});
  if(P.hist.length>30) P.hist.shift();
  const before=closedSet(nFound());
  p.forEach(i=>P.counts[i]--);
  P.found[ti]=true; P.order.push(ti);
  addToDict(L.words[ti]);
  const after=closedSet(nFound());
  const opened=[...before].filter(i=>!after.has(i));
  refreshTiles(p, opened);
  refreshWord(ti, false); flyEnd=flyToWord(ti); updateProg();
  const w=L.words[ti];
  let label = t('expr')[Math.min(w.length,7)];
  if(L.tiers[ti]===5) label=t('label.t5'); else if(L.tiers[ti]===4) label=t('label.t4');
  else if(L.types[ti]===2) label=t('label.hard'); else if(L.types[ti]===1) label=t('label.rare');
  else if(w.length===Math.max(...L.words.map(x=>x.length)) && w.length>=6) label=t('label.longest');
  sfx.found();
  if(label) setTimeout(()=>toast(label),120);
  hideTip();
  if(opened.length){ setTimeout(()=>{ sfx.reveal(); if(!save.tips.curtOpen){ save.tips.curtOpen=1; toast(t('toast.curtain')); } },250); }
  updateTools(); persist();
  if(P.found.every(Boolean)){ P.done=true; completeLevel(); return; }
  const sol=solve();
  if(sol===null) setTimeout(failDialog, 650);
}
function failDialog(){
  modal({title:t('fail.title'), dismiss:false,
    body:`<p style="margin:0;text-align:center">${t('fail.body')}</p>`,
    buttons:[{label:t('fail.restart'), onClick:restartLevel},{label:t('fail.undo'), primary:true, onClick:undo}]});
}
function undo(){
  const h=P.hist.pop(); if(!h) return;
  const before=closedSet(nFound());
  const removed=P.order[P.order.length-1];
  P.counts=h.counts; P.found=h.found; P.order=h.order;
  refreshTiles(); if(removed!=null) refreshWord(removed); updateProg(); updateTools(); persist();
  sfx.page();
}
function restartLevel(){
  const keepExtras=P.extras;
  P=freshPlay(); P.extras=keepExtras; if(mode!=='e' && save.cur) save.cur.play=P; persist(); renderGame();
}

/* ---------- 工具：提示 / 烟花 / 批注 ---------- */
function updateTools(){
  $('#btnUndo').disabled = !P.hist.length || P.done;
  $('#extraBadge').textContent=P.extras.length;
  const hidden=hiddenLetters();
  $('#btnHint').disabled = P.done || !hidden.length;
  $('#btnFire').disabled = P.done || !hidden.length;
}
function hiddenLetters(){
  const out=[];
  L.words.forEach((w,i)=>{ if(P.found[i]) return; for(let k=0;k<w.length;k++) if(!P.rev[i].includes(k)) out.push([i,k]); });
  return out;
}
function spend(n){
  if(save.coins<n){ toast(t('toast.noInk', n)); return false; }
  save.coins-=n; updateInk(true); return true;
}
function hint(){
  if(P.done) return;
  const sol=solve();
  let step=null;
  if(Array.isArray(sol)) step=sol.find(s=>P.rev[s.w].length<L.words[s.w].length);
  if(sol===null){ failDialog(); return; }
  let w, k, cell=null;
  if(step){
    w=step.w; k=[...L.words[w]].findIndex((_,j)=>!P.rev[w].includes(j)); cell=step.p[k];
  } else {
    const h=hiddenLetters(); if(!h.length) return; [w,k]=h[0];
  }
  if(!spend(COST_HINT)) return;
  P.rev[w].push(k); refreshWord(w,true); sfx.reveal();
  if(cell!=null){ const t=tiles[cell]; t.classList.remove('hint-glow'); void t.offsetWidth; t.classList.add('hint-glow'); }
  updateTools(); persist();
}
function firework(){
  if(P.done) return;
  const h=hiddenLetters(); if(!h.length) return;
  if(!spend(COST_FIRE)) return;
  for(let i=h.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [h[i],h[j]]=[h[j],h[i]]; }
  const pickN=h.slice(0,5), touched=new Set();
  pickN.forEach(([w,k])=>{ P.rev[w].push(k); touched.add(w); });
  touched.forEach(w=>refreshWord(w,true));
  sfx.reveal(); setTimeout(sfx.reveal,140); setTimeout(sfx.reveal,280);
  toast(t('toast.fire', pickN.length));
  updateTools(); persist();
}
function showExtras(){
  const total=L.extras.length;
  const body=document.createElement('div');
  body.innerHTML = `<p style="margin:0 0 6px;text-align:center">${t('extras.found', P.extras.length, total)}</p>`+
    `<p style="margin:0 0 10px;text-align:center;font-size:13px">${t('extras.note')}</p>`;
  const l=document.createElement('div'); l.className='extra-list';
  l.innerHTML = P.extras.length ? P.extras.map(w=>`<span data-w="${w}">${w.toLowerCase()}</span>`).join('') : `<em>${t('extras.empty')}</em>`;
  body.appendChild(l);
  const f=document.createElement('div'); f.className='footnote extra-def';
  body.appendChild(f);
  l.querySelectorAll('[data-w]').forEach(el=>el.onclick=()=>{
    l.querySelectorAll('.on').forEach(x=>x.classList.remove('on')); el.classList.add('on');
    f.innerHTML=defHTML(el.dataset.w); f.classList.add('show');
  });
  modal({title:t('extras.title'), body, buttons:[{label:t('extras.close'), primary:true}]});
}

/* ---------- 教学提示 ---------- */
let tipTimer;
function showTipIfAny(){
  hideTip();
  let msg=null, key=null;
  if(mode==='c'){
    if(idx===0 && !save.tips.swipe){ key='swipe'; msg=t('tip.swipe'); }
    else if(idx===1 && !save.tips.count){ key='count'; msg=t('tip.count'); }
    else if(idx===2 && !save.tips.back){ key='back'; msg=t('tip.back'); }
    else if(idx===4 && !save.tips.hint){ key='hint'; msg=t('tip.hint'); }
  }
  if(!msg && L.curtains.length && !save.tips.curt){ key='curt'; msg=t('tip.curt'); }
  if(!msg) return;
  const tip=$('#tip'); tip.getAnimations().forEach(a=>a.cancel()); delete tip.dataset.out; tip.textContent=msg; tip.hidden=false;
  save.tips[key]=1; persist();
  clearTimeout(tipTimer); tipTimer=setTimeout(hideTip, 9000);
}
function hideTip(){
  const tip=$('#tip');
  if(tip.hidden || tip.dataset.out) return;
  if(calm() || !tip.animate){ tip.hidden=true; return; }
  tip.dataset.out=1;
  tip.animate([{opacity:1, transform:'translateX(-50%)'},{opacity:0, transform:'translateX(-50%) translateY(-6px) scale(.97)'}],
    {duration:260, easing:EASE_IN}).onfinish=()=>{ delete tip.dataset.out; tip.hidden=true; };
}

/* ---------- 完成 ---------- */
function completeLevel(){
  let reward=0, first=false;
  if(mode==='c'){
    if(idx>=save.level){ save.level=idx+1; first=true; reward=10 + (P.mistakes===0?5:0); }
    else reward=2;
  } else if(mode==='d'){
    first=!save.daily[dailyKey];
    save.daily[dailyKey]=true;
    reward = first ? 25 : 2;
  }
  P.reward=reward; P.first=first;
  save.coins+=reward;
  persist();
  setTimeout(()=>{ sfx.done(); updateInk(true); showDone(false); }, Math.max(650, flyEnd+150));
}
function showDone(restored){
  $$('.done-card').forEach(e=>e.remove());
  const card=document.createElement('div'); card.className='done-card';
  let msg;
  if(P.mistakes===0) msg=pick(t('msg.perfect'));
  else if(P.extras.length>=3) msg=fmt(pick(t('msg.bonus')), P.extras.length);
  else msg=pick(t('msg.generic'));
  if(mode==='c' && (idx+1)%CHAPTER_SIZE===0) msg=t('msg.chapter', chapterTitle(Math.floor(idx/CHAPTER_SIZE)));
  const isDaily=mode==='d', isEdit=mode==='e';
  const hasNext = !isDaily && !isEdit && idx+1<LEVELS.length;
  card.innerHTML=`
    <div class="fin">— Finis —</div>
    <div class="big">${isEdit?t('done.edit'):(isDaily?t('done.daily'):t('page', idx+1))}</div>
    <div class="orn"><svg class="fleuron" aria-hidden="true"><use href="#fleuron"/></svg></div>
    <p class="msg">${msg}</p>
    <div class="stats">
      <div><b>${L.words.length}</b>${t('done.words')}</div>
      <div><b>${P.extras.length}</b>${t('done.extras')}</div>
      <div><b>+${P.reward||0}</b>${t('done.ink')}</div>
    </div>
    <div class="seal">${P.mistakes===0?t('done.perfect'):t('done.read')}</div>
    <button class="plate primary" id="btnNext">${isEdit?t('done.backEditor'):(isDaily?t('done.closeDiary'):(hasNext?t('done.next'):t('done.toc')))}</button>`;
  $('#pageR').appendChild(card);
  if(!restored) stagger([...card.children].filter(n=>!n.classList.contains('seal')), {delay:180, step:80, y:10, dur:620});
  updateTools();
  card.querySelector('#btnNext').onclick=()=>{
    if(isEdit){ show('editor'); return; }
    if(isDaily){ save.cur=null; persist(); show('daily'); return; }
    if(hasNext){ startLevel('c', idx+1, {turn:true}); }
    else { save.cur=null; persist(); show('toc'); }
  };
}

/* ---------- 翻页动画 ---------- */
function stripIds(n){ n.removeAttribute('id'); n.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id')); return n; }
function pageTurn(renderNew){
  const book=$('#book');
  const wide=matchMedia('(min-width:821px)').matches;
  sfx.page();
  if(!book.animate){ renderNew(); return; }
  const cleanup=[];
  if(wide){
    const oldL=stripIds($('#pageL').cloneNode(true)), oldR=stripIds($('#pageR').cloneNode(true));
    renderNew();
    const newL=stripIds($('#pageL').cloneNode(true));
    const under=document.createElement('div'); under.className='under'; under.style.left='0'; under.style.width='50%';
    under.appendChild(oldL); book.appendChild(under);
    const sheet=document.createElement('div'); sheet.className='flip-sheet'; sheet.style.left='50%'; sheet.style.width='50%';
    const front=document.createElement('div'); front.className='face front'; front.appendChild(oldR);
    const back=document.createElement('div'); back.className='face back'; back.appendChild(newL);
    const shF=document.createElement('div'); shF.className='flip-shade'; front.appendChild(shF);
    const shB=document.createElement('div'); shB.className='flip-shade'; back.appendChild(shB);
    sheet.append(front,back); book.appendChild(sheet);
    cleanup.push(under,sheet);
    const dur=950, ease='cubic-bezier(.5,.08,.25,1)';
    const anim=sheet.animate([{transform:'rotateY(0deg)'},{transform:'rotateY(-180deg)'}],{duration:dur,easing:ease,fill:'forwards'});
    shF.animate([{background:'linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,0))'},{background:'linear-gradient(90deg,rgba(60,40,15,.05),rgba(60,40,15,.35))'}],{duration:dur/2,easing:ease,fill:'forwards'});
    shB.animate([{opacity:1,background:'linear-gradient(270deg,rgba(60,40,15,.35),rgba(60,40,15,0))'},{opacity:0}],{duration:dur,easing:ease,fill:'forwards'});
    anim.onfinish=()=>cleanup.forEach(n=>n.remove());
  } else {
    const old=stripIds(book.cloneNode(true));
    old.style.cssText='width:100%;height:100%;position:absolute;inset:0';
    renderNew();
    const sheet=document.createElement('div'); sheet.className='flip-sheet'; sheet.style.left='0'; sheet.style.width='100%';
    const front=document.createElement('div'); front.className='face front'; front.appendChild(old);
    const back=document.createElement('div'); back.className='face back paper';
    sheet.append(front,back); book.appendChild(sheet);
    const anim=sheet.animate([{transform:'rotateY(0deg)',opacity:1},{transform:'rotateY(-110deg)',opacity:1,offset:.8},{transform:'rotateY(-130deg)',opacity:0}],{duration:800,easing:'cubic-bezier(.45,.05,.3,1)',fill:'forwards'});
    anim.onfinish=()=>sheet.remove();
  }
}

/* ================= 事件绑定 ================= */
$('#btnContinue').onclick=()=>{
  const c=save.cur;
  if(c && c.mode==='c') startLevel('c', c.idx); else startLevel('c', campaignIdx());
};
$('#btnToc').onclick=()=>{ tocOpen=-1; show('toc'); };
$('#btnDaily').onclick=()=>show('daily');
$('#btnDict').onclick=()=>{ $('#dictQ').value=''; show('dict'); };
$('#btnDailyPlay').onclick=()=>startLevel('d', dailyIndex());
$$('[data-back]').forEach(b=>b.onclick=()=>show('home'));
$('#btnMenu').onclick=()=>{
  if(mode==='e') show('editor'); else if(mode==='d') show('daily'); else { tocOpen=-1; show('toc'); }
};
$('#btnUndo').onclick=undo;
$('#btnHint').onclick=hint;
$('#btnFire').onclick=firework;
$('#btnExtras').onclick=showExtras;
$('#btnInfo').onclick=()=>{
  save.tips.infoOpen=!save.tips.infoOpen; persist();
  const box=$('#info');
  if(save.tips.infoOpen){ renderInfo(); slide(box, true); stagger(box.children, {delay:60, step:40, y:4, dur:360}); }
  else { $('#btnInfo').classList.remove('on'); slide(box, false, ()=>{ if(!save.tips.infoOpen) box.hidden=true; }); }
};
$('#dictQ').addEventListener('input', renderDict);
function openSettings(){
  const body=document.createElement('div');
  const curSkin=document.documentElement.getAttribute('data-skin')||'book';
  body.innerHTML=`<div class="set-row"><span>${t('set.lang')}</span><span class="seg">${I18N.LANGS.map(l=>`<button data-lang="${l}" class="${l===I18N.lang?'on':''}">${I18N.name(l)}</button>`).join('')}</span></div>
    <div class="set-row" style="border:0;padding-bottom:2px"><span>${t('set.skin')}</span></div>
    <div class="skins">${(window.SKINS||[]).map(k=>`<button class="skin-opt${k.id===curSkin?' on':''}" data-skin="${k.id}"><i class="${k.id}">${k.icon}</i>${t('skin.'+k.id)}</button>`).join('')}</div>
    <div class="set-row"><span>${t('set.sound')}</span><button class="switch${save.sound?' on':''}" id="swSound" aria-label="${t('set.sound')}"></button></div>
    ${HAS_REF?`<div class="set-row"><span>${t('set.source')}</span><span class="seg"><button data-set="orig" class="${SET==='orig'?'on':''}">${t('set.orig')}</button><button data-set="ref" class="${SET==='ref'?'on':''}">${t('set.ref')}</button></span></div>`:''}
    <div class="set-row"><span>${t('set.read')}</span><b style="font-family:var(--serif-en)">${BOOKS.reduce((a,_,b)=>a+Math.min(bookProgress(b),BOOKS[b].levels.length),0)} / ${BOOKS.reduce((a,b)=>a+b.levels.length,0)}</b></div>
    <div class="set-row"><span>${t('set.dict')}</span><b style="font-family:var(--serif-en)">${Object.keys(save.words).length}</b></div>
    <div style="text-align:center;margin-top:16px"><button class="text-btn" id="btnReset">${t('set.reset')}</button></div>`;
  modal({title:t('set.title'), body, buttons:[{label:t('set.done'), primary:true}]});
  body.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{
    if(b.dataset.lang===I18N.lang) return;
    I18N.set(b.dataset.lang);
    relang();
    openSettings();
  });
  body.querySelectorAll('[data-skin]').forEach(b=>b.onclick=()=>{
    window.applySkin(b.dataset.skin);
    body.querySelectorAll('.skin-opt').forEach(x=>x.classList.toggle('on', x===b));
    if(screen==='game') setTimeout(sizeGrid, 50);
  });
  body.querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>{
    if(b.dataset.set===SET) return;
    persist();
    try{ localStorage.setItem('wordpages.set', b.dataset.set); }catch(e){}
    location.reload();
  });
  body.querySelector('#swSound').onclick=e=>{ save.sound=!save.sound; e.currentTarget.classList.toggle('on',save.sound); persist(); };
  body.querySelector('#btnReset').onclick=()=>{
    modal({title:t('reset.title'), body:`<p style="text-align:center;margin:0">${t('reset.body')}</p>`,
      buttons:[{label:t('cancel')},{label:t('reset.ok'), primary:true, onClick:()=>{ save=JSON.parse(JSON.stringify(DEFAULT_SAVE)); persist(); show('home'); toast(t('reset.toast')); }}]});
  };
}
/* 切换语言后重绘当前屏幕的动态文案（静态文案由 I18N.apply 处理） */
function relang(){
  if(screen==='game' && L) renderGame();
  else show(screen);
}
$('#btnSettings').onclick=openSettings;
$('#phSet').onclick=openSettings;
$('#phDaily').onclick=()=>$('#btnDaily').click();
$('#phDict').onclick=()=>$('#btnDict').click();
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ if(!$('#modal').hidden) closeModal(); else if(screen!=='home' && screen!=='game') show('home'); }
  if(screen==='game' && (e.ctrlKey||e.metaKey) && e.key==='z'){ e.preventDefault(); undo(); }
  // 大厅按空格打开关卡编辑器
  if(screen==='home' && $('#modal').hidden && (e.code==='Space' || e.key===' ') && !/^(INPUT|TEXTAREA|BUTTON)$/.test(document.activeElement.tagName)){
    e.preventDefault(); show('editor');
  }
});
if(window.ResizeObserver) new ResizeObserver(()=>{ if(screen==='game') sizeGrid(); }).observe(gridWrap);
window.addEventListener('resize', ()=>{ if(screen==='game' && L){ sizeGrid(); renderWords(); } });

/* 返回主页时保存 */
window.addEventListener('beforeunload', persist);
/* 触屏没有空格键：长按封面标题同样可以打开编辑器 */
(()=>{
  let t=null;
  const title=$('.cover-title');
  title.addEventListener('pointerdown', ()=>{ t=setTimeout(()=>{ t=null; show('editor'); }, 700); });
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>title.addEventListener(ev, ()=>{ if(t){ clearTimeout(t); t=null; } }));
})();

/* 提供给关卡编辑器（editor.js）使用的接口 */
window.WP = {
  show, toast, modal,
  playCustom(level){ customLevel=level; startLevel('e', 0); },
};
show('home');
})();
