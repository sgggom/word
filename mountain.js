const MOUNTAIN_DAY = 86400000;
const MOUNTAINS = [
  {
    name: '云霞峰', total: 50, reward: 50, start: 0, art: 'summit-scene.jpg',
    route: 'M370 838 Q423 790 505 765 Q530 759 558 731 C670 710 632 653 753 615 Q824 590 795 541 C776 507 732 471 811 432 Q955 381 911 343 Q859 304 858 253',
  },
  {
    name: '赤岩峰', total: 100, reward: 100, start: 50, art: 'summit-amber.jpg',
    route: 'M420 854 C530 819 743 807 719 738 S536 682 611 619 S930 562 915 484 S707 453 755 370 Q796 306 860 265',
  },
  {
    name: '极光雪峰', total: 200, reward: 200, start: 150, art: 'summit-frost.jpg',
    route: 'M1085 855 C1049 806 804 814 811 731 S1022 684 1005 605 S717 588 733 489 S908 441 884 359 Q864 319 898 275',
  },
];
const MOUNTAIN_TOTAL = MOUNTAINS.at(-1).start + MOUNTAINS.at(-1).total;
const MOUNTAIN_CHECKPOINTS = 4;
const ENDLESS_SLOPE = {
  name: '无尽山坡', start: MOUNTAIN_TOTAL, total: 25, reward: 50,
  art: 'endless-slope.svg',
  route: 'M440 841 C544 825 608 784 693 738 S859 665 944 596 Q1038 527 1130 484',
};

class MountainChallenge {
  constructor(game) {
    this.game = game;
    this.modal = document.getElementById('mountain-progress');
    this.access = document.getElementById('mountain-access');
    this.dismiss = document.getElementById('mountain-dismiss');
    this.climber = document.getElementById('mountain-climber');
    this.path = this.modal.querySelector('.mountain-route path');
    this.marks = this.modal.querySelector('.mountain-route-marks');
    this.hikers = this.modal.querySelector('.mountain-hikers');
    this.art = document.getElementById('mountain-art');
    this.map = document.getElementById('mountain-map');
    this.reward = document.getElementById('mountain-reward');
    this.rewardTitle = document.getElementById('mountain-reward-title');
    this.rewardAmount = document.getElementById('mountain-reward-amount');
    this.title = document.getElementById('mountain-title');
    this.settlement = document.getElementById('mountain-settlement');
    this.clock = document.getElementById('mountain-clock');
    this.leaderboard = document.getElementById('mountain-leaderboard');
    this.board = document.getElementById('mountain-board');
    this.playerRow = document.getElementById('mountain-player-row');
    this.percentile = document.getElementById('mountain-percentile');
    this.help = document.getElementById('mountain-help');
    this.rules = document.getElementById('mountain-rules');
    this.campSummary = document.getElementById('mountain-camp-summary');
    this.distance = document.getElementById('mountain-distance');
    this.nextDistance = document.getElementById('mountain-next-distance');
    this.legProgress = document.getElementById('mountain-leg-progress');
    this.campCount = document.getElementById('mountain-camp-count');
    this.campRanking = document.getElementById('mountain-camp-ranking');
    this.bots = game.createDefaultTournamentBots();
    this.badges = [...document.querySelectorAll('.mountain-badge')];
    this.reset();

    const variantButton = document.getElementById('dbg-mountain-variant');
    this.variant = 'A';
    variantButton.addEventListener('click', () => {
      this.variant = this.variant === 'A' ? 'B' : 'A';
      variantButton.textContent = `登山界面：${this.variant} 版`;
      if (!this.modal.hidden) this.update();
    });
    this.access.addEventListener('click', () => this.show());
    this.dismiss.addEventListener('click', () => this.close());
    document.getElementById('dbg-mountain-progress').addEventListener('click', () => {
      let promotion = null;
      for (let i = 0; i < 5; i++) {
        promotion = this.awardClear() ?? promotion;
      }
      this.game.updateLobbyUI();
      this.game.updateDebugPanel();
      this.game.saveProgress();
      this.show(promotion, this.onClose);
    });
    this.help.addEventListener('click', () => {
      this.rules.hidden = !this.rules.hidden;
      this.help.setAttribute('aria-expanded', String(!this.rules.hidden));
    });
    document.getElementById('mountain-play').addEventListener('click', () => {
      this.game.sound.playClick();
      this.close();
      this.game.startGame(false);
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.modal.hidden) this.close();
    });
  }

  reset() {
    this.data = null;
    this.onClose = null;
    this.close();
  }

  load(saved) {
    if (Number.isFinite(saved?.startedAt) && Number.isSafeInteger(saved.points) && saved.points >= 0) {
      const date = new Date(saved.startedAt);
      this.data = {
        startedAt: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
        points: saved.points,
        shownPoints: Number.isFinite(saved.shownPoints)
          ? Math.max(0, Math.min(saved.points, saved.shownPoints))
          : saved.points,
        settlement: saved.settlement ?? null,
      };
    }
  }

  seasonEnd() {
    const date = new Date(this.data.startedAt);
    return new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
  }

  rollSeason(now) {
    if (this.data && now < this.seasonEnd()) return false;

    let settlement = this.data?.settlement ?? null;
    if (this.data?.points > 0) {
      const end = this.seasonEnd();
      const lastDay = Math.floor((end - 1 - this.data.startedAt) / MOUNTAIN_DAY);
      const { rows, player } = this.getStandings(lastDay);
      const rank = rows.indexOf(player) + 1;
      const reward = this.game.getTournamentRewardByRank(rank);
      const date = new Date(this.data.startedAt);
      settlement = { month: `${date.getFullYear()}年${date.getMonth() + 1}月`, rank, reward };
      this.game.state.coins += reward;
      if (reward > 0) {
        const balance = this.game.state.coins.toLocaleString();
        this.game.elCoins.textContent = balance;
        this.game.elWheelCoins.textContent = balance;
        this.game.elGameCoins.textContent = balance;
      }
    }

    const date = new Date(now);
    this.data = {
      startedAt: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
      points: 0,
      shownPoints: 0,
      settlement,
    };
    return true;
  }

  activeMountain() {
    return this.data.points >= MOUNTAIN_TOTAL
      ? MOUNTAINS.length
      : MOUNTAINS.findLastIndex(({ start }) => this.data.points >= start);
  }

  mountainProgress(mountain) {
    return Math.min(mountain.total, this.data.points - mountain.start);
  }

  awardClear() {
    if (this.rollSeason(this.game.getNowMs())) this.refreshSeason();
    const mountainIndex = this.activeMountain();
    const mountain = MOUNTAINS[mountainIndex] ?? ENDLESS_SLOPE;
    this.data.points += 1;
    this.leaderboardDay = null;

    const distance = this.data.points - mountain.start;
    const endless = mountain === ENDLESS_SLOPE;
    const milestones = endless ? 1 : MOUNTAIN_CHECKPOINTS;
    const step = mountain.total / milestones;
    const progress = endless ? (distance - 1) % mountain.total + 1 : distance;
    const milestone = Math.floor(progress / step);
    if (milestone === Math.floor((progress - 1) / step)) return null;

    const reward = milestone === milestones ? mountain.reward : 0;
    this.game.state.coins += reward;
    return { mountainIndex, reward, startedAt: this.data.startedAt };
  }

  refreshSeason() {
    this.leaderboardDay = null;
    this.selectedMountain = 0;
    if (!this.modal.hidden) this.render();
  }

  update() {
    const now = this.game.getNowMs();
    if (this.rollSeason(now)) {
      this.refreshSeason();
      this.game.saveProgress();
    }
    const difficulty = this.game.mainLevelDifficulty();
    this.badges.forEach((badge) => {
      badge.hidden = difficulty < 2;
      badge.textContent = difficulty >= 4 ? 'SUPER HARD' : 'HARD';
    });
    if (this.modal.hidden) return;
    const remaining = this.seasonEnd() - Math.max(now, this.data.startedAt);
    const hours = Math.ceil(remaining / 3600000);
    this.clock.textContent = `${Math.floor(hours / 24)}d ${hours % 24}h`;
    const day = Math.floor(Math.max(0, now - this.data.startedAt) / MOUNTAIN_DAY);
    const showSummary = this.variant === 'B';
    this.board.hidden = showSummary;
    this.percentile.hidden = showSummary;
    this.campSummary.hidden = !showSummary;
    if (showSummary) this.renderCampSummary();
    else if (day !== this.leaderboardDay) this.renderLeaderboard(day);
  }

  show(promotion = null, onClose = null) {
    this.game.sound.playClick();
    this.update();
    this.onClose = onClose;
    this.modal.hidden = false;
    const reachedCheckpoint = promotion?.startedAt === this.data.startedAt;
    this.selectedMountain = reachedCheckpoint ? promotion.mountainIndex : this.activeMountain();
    this.render(reachedCheckpoint ? promotion : null, true);
    this.leaderboardDay = null;
    this.update();
    this.dismiss.focus();
  }

  close() {
    const wasOpen = !this.modal.hidden;
    this.modal.hidden = true;
    this.rules.hidden = true;
    this.help.setAttribute('aria-expanded', 'false');
    clearTimeout(this.nextMountainTimer);
    cancelAnimationFrame(this.walkFrame);
    if (this.data && this.climber.classList.contains('walking')) this.game.saveProgress();
    this.climber.classList.remove('walking');
    this.reward.hidden = true;
    const onClose = this.onClose;
    this.onClose = null;
    if (wasOpen && this.game.state.currentScreen === 'lobby') this.access.focus();
    onClose?.();
  }

  render(promotion = null, animate = false) {
    clearTimeout(this.nextMountainTimer);
    cancelAnimationFrame(this.walkFrame);
    this.climber.classList.remove('walking');
    this.reward.hidden = true;

    const mountain = MOUNTAINS[this.selectedMountain] ?? ENDLESS_SLOPE;
    const endless = mountain === ENDLESS_SLOPE;
    const distanceClimbed = this.data.points - mountain.start;
    const endlessProgress = distanceClimbed === 0 ? 0 : (distanceClimbed - 1) % mountain.total + 1;
    const progress = endless
      ? (promotion ? mountain.total : endlessProgress)
      : this.mountainProgress(mountain);
    const routeStart = endless
      ? this.data.points - (promotion ? distanceClimbed % mountain.total + progress : progress)
      : mountain.start;
    const previousProgress = Math.max(0, Math.min(progress, this.data.shownPoints - routeStart));
    this.routeProgress = progress;
    const fraction = progress / mountain.total;
    this.modal.dataset.stage = String(this.selectedMountain);
    this.title.textContent = endless ? mountain.name : 'Summit Race';
    const settlement = this.data.settlement;
    this.settlement.hidden = !settlement;
    this.settlement.textContent = settlement
      ? `${settlement.month}结算 · 第 ${settlement.rank} 名 · ${settlement.reward > 0 ? `+${settlement.reward}g 已到账` : '0g'}`
      : '';

    this.art.setAttribute('href', `assets/mountain/${mountain.art}`);
    this.art.removeAttribute('transform');
    this.map.setAttribute('viewBox', endless ? '440 375 690 520' : '0 0 1536 1024');
    this.path.setAttribute('d', mountain.route);
    const fullLength = this.path.getTotalLength();
    const cameraAnchor = endless ? this.path.getPointAtLength(fullLength / 2) : null;
    const inset = endless ? fullLength * 0.24 : 0;
    const length = fullLength - 2 * inset;
    const distance = inset + length * fraction;
    const previousFraction = previousProgress / mountain.total;
    const from = inset + length * previousFraction;
    const targetPoints = routeStart + progress;
    const finish = () => {
      const changed = this.data.shownPoints !== targetPoints;
      this.data.shownPoints = targetPoints;
      if (changed) this.game.saveProgress();
      this.climber.classList.remove('walking');
      this.renderRouteMarks(length, fraction, endless);
      if (promotion?.reward) {
        this.rewardTitle.textContent = endless ? '完成 25 关' : `${mountain.name} · 登顶成功`;
        this.rewardAmount.textContent = `+${promotion.reward}g`;
        this.reward.hidden = false;
        if (!endless) {
          this.nextMountainTimer = setTimeout(() => {
            this.selectedMountain = this.activeMountain();
            this.render(null, true);
            if (this.variant === 'B') this.renderCampSummary();
          }, 1600);
        }
      }
    };

    if (!animate || distance === from || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.placeClimber(distance, cameraAnchor);
      finish();
      return;
    }

    this.renderRouteMarks(length, previousFraction, endless);
    this.placeClimber(from, cameraAnchor);
    this.climber.classList.add('walking');
    const started = performance.now();
    const walk = (now) => {
      const elapsed = Math.min(1, (now - started) / 850);
      this.placeClimber(from + (distance - from) * elapsed, cameraAnchor);
      if (elapsed < 1) {
        this.data.shownPoints = routeStart + previousProgress + (progress - previousProgress) * elapsed;
        this.walkFrame = requestAnimationFrame(walk);
      } else {
        finish();
      }
    };
    this.walkFrame = requestAnimationFrame(walk);
  }

  renderRouteMarks(length, fraction, endless) {
    const svg = 'http://www.w3.org/2000/svg';
    this.marks.replaceChildren();
    this.hikers.replaceChildren();
    if (endless) return;
    for (let i = 1; i <= MOUNTAIN_CHECKPOINTS; i++) {
      const checkpoint = i / MOUNTAIN_CHECKPOINTS;
      const { x, y } = this.path.getPointAtLength(length * checkpoint);
      const marker = document.createElementNS(svg, 'circle');
      marker.setAttribute('cx', x);
      marker.setAttribute('cy', y);
      marker.setAttribute('r', 12);
      if (fraction >= checkpoint) marker.classList.add('reached');
      const label = document.createElementNS(svg, 'text');
      label.setAttribute('class', 'mountain-route-flags');
      label.setAttribute('x', x + 19);
      label.setAttribute('y', y + 8);
      label.textContent = `${checkpoint * 100}%`;
      this.marks.append(marker, label);

      const point = this.path.getPointAtLength(length * (checkpoint - 0.09));
      const hiker = document.createElementNS(svg, 'g');
      hiker.setAttribute('transform', `translate(${point.x} ${point.y})`);
      const sprite = document.createElementNS(svg, 'use');
      sprite.setAttribute('href', '#summit-walker');
      hiker.append(sprite);
      this.hikers.append(hiker);
    }
  }

  placeClimber(distance, cameraAnchor) {
    const { x, y } = this.path.getPointAtLength(distance);
    const position = cameraAnchor ?? { x, y };
    this.climber.setAttribute('transform', `translate(${position.x} ${position.y})`);
    if (cameraAnchor) {
      this.art.setAttribute('transform', `translate(${position.x - x} ${position.y - y})`);
    }
  }

  getStandings(day) {
    const player = { name: this.game.state.playerName, points: this.data.points };
    const rows = this.bots.map(({ name, score }) => ({
      name,
      points: Math.floor(score / 4 + day * (1 + score / 8)),
    }));
    // 稳定排序让同分时玩家排在机器人前面。
    rows.unshift(player);
    rows.sort((a, b) => b.points - a.points);
    return { rows, player };
  }

  renderLeaderboard(day) {
    this.leaderboardDay = day;
    const { rows, player } = this.getStandings(day);
    const rivals = [];
    rows.forEach((row, index) => {
      const isPlayer = row === player;
      const item = this.buildLeaderboardRow(row, index + 1, isPlayer);
      if (isPlayer) this.playerRow.replaceChildren(item);
      else rivals.push(item);
    });
    this.leaderboard.replaceChildren(...rivals);
    const beaten = rows.filter((row) => row.points < player.points).length;
    const percent = document.createElement('strong');
    percent.textContent = `${Math.round(beaten / this.bots.length * 100)}%`;
    this.percentile.replaceChildren('You beat ', percent, ' of players.');
  }

  buildLeaderboardRow(row, rank, isPlayer) {
    const item = document.createElement(isPlayer ? 'div' : 'li');
    item.className = 'mountain-board-row';
    const position = document.createElement('span');
    position.className = 'mountain-board-position';
    position.textContent = String(rank);
    if (rank <= 3) position.dataset.medal = String(rank);
    const avatar = document.createElement('span');
    avatar.className = 'mountain-board-avatar';
    avatar.textContent = row.name.slice(0, 1).toUpperCase();
    avatar.setAttribute('aria-hidden', 'true');
    const name = document.createElement('strong');
    name.textContent = isPlayer ? `${row.name}（你）` : row.name;
    const reward = this.game.getTournamentRewardByRank(rank);
    const rewardLabel = document.createElement('span');
    rewardLabel.className = 'mountain-rank-reward';
    rewardLabel.textContent = reward > 0 ? `${reward}g` : '';
    const score = document.createElement('span');
    score.className = 'mountain-board-score';
    score.textContent = String(row.points);
    item.append(position, avatar, name, rewardLabel, score);
    return item;
  }

  renderCampSummary() {
    const mountain = MOUNTAINS[this.selectedMountain] ?? ENDLESS_SLOPE;
    const endless = mountain === ENDLESS_SLOPE;
    const points = this.routeProgress;
    const step = mountain.total / (endless ? 1 : MOUNTAIN_CHECKPOINTS);
    const camp = Math.floor(points / step);
    const next = Math.ceil((camp + 1) * step);
    const complete = points === mountain.total;
    const bots = 2399 - (this.selectedMountain * MOUNTAIN_CHECKPOINTS + camp) * 120;
    const ahead = complete ? 0 : Math.ceil(bots * (next - 1 - points) / step);
    const total = bots + 1;
    const rank = ahead + 1;
    const position = rank > 100 ? `前 ${(rank / total * 100).toFixed(1)}%` : `第 ${rank} 名`;
    this.distance.textContent = `${points}/${mountain.total}`;
    const goal = next === mountain.total ? ` · 奖励 ${mountain.reward}g` : '';
    this.nextDistance.textContent = complete
      ? (endless ? '本段已完成' : '已登顶')
      : `距${endless ? '下一次奖励' : '下一路标'} ${next - points} 关${goal}`;
    const start = Math.ceil(camp * step);
    this.legProgress.value = complete ? 100 : (points - start) / (next - start) * 100;
    this.campCount.textContent = `${total.toLocaleString()} 人`;
    this.campRanking.textContent = position;
  }
}
