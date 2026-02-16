# remotion-platform

Remotion 生产平台（含 Prompt 库、品牌样式、时间轴控制），用于快速做出可交付的新视频。

Language: [English](./README.md) | [简体中文](./README.zh-CN.md)

## 这份 README 是给谁的

- 运营/营销：不会写代码，但要发起一个新视频需求。
- 设计/内容：要选风格、控节奏、改文案。
- 工程/AI 协作：要把需求落成 Remotion 项目并导出。

## 一句话 SOP（新视频场景）

先运行 workflow init -> 选 Prompt -> 复制模板 -> 在 AI 对话框填输入项 -> 生成初版 -> 调音画同步 -> 最终导出。

Quick Start（1分钟）：[EN](./docs/QUICKSTART.en.md) | [ZH](./docs/QUICKSTART.md)

---

## 目录结构（你会用到的）

- `prompts/`: Prompt 索引、同步脚本、网页选择器
- `docs/`: 面向非技术用户的快速手册
- `packages/remotion-controls`: VO 时间轴 / 场景时长 / props schema
- `packages/remotion-styles`: 品牌 token + 动效 token
- `templates/remotion-template-nora`: 新项目模板

---

## 0. 首次准备（一次就好）

```bash
git clone https://github.com/norahe0304-art/remotion-platform.git
cd remotion-platform
npm install
```

工作流统一入口（在本仓库内）：

```bash
npm run workflow:init
```

未来发布后的公共用法：

```bash
npx @nora/remotion-workflow init
```

发布后，终端用户无需克隆整仓库即可使用。

---

## 1. 同步 Prompt 数据（每天增量）

```bash
npm run prompts:sync:since
```

说明：
- `prompts:sync:since` = 增量更新（推荐日常用）
- `prompts:sync` = 全量重抓（源结构变更时用）

---

## 2. 打开“非技术用户网页”

```bash
npm run prompts:app
```

浏览器打开：`http://localhost:4180/app/`

网页内操作：
1. 先选来源（官方 / 社区）。
2. 用标签和关键词筛到合适风格。
3. 点“预览”确认内容。
4. 点“复制 AI 模板”，直接给 Codex/Claude。

---

## 3. 发起“新视频”标准输入（给 AI）

填写位置：把“复制 AI 模板”粘贴到 AI 对话框（Codex / ChatGPT / Claude）里，再在那段文本中填写占位项；不是在网页里填。

把“复制 AI 模板”得到的文本补全这三项：
- 品牌/主题（例如：Pronetx dark-tech）
- 视频时长（例如：60s）
- 主要受众（例如：AWS migration PM）

建议再补：
- 目标平台（X / YouTube / 官网）
- 必须出现的句子（硬性文案）
- 素材路径（logo、icon、bgm、vo）

---

## 4. 创建/接入 Remotion 项目（默认路径）

使用 `workflow init` 时会自动分流：
- 如果当前目录已是 Remotion 项目：直接在当前项目注入 workflow 文件。
- 如果不是：先通过 `create-video` 创建官方 Remotion 项目，再自动注入 workflow 文件。

手动默认路径（需要时）：

```bash
npx create-video@latest my-video
cd my-video
npm install
npm run start
```

然后把你复制的 AI 模板贴给 Codex / ChatGPT / Claude，让它在这个项目里实现。

可选高级路径：
- 如果你团队需要内置品牌 token 和 controls，再用 `templates/remotion-template-nora`。

---

## 5. 生产流程（标准 8 步）

1. 锁定脚本（voText + sceneTexts）
2. 生成 VO（统一音色/语速/音量）
3. 对齐场景时长（scene durations）
4. 做音画同步（voNudges 或 timeline helper）
5. 校验 BGM/VO 混音（避免时大时小）
6. 修过渡呼吸感（避免句子拥挤）
7. 全片复审（逐 scene 听看）
8. 导出成片（1080p + 命名规范）

---

## 6. 质量门槛（出片前必须全过）

- 音画同步：关键句不抢跑、不截断
- 音量一致：VO 不忽大忽小，BGM 不压人声
- 节奏一致：各 scene 有呼吸感，不突兀
- 文案一致：屏幕文案与 VO 逻辑一致
- 视觉一致：品牌色/字体/动效风格统一

---

## 7. 交付物清单（归档）

- 最终视频文件（含版本号）
- VO 文案与时间轴配置
- 使用的 Prompt（来源链接 + 最终模板文本）
- 变更记录（本次和上次差异）

---

## 8. 常见问题（排查）

- `Could not resolve host`: 执行环境 DNS 问题，换本机或沙箱外跑
- `localhost refused to connect`: Studio/preview 进程没起来，重启 dev server
- 图片加载失败：检查 `public` 路径与静态资源 hash
- 句尾被切：延长 scene 或后移转场

---

## 常用命令速查

```bash
# 查看 Prompt 列表
npm run prompts:list

# 搜索 Prompt
npm run prompts:search -- terminal

# 增量同步 Prompt（推荐）
npm run prompts:sync:since

# 全量同步 Prompt
npm run prompts:sync

# 启动 Prompt 网页选择器
npm run prompts:app

# 初始化/接入工作流（自动识别现有项目或新建项目）
npm run workflow:init
```

## 分发模型

- 终端用户（不克隆仓库）：`npx @nora/remotion-workflow init`
- 已有项目：在项目根目录执行同一命令。
- 新项目：CLI 先创建官方 Remotion 项目，再自动初始化 workflow。

---

## 平台模块说明

- `packages/remotion-controls`: shared props schema + VO timeline helpers + duration normalization
- `packages/remotion-styles`: branding tokens + motion tokens + primitives
- `templates/remotion-template-nora`: starter project wired to shared packages
- `prompts`: curated prompt library with attribution + browser app
