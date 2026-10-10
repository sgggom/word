"""从 ECDICT（https://github.com/skywind3000/ECDICT，MIT 许可）构建分级词表 tools/words.tsv。

用法: python tools/build-wordlist.py <ecdict.csv>

按词频排名（COCA 优先，缺失时用 BNC）把单词分成 5 档：
  1 非常常用  排名 ≤ 2000
  2 常用      ≤ 5000
  3 一般      ≤ 10000
  4 罕见      ≤ 20000
  5 非常罕见  ≤ 40000
输出每行：单词<TAB>档位<TAB>中文释义。tools/words.txt 中的精选释义优先。
"""
import csv
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TIERS = [2000, 5000, 10000, 20000, 40000]

# 释义里出现这些标记的词不收录：人名地名、缩写、粗俗或冒犯性词汇
BAD_GLOSS = re.compile(r'人名|地名|常用名|名字|昵称|爱称|名）|男子名|女子名|姓氏|教名|缩写|abbr|公司|城市|首都|省会|河流|山脉|品牌|商标|\[=|=\[|粗俗|粗话|脏话|<粗>|<俚>|禁忌|侮辱|蔑称|贬义|下流|色情|淫|性交|阴茎|阴道|妓|黑鬼')
BLOCK = set('''
anal anus arse arses ass asses asshole bastard bitch bitches bloody bollock boner boob boobs booby bugger butt
clit cock cocks coon crap cum cunt damn dick dicks dildo dyke fag faggot fags fanny feck frig fuck fucked fucker
fuck gook homo hooker horny jap jerk jizz kike knob kraut milf nazi negro nigga nigger nip nude nudes orgasm
paki penis perv piss pissed poof poon porn porno prick pube pubes puke queer rape raped rapist rectum retard
scrotum semen sex sexy shag shit shits slut sluts smut snatch spic sperm spunk tit tits titty tosser turd twat
vagina vulva wank wanker whore wop
'''.split())


def short_gloss(tr):
    """取前两行释义（跳过 [网络] 等），压缩成一句。"""
    lines = [l.strip() for l in tr.replace('\\n', '\n').split('\n') if l.strip() and not l.startswith('[')]
    out = []
    for l in lines[:2]:
        l = re.sub(r'\s+', ' ', l)
        parts = re.split(r'[；;]', l)
        out.append('；'.join(p.strip() for p in parts[:3] if p.strip()))
    g = '  '.join(out)
    return g[:40] + ('…' if len(g) > 40 else '')


def main(path):
    curated = {}
    for line in open(os.path.join(HERE, 'words.txt'), encoding='utf-8'):
        m = re.match(r'^([A-Z]{3,8})\s+(.+)$', line.strip())
        if m:
            curated.setdefault(m.group(1), m.group(2))

    rows = {}
    for r in csv.DictReader(open(path, encoding='utf-8')):
        w = r['word']
        if not re.fullmatch(r'[a-z]{3,8}', w) or w in BLOCK:
            continue
        tr = r['translation'] or ''
        head = tr.replace('\\n', '\n').split('\n')[0]
        if not tr or BAD_GLOSS.search(head):
            continue
        rank = int(r['frq'] or 0) or int(r['bnc'] or 0)
        if not rank:
            continue
        tier = next((i + 1 for i, x in enumerate(TIERS) if rank <= x), None)
        if tier is None:
            continue
        if not re.search(r'[一-鿿]', short_gloss(tr)):
            continue
        W = w.upper()
        prev = rows.get(W)
        if prev and prev[0] <= tier:
            continue
        rows[W] = (tier, curated.get(W) or short_gloss(tr))

    # 精选词表里有、但 ECDICT 没有排名的词，按最常用一档收录
    for W, g in curated.items():
        rows.setdefault(W, (1, g))

    out = os.path.join(HERE, 'words.tsv')
    with open(out, 'w', encoding='utf-8', newline='\n') as f:
        f.write('# 分级词表：由 tools/build-wordlist.py 从 ECDICT（MIT）生成；单词\t档位(1非常常用-5非常罕见)\t释义\n')
        for W in sorted(rows):
            t, g = rows[W]
            f.write(f'{W}\t{t}\t{g}\n')
    counts = [sum(1 for v in rows.values() if v[0] == t) for t in range(1, 6)]
    print('写入', out, '共', len(rows), '词；各档：', counts)


if __name__ == '__main__':
    main(sys.argv[1])
