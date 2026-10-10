"""从原版 APK 解包出的 assets 目录提取参考关卡（仅本地使用，不提交）。
用法: python tools/extract-reference.py <解包后的 assets 目录> data/reference
"""
import gzip, json, os, sys

base, outdir = sys.argv[1], sys.argv[2]
LV = os.path.join(base, 'Levels', 'english')


def ids(name):
    return [x.strip() for x in open(os.path.join(base, 'LevelLists', 'english', name)).read().split(',') if x.strip()]


def load(i):
    return json.loads(gzip.open(os.path.join(LV, i + '.level')).read())


def all_paths(rows, word):
    H, W = len(rows), len(rows[0])
    res = []

    def dfs(r, c, k, used):
        if rows[r][c] != word[k]:
            return
        used = used + [r * W + c]
        if k == len(word) - 1:
            res.append(used)
            return
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            rr, cc = r + dr, c + dc
            if 0 <= rr < H and 0 <= cc < W and rr * W + cc not in used:
                dfs(rr, cc, k + 1, used)

    for r in range(H):
        for c in range(W):
            dfs(r, c, 0, [])
    return res


def feasible(assign, curtains):
    # curtains: list of (required, set(cells)); greedy order
    if not curtains:
        return True
    left = list(range(len(assign)))
    found = 0
    while left:
        closed = set()
        for req, cells in curtains:
            if found < req:
                closed |= cells
        nxt = [i for i in left if not (set(assign[i]) & closed)]
        if not nxt:
            return False
        for i in nxt:
            left.remove(i)
            found += 1
            break
    return True


def solve(rows, words, curtains):
    H, W = len(rows), len(rows[0])
    N = H * W
    P = [all_paths(rows, w) for w in words]
    order = sorted(range(len(words)), key=lambda i: len(P[i]))
    assign = [None] * len(words)
    budget = [200000]

    def rec(k, cov):
        budget[0] -= 1
        if budget[0] < 0:
            return False
        if k == len(order):
            return len(cov) == N and feasible(assign, curtains)
        # pruning: remaining words' letters must be able to cover missing cells
        i = order[k]
        for p in P[i]:
            assign[i] = p
            if rec(k + 1, cov | set(p)):
                return True
        assign[i] = None
        return False

    if rec(0, frozenset()):
        return assign
    return None


def build(i, flip):
    L = load(i)
    rows = L['letters'].split(',')
    H, W = len(rows), len(rows[0])
    words = [w['word'] for w in L['target_words']]
    best = None
    for fl in ([flip] if flip is not None else [False, True]):
        curt = []
        for o in L['obstacles']:
            cells = set()
            for c in o['cells']:
                y = (H - 1 - c['y']) if fl else c['y']
                cells.add(y * W + c['x'])
            curt.append((o['required_words'], cells))
        a = solve(rows, words, curt)
        if a:
            best = (fl, a, curt)
            break
    if not best:
        return None, None
    fl, a, curt = best
    cnt = [0] * (H * W)
    for p in a:
        for c in p:
            cnt[c] += 1
    d = {'id': L['id'], 'g': L['letters'],
         't': ' '.join(words),
         'e': ' '.join(w['word'] for w in L['extra_words']),
         'n': ''.join('0123456789abcdefghijklmnopqrstuvwxyz'[c] for c in cnt)}
    ty = ''.join(str(w['type']) for w in L['target_words'])
    if ty.strip('0'):
        d['ty'] = ty
    if curt:
        d['o'] = [[req, sorted(cells)] for req, cells in curt]
    return d, fl


campaign_ids = ids('level_list_3')
seen = set(campaign_ids)
for x in ids('level_list_0') + ids('level_list_2'):
    if x not in seen:
        campaign_ids.append(x)
        seen.add(x)
daily_ids = ids('daily_puzzle_level_list')

stats = {'flipF': 0, 'flipT': 0, 'fail': 0}
camp, daily, vocab = [], [], set()
for lst, out in ((campaign_ids, camp), (daily_ids, daily)):
    for i in lst:
        d, fl = build(i, None)
        if not d:
            stats['fail'] += 1
            continue
        if 'o' in d:
            stats['flipT' if fl else 'flipF'] += 1
        out.append(d)
        vocab.update(d['t'].split())
        vocab.update(d['e'].split())
print(stats, len(camp), len(daily), len(vocab))

defs = {}
DD = os.path.join(base, 'Definitions', 'english')
for f in os.listdir(DD):
    ent = json.load(open(os.path.join(DD, f), encoding='utf-8'))['entries']
    for w, v in ent.items():
        if w in vocab:
            defs[w] = [[s['pos'], s['def']] for s in v['senses'][:3]]
print('defs', len(defs), 'missing', len(vocab - set(defs)))

os.makedirs(outdir, exist_ok=True)
with open(os.path.join(outdir, 'levels.js'), 'w', encoding='utf-8') as f:
    f.write('window.REF_LEVELS=' + json.dumps(camp, separators=(',', ':')) + ';\n')
    f.write('window.REF_DAILY=' + json.dumps(daily, separators=(',', ':')) + ';\n')
with open(os.path.join(outdir, 'dictionary.js'), 'w', encoding='utf-8') as f:
    f.write('window.REF_DEFS=' + json.dumps(defs, separators=(',', ':'), ensure_ascii=False) + ';\n')
