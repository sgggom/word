const MOUNTAIN_DAY = 86400000;
const MOUNTAIN_ROUTES = {
  7: [[265,1379],[370,1344],[554,1269],[715,1196],[595,1194],[440,1081],[600,996],[527,946]],
  10: [[265,1379],[336,1359],[471,1316],[605,1243],[715,1196],[649,1201],[529,1170],[440,1081],[507,1076],[600,996],[527,946]],
};
const MOUNTAIN_MILESTONES = { 7: [3, 5, 6], 10: [4, 7, 9] };
const MOUNTAIN_TOOLS = { hint: ['提示', 1], plane: ['纸飞机', 2], firework: ['烟花', 3] };

class MountainChallenge {
  constructor(game) {
    this.game = game;
    this.reset();
    this.modal = document.getElementById('mountain-progress');
    this.startModal = document.getElementById('mountain-start');
    this.map = document.getElementById('mountain-map');
    this.access = document.getElementById('mountain-access');
    this.tools = document.getElementById('mountain-tools');
    this.badges = [...document.querySelectorAll('.mountain-badge')];
    this.buildMap();

    this.access.addEventListener('click', () => this.showProgress());
    document.getElementById('mountain-dismiss').addEventListener('click', () => this.dismissProgress());
    document.getElementById('mountain-start-close').addEventListener('click', () => this.closeStart());
    this.startModal.addEventListener('click', (event) => {
      if (event.target === this.startModal || !this.startModal.classList.contains('with-reward') && !event.target.closest('button')) {
        this.closeStart();
      }
    });
    document.getElementById('mountain-watch').addEventListener('click', () => this.watch());
    this.tools.addEventListener('click', (event) => {
      const button = event.target.closest('[data-mountain-tool]');
      if (button) this.useTool(button.dataset.mountainTool);
    });
    window.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (!this.startModal.hidden) this.closeStart();
      else if (!this.modal.hidden) this.dismissProgress();
    });
    document.getElementById('dbg-mountain-enabled').addEventListener('change', (event) => {
      this.data.enabled = event.target.checked;
      if (!this.data.enabled) {
        this.closeStart();
        this.closeProgress();
      }
      this.update();
      this.game.saveProgress();
    });
    document.getElementById('dbg-mountain-group').addEventListener('change', (event) => {
      this.data.group = Number(event.target.value);
      this.update();
      this.game.saveProgress();
    });
  }

  reset() {
    this.data = {
      registeredAt: Date.now(), enabled: true, group: 3, round: null, lastClear: -1,
      lastAdDate: '', tools: { hint: 0, plane: 0, firework: 0 },
    };
    this.closeStart();
    if (this.modal) {
      this.onContinue = null;
      this.closeProgress();
    }
  }

  get round() { return this.data.round; }
  get now() { return this.game.getNowMs(); }

  load(saved) {
    if (saved) Object.assign(this.data, saved);
  }

  clear(levelIndex, difficulty) {
    if (!this.data.enabled || difficulty < 2 || levelIndex <= this.data.lastClear) return null;
    const now = this.now;
    if (this.round && now < this.round.lastAdvanceAt) return null;
    this.data.lastClear = levelIndex;
    let round = this.round;
    let previousStep = round?.step || 0;
    let coins = [0, 0, 10, 15, 20][difficulty];
    let tool;
    let moved = false;

    const canReopen = round && now >= round.cooldownUntil && (
      round.status === 'ended' || (now > round.endsAt && round.step < round.total - 1)
    );
    if (!round || canReopen) {
      const total = now - this.data.registeredAt <= 14 * MOUNTAIN_DAY ? 7 : 10;
      round = this.data.round = {
        status: 'active', startedAt: now, endsAt: now + 7 * MOUNTAIN_DAY,
        cooldownUntil: now + 8 * MOUNTAIN_DAY, lastAdvanceAt: now,
        total, step: 1, seedScore: 55 + Math.floor(Math.random() * 6),
        group: this.data.group,
      };
      previousStep = 0;
      moved = true;
    } else if (round.status === 'active') {
      if (now <= round.endsAt || round.step === round.total - 1) {
        round.step += 1;
        moved = true;
      } else {
        round.status = 'ended';
      }
    }
    round.lastAdvanceAt = now;

    if (moved && round.step === round.total) {
      round.status = 'ended';
      round.cooldownUntil = now + MOUNTAIN_DAY;
      const remaining = (round.endsAt - now) / MOUNTAIN_DAY;
      coins = 50;
      tool = 'hint';
      if (round.group === 2) {
        coins = remaining <= 1 ? 30 : remaining <= 3 ? 50 : remaining <= 4.5 ? 70 : 0;
        if (coins === 0) tool = 'firework';
      }
      this.data.tools[tool] += 1;
    } else if (moved && round.group === 3 && MOUNTAIN_MILESTONES[round.total].includes(round.step)) {
      coins = round.total === 7 ? 20 : 30;
    }
    this.game.state.coins += coins;
    return { previousStep, moved, coins, tool };
  }

  score(step) {
    const { total, seedScore } = this.round;
    if (step === total) return 100;
    if (total === 7) {
      if (step === 6) return 98 + seedScore % 2;
      return seedScore + Math.min(step - 1, 2) * 8 + Math.max(0, step - 3) * 5;
    }
    if (step <= 7) return seedScore + Math.min(step - 1, 3) * 7 + Math.max(0, step - 4) * 4;
    const midScore = seedScore + 33;
    return midScore + (step - 7) * Math.floor((99 - midScore) / 2);
  }

  update() {
    const round = this.round;
    const difficulty = this.game.mainLevelDifficulty();
    const bonus = this.data.enabled && difficulty >= 2 && round?.status === 'active' && round.group === 3 &&
      this.now >= round.lastAdvanceAt && this.now <= round.endsAt &&
      MOUNTAIN_MILESTONES[round.total].includes(round.step + 1);
    this.badges.forEach((badge) => {
      badge.hidden = !bonus && difficulty < 2;
      badge.classList.toggle('has-coins', !!bonus);
      badge.textContent = bonus ? (round.total === 7 ? '20' : '30') : difficulty >= 4 ? 'SUPER HARD' : 'HARD';
    });
    this.access.hidden = !this.data.enabled || !round;
    if (round) this.access.textContent = `登山进度 · ${round.step}/${round.total}`;
    document.getElementById('dbg-mountain-enabled').checked = this.data.enabled;
    document.getElementById('dbg-mountain-group').value = this.data.group;
    this.updateTools();
    this.updateClock();
  }

  updateClock() {
    if (this.modal.hidden || !this.round) return;
    const { status, endsAt, cooldownUntil } = this.round;
    const active = status === 'active' && this.now <= endsAt;
    const remaining = Math.max(0, Math.ceil(((active ? endsAt : cooldownUntil) - this.now) / 1000));
    const clock = this.game.formatTournamentRemaining(remaining);
    document.getElementById('mountain-clock').textContent = active ? clock : remaining ? `冷却 ${clock}` : '等待下一次困难关通关';
  }

  openStart(difficulty, targetCount) {
    this.closeStart();
    const round = this.round;
    if (!this.data.enabled || difficulty < 2 || round && (this.now < round.lastAdvanceAt ||
        (round.status === 'ended' || this.now > round.endsAt) && this.now < round.cooldownUntil)) return;
    const canWatch = targetCount >= 10 && this.data.lastAdDate !== this.game.getTodayDateTitle() &&
      Object.values(this.data.tools).every((count) => count === 0);
    const group = canWatch ? 2 : targetCount >= 10 ? 3 : 1;
    this.startModal.dataset.group = group;
    this.startModal.classList.toggle('with-reward', canWatch);
    const titles = difficulty >= 4 ? ['Super Hard', '极限挑战'] : ['Hard Challenge', '困难挑战'];
    document.getElementById('mountain-start-title').textContent = titles[Math.floor(Math.random() * titles.length)];
    this.startModal.hidden = false;
    document.getElementById(canWatch ? 'mountain-watch' : 'mountain-start-close').focus();
  }

  closeStart() {
    if (this.startModal) this.startModal.hidden = true;
  }

  watch() {
    if (this.startModal.hidden || !this.startModal.classList.contains('with-reward')) return;
    this.data.lastAdDate = this.game.getTodayDateTitle();
    this.data.tools.plane += 2;
    this.closeStart();
    this.updateTools();
    this.game.saveProgress();
  }

  updateTools() {
    this.tools.querySelectorAll('button').forEach((button) => {
      const key = button.dataset.mountainTool;
      const count = this.data.tools[key];
      button.hidden = !this.data.enabled || !count || this.game.state.isDaily || this.game.state.isCustom;
      button.textContent = `${MOUNTAIN_TOOLS[key][0]} ×${count}`;
    });
  }

  useTool(key) {
    if (!this.data.enabled || !this.data.tools[key] || this.game.state.isDaily || this.game.state.isCustom ||
        !this.game.useHint(MOUNTAIN_TOOLS[key][1])) return;
    this.data.tools[key] -= 1;
    this.updateTools();
    this.game.saveProgress();
  }

  buildMap() {
    const art = (name, x, y, w, h, cls = '') =>
      `<img class="${cls}" src="assets/mountain/${name}.png" alt="" style="left:${(x - 240) / 6.5}%;top:${(y - 885) / 5.46}%;width:${w / 6.5}%;height:${h / 5.46}%">`;
    const terrain = [[470,992,200,146],[462.5,1040.5,318,222],[303.5,1126.5,492,304],[298,1241,582,190]];
    const lights = [[255,1201,546,230],[448,1086,362,164],[452,1000,224,132],[598,951,80,96]];
    const parts = [
      ['leg_1',95,300,79,151],['leg_2',130,315,122,130],['body_1',90,120,120,180],
      ['body',55,100,189,205],['arm_1',30,150,63,104],['arm_2',190,145,120,82],
      ['head',118,8,95,95],['gunzi',250,38,39,272],['gunzi_1',228,92,87,188],['qizi',240,22,129,89],
    ];
    this.map.innerHTML = terrain.map((rect, i) => art(`img_hardlevelresult_bg${4 - i}`, ...rect)).join('') +
      lights.map((rect, i) => art(`img_hardlevelresult_light${i + 1}`, ...rect, 'mountain-light')).join('') +
      [[746,1217],[451,1100],[625,1018]].map(([x,y]) =>
        `<span class="mountain-flower" style="left:${(x - 240) / 6.5}%;top:${(y - 885) / 5.46}%"></span>`).join('') +
      `<span class="mountain-climber"><svg viewBox="0 0 370 455">${parts.map(([name,x,y,w,h]) =>
        `<image href="assets/mountain/DifficultPeople_${name}.png" x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}</svg></span>` +
      '<span class="mountain-gift"><img alt="" src="assets/mountain/icon_hardlevelresult_gift1.png"></span>';
  }

  draw(step) {
    const round = this.round;
    const visual = Math.max(0, step - 1);
    const milestones = MOUNTAIN_MILESTONES[round.total];
    const limits = [0, ...milestones];
    this.map.querySelectorAll('.mountain-light').forEach((light, i) => {
      const fill = i === 3 ? Number(step === round.total) :
        Math.max(0, Math.min(1, (visual - limits[i]) / (limits[i + 1] - limits[i])));
      const cut = `${(1 - fill) * 100}%`;
      light.style.clipPath = i % 2 ? `inset(0 0 0 ${cut})` : `inset(0 ${cut} 0 0)`;
    });
    this.map.querySelectorAll('.mountain-flower').forEach((flower, i) => {
      flower.classList.toggle('bloom', visual >= milestones[i]);
    });
    const route = MOUNTAIN_ROUTES[round.total];
    const [x, y] = route[step === round.total ? route.length - 1 : visual];
    const climber = this.map.querySelector('.mountain-climber');
    climber.style.left = `${(x - 240) / 6.5}%`;
    climber.style.top = `${(y - 885) / 5.46}%`;
    document.getElementById('mountain-score').textContent = this.score(Math.max(1, step));
    document.getElementById('mountain-step').textContent = `${step} / ${round.total}`;
  }

  showProgress(result = null, onContinue = null) {
    if (!this.data.enabled || !this.round) return;
    this.onContinue = onContinue;
    this.previousFocus = document.activeElement;
    this.modal.hidden = false;
    this.updateClock();
    this.modal.classList.remove('animate', 'summit');
    this.map.querySelector('.mountain-gift img').src =
      `assets/mountain/icon_hardlevelresult_gift${this.round.step === this.round.total && !result?.tool ? 2 : 1}.png`;
    const reward = document.getElementById('mountain-reward');
    reward.textContent = '';
    const caption = document.getElementById('mountain-caption');
    caption.textContent = result ? '3s Later Continue · 点击继续' : '点击关闭';
    this.draw(result?.moved ? result.previousStep : this.round.step);
    document.getElementById('mountain-dismiss').focus();
    if (!result) return;

    const finish = () => {
      this.draw(this.round.step);
      if (result.tool) {
        this.map.querySelector('.mountain-gift img').src = 'assets/mountain/icon_hardlevelresult_gift2.png';
        this.modal.classList.add('summit');
      }
      const label = (coins) => [
        result.coins ? `+${coins} 金币` : '',
        result.tool ? `${MOUNTAIN_TOOLS[result.tool][0]} ×1` : '',
      ].filter(Boolean).join(' · ');
      reward.textContent = label(result.coins);
      if (result.tool && result.coins && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const started = performance.now();
        const count = (now) => {
          const progress = Math.min(1, (now - started) / 550);
          reward.textContent = label(Math.round(result.coins * progress));
          if (progress < 1) this.coinFrame = requestAnimationFrame(count);
        };
        this.coinFrame = requestAnimationFrame(count);
      }
    };
    this.reveal = result.tool ? finish : null;
    this.revealTimer = setTimeout(() => {
      this.modal.classList.add('animate');
      if (!result.tool) {
        finish();
        return;
      }
      this.draw(this.round.step);
      this.revealTimer = setTimeout(() => {
        this.reveal = null;
        finish();
      }, 720);
    }, 110);
    this.closeTimer = setTimeout(() => this.closeProgress(), result.tool ? 4000 : 3000);
  }

  dismissProgress() {
    if (this.reveal) {
      clearTimeout(this.revealTimer);
      this.reveal();
      this.reveal = null;
      return;
    }
    this.closeProgress();
  }

  closeProgress() {
    clearTimeout(this.revealTimer);
    clearTimeout(this.closeTimer);
    cancelAnimationFrame(this.coinFrame);
    this.reveal = null;
    this.modal.hidden = true;
    if (this.previousFocus?.getClientRects().length) this.previousFocus.focus();
    this.previousFocus = null;
    const next = this.onContinue;
    this.onContinue = null;
    if (next) next();
  }
}
