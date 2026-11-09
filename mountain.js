const MOUNTAIN_DAY = 86400000;
const MOUNTAIN_SEASON = 29 * MOUNTAIN_DAY;
const MOUNTAIN_STAGES = [
  [5, 10, 20],
  [30, 40, 50],
  [75, 100, 150],
];
const MOUNTAIN_NODES = MOUNTAIN_STAGES.flatMap((thresholds, stage) =>
  thresholds.map((points, node) => ({ points, stage, node }))
);

class MountainChallenge {
  constructor(game) {
    this.game = game;
    this.modal = document.getElementById('mountain-progress');
    this.access = document.getElementById('mountain-access');
    this.dismiss = document.getElementById('mountain-dismiss');
    this.climber = document.getElementById('mountain-climber');
    this.paths = [...this.modal.querySelectorAll('.mountain-route path')];
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
      this.data = { startedAt: saved.startedAt, points: saved.points };
    }
  }

  rollSeason(now) {
    if (!this.data) {
      this.data = { startedAt: now, points: 0 };
      return true;
    }
    const periods = Math.floor((now - this.data.startedAt) / MOUNTAIN_SEASON);
    if (periods < 1) return false;
    this.data = { startedAt: this.data.startedAt + periods * MOUNTAIN_SEASON, points: 0 };
    return true;
  }

  awardClear() {
    this.rollSeason(this.game.getNowMs());
    this.data.points += 1;
    const promoted = MOUNTAIN_NODES.find((node) => node.points === this.data.points);
    return promoted ? { node: promoted, startedAt: this.data.startedAt } : null;
  }

  update() {
    const now = this.game.getNowMs();
    if (this.rollSeason(now)) {
      this.leaderboardDay = null;
      this.game.saveProgress();
      if (!this.modal.hidden) this.render();
    }
    const difficulty = this.game.mainLevelDifficulty();
    this.badges.forEach((badge) => {
      badge.hidden = difficulty < 2;
      badge.textContent = difficulty >= 4 ? 'SUPER HARD' : 'HARD';
    });
    if (this.modal.hidden) return;
    const remaining = Math.min(MOUNTAIN_SEASON, this.data.startedAt + MOUNTAIN_SEASON - now);
    const hours = Math.ceil(remaining / 3600000);
    this.clock.textContent = `${Math.floor(hours / 24)}d ${hours % 24}h`;
    const day = Math.floor((MOUNTAIN_SEASON - remaining) / MOUNTAIN_DAY);
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
    this.render(promotion?.startedAt === this.data.startedAt ? promotion.node : null);
    this.leaderboardDay = null;
    this.update();
    this.dismiss.focus();
  }

  close() {
    const wasOpen = !this.modal.hidden;
    this.modal.hidden = true;
    this.rules.hidden = true;
    this.help.setAttribute('aria-expanded', 'false');
    cancelAnimationFrame(this.walkFrame);
    this.climber.classList.remove('walking');
    const onClose = this.onClose;
    this.onClose = null;
    if (wasOpen && this.game.state.currentScreen === 'lobby') this.access.focus();
    onClose?.();
  }

  render(promotion = null) {
    cancelAnimationFrame(this.walkFrame);
    this.climber.classList.remove('walking');

    const points = this.data.points;
    const reached = MOUNTAIN_NODES.findLast((node) => points >= node.points);
    this.modal.dataset.stage = String(reached?.stage ?? 0);
    const path = this.paths[reached?.node ?? 0];
    const distance = path.getTotalLength();
    if (!promotion || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.placeClimber(path, reached ? distance : 0);
      return;
    }

    this.placeClimber(path, 0);
    this.climber.classList.add('walking');
    const duration = Math.min(2400, 650 + distance * 1.55);
    const started = performance.now();
    const walk = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      this.placeClimber(path, distance * progress);
      if (progress < 1) this.walkFrame = requestAnimationFrame(walk);
      else this.climber.classList.remove('walking');
    };
    this.walkFrame = requestAnimationFrame(walk);
  }

  placeClimber(path, distance) {
    const { x, y } = path.getPointAtLength(distance);
    this.climber.setAttribute('transform', `translate(${x} ${y})`);
  }

  renderLeaderboard(day) {
    this.leaderboardDay = day;
    const player = { name: this.game.state.playerName, points: this.data.points };
    const rows = this.bots.map(({ name, score }) => ({
      name,
      points: Math.floor(score / 4 + day * (1 + score / 8)),
    }));
    // 稳定排序让同分时玩家排在机器人前面。
    rows.unshift(player);
    rows.sort((a, b) => b.points - a.points);
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
    const chest = document.createElement('span');
    chest.className = 'mountain-board-chest';
    if (!isPlayer) chest.dataset.tier = String(Math.min(rank, 4));
    const score = document.createElement('span');
    score.className = 'mountain-board-score';
    score.textContent = String(row.points);
    item.append(position, avatar, name, chest, score);
    return item;
  }

  renderCampSummary() {
    const points = this.data.points;
    const camp = MOUNTAIN_NODES.findLastIndex((node) => points >= node.points);
    const next = MOUNTAIN_NODES[camp + 1];
    const min = MOUNTAIN_NODES[camp]?.points ?? 0;
    const max = (next?.points ?? 250) - 1;
    const bots = 2399 - (camp + 1) * 200;
    // 模拟同营地对手均匀分布在本段的积分区间，同分时玩家排在前面。
    const ahead = Math.ceil(bots * Math.max(0, max - points) / (max - min + 1));
    const total = bots + 1;
    const rank = ahead + 1;
    const position = rank > 100 ? `前 ${(rank / total * 100).toFixed(1)}%` : `第 ${rank} 名`;
    this.distance.textContent = `${points.toLocaleString()} 米`;
    this.nextDistance.textContent = next ? `距下一营地 ${next.points - points} 米` : '已登顶';
    this.legProgress.value = next ? (points - min) / (next.points - min) * 100 : 100;
    this.campCount.textContent = `${total.toLocaleString()} 人`;
    this.campRanking.textContent = position;
  }
}
