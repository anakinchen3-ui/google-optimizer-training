# 本地内容迁移说明

此目录用于存放学习板块的本地内容文件，替代原来的飞书 iframe 嵌入。

## 文件组织规则

```
public/content/
├── foundation/
│   └── foundation-1.md          # 对应「一、了解数字营销与品牌独立站」
├── phase1/
│   ├── search-1.md              # 搜索广告相关文档
│   └── shopping-1.md
├── extra/
│   ├── extra-2.png              # google 分享内容安排（表格截图）
│   └── extra-3.png              # 2025 网站布局培训（PPT截图）
└── README.md                    # 本文件
```

## 迁移步骤

### 1. 文档类（docx）

- 打开飞书文档 → 全选复制内容
- 在对应目录下新建 `.md` 文件
- 粘贴内容并保存
- 修改 `app/learn/data.ts` 中对应节点：
  ```ts
  {
    id: 'foundation-1',
    title: '一、了解数字营销与品牌独立站',
    type: 'docx',
    url: '/content/foundation/foundation-1.md',
    renderAs: 'markdown',
  },
  ```

### 2. 表格 / 幻灯片 / 白板类（sheet / slides）

- 在飞书中截图或导出为图片（推荐 PNG 格式）
- 放入 `public/content/` 对应目录
- 修改 `app/learn/data.ts`：
  ```ts
  {
    id: 'extra-2',
    title: 'google 分享内容安排',
    type: 'sheet',
    url: '/content/extra/extra-2.png',
    renderAs: 'image',
  },
  ```

### 3. HTML 页面

- 如需复杂排版，可写 `.html` 文件
- `renderAs` 设为 `'html'`

## 支持的 renderAs 类型

| 类型 | 说明 |
|------|------|
| `markdown` | 解析并渲染 Markdown 为 HTML |
| `html` | 直接渲染 HTML 内容 |
| `image` | 以图片形式展示 |
| `iframe` | 嵌入外部网页（默认，兼容旧飞书链接） |

## 注意事项

- 不设置 `renderAs` 时，默认走 `iframe` 模式，兼容现有的飞书链接。
- Markdown 支持标准语法：标题、列表、表格、代码块等。
