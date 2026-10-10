# 字页 · Word Pages

书页风格的单词连线小游戏。沿着字母**上下左右**滑动，拼出词表里的单词；每块字砖右上角的小数字是它剩余的使用次数，用完就会消失——把所有单词都写进词表，这一页就读完了。

- **翻页**：完成一页后，右页会像真书一样翻过去
- **幕布**：部分字砖被盖住，找到指定数量的单词后才会揭开
- **提示 / 烟花**：消耗墨水揭示字母，提示还会点亮对应的字砖
- **批注**：词表以外的额外单词会记在页边，奖励墨水
- **每日一页 / 目录 / 我的词典**：每日谜题、章节目录、收录找过的单词与中文释义

纯静态页面，无需构建，直接打开 `index.html` 即可游玩，进度保存在浏览器本地。

## 关卡

`data/levels.js` 中的关卡全部由 [`tools/generate-levels.js`](tools/generate-levels.js) 基于原创词表 [`tools/words.txt`](tools/words.txt) 生成：

```bash
node tools/generate-levels.js
```

### 参考关卡（仅本地）

玩法参考了手游 *Word Tiles*。从其安装包提取的关卡被标记为**参考关卡**，放在 `data/reference/`，已加入 `.gitignore`，不会提交或部署。
在本地（`file://` 或 `localhost`）打开且存在该目录时，可在「设置 → 关卡来源」中切换。提取方式见 [`tools/extract-reference.py`](tools/extract-reference.py)。
