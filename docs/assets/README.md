# 字页 · 美术资源

按《美术资源清单.md》生成的书页主皮肤资源。图标可共用于五套皮肤；其他四套皮肤的专用底图未在这包中制作。

## 文件与规格

| 文件 | 规格 / 用途 |
| --- | --- |
| `i-feather.svg`、`i-spark.svg`、`i-notes.svg`、`i-undo.svg`、`i-book.svg`、`i-gear.svg`、`i-close.svg`、`i-lock.svg`、`i-drop.svg` | 24×24 viewBox；无背景；1.6 描边；`currentColor` |
| `icons-sprite.svg` | 上述图标、星标、花饰的 symbol 合集，ID 沿用清单 |
| `i-drop-color.svg`、`i-drop-color.png` | 靛蓝高光货币版本；PNG 144×144，透明 |
| `fleuron.svg`、`fleuron.png` | 花饰；PNG 384×96，金色、透明；SVG 支持换色 |
| `texture-paper.png` | 512×512；纸张与纤维合并 |
| `texture-leather.png` | 512×512；深红皮革 |
| `texture-desk.png` | 1024×1024；深色胡桃木桌面 |
| `book-cover.png` | 1320×1920；完整矩形封面，中央留空，无文字 |
| `tile-normal.png`、`tile-selected.png`、`tile-curtain.png` | 各 288×288，透明背景，无字母 |
| `seal-base.png` | 138×138，透明；火漆按钮底座 |
| `seal-complete.png` | 600×600，透明；朱红完成印章，中心留空 |
| `star-hard.svg` | 难词星标；可用 CSS 设为 `#9b2c22` |
| `app-icon-1024.png`、`app-icon-512.png`、`app-icon-192.png`、`app-icon-180.png`、`app-icon-32.png` | 五档 App 图标；圆角之外透明 |

## 接入

将 `icons-sprite.svg` 的 SVG 内容内联到页面，随后使用：

```html
<svg width="24" height="24" aria-hidden="true">
  <use href="#i-feather"></use>
</svg>
```

父元素的 `color` 可控制图标颜色。以 `<img>` 加载单独的 SVG 时，父页面的 `currentColor` 不会传入，需使用内联 SVG、symbol 或 CSS mask。

纹理使用 `background-repeat: repeat`。封面标题、字砖字母/次数、印章文字由代码叠加。字砖带少量透明边距，九宫格拉伸可从 48px 切片起调，并在目标 40–92px 尺寸下检查边框和阴影。

## 生成与检查

位图采用内置 image_gen 生成，并导出到清单要求尺寸；SVG 为直接制作的矢量资源。完整位图提示词保存在 `generation-prompts.json`。

已检查 PNG 尺寸、透明通道、SVG 解析与渲染，以及三张纹理的 2×2 平铺视觉效果。`asset-manifest.json` 记录每个资源的尺寸、模式与透明信息。封面源图 1039×1513，经尺寸归一化导出为 1320×1920。

`preview.png` 是资源总览；`preview.html` 可查看实际大小的 SVG、纹理平铺和字砖。尚未接入游戏代码，当前目录没有游戏源码。
