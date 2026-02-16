# Quick Start（1分钟）

适用人群：不写代码，只想快速做一个新视频。

Language: [English](./QUICKSTART.en.md) | [简体中文](./QUICKSTART.md)

## 你只要做这 7 步

1. 打开终端并进入项目
```bash
git clone https://github.com/norahe0304-art/remotion-platform.git
cd remotion-platform
```

2. 运行 workflow 初始化（适配“已有项目”和“新项目”）
```bash
npm run workflow:init
```

3. 如果提示需要创建项目，按 `create-video` 引导完成新项目创建（新用户场景）。

4. 同步最新 Prompt（增量）
```bash
npm run prompts:sync:since
```

5. 打开 Prompt 网页
```bash
npm run prompts:app
```

6. 在网页里点：
- 选来源（官方/社区）
- 点“预览”
- 点“复制 AI 模板”

7. 把模板发给 AI，并补 3 个信息
- 品牌/主题
- 时长
- 目标受众

填写位置：在 AI 对话框里粘贴模板后填写这 3 项。网页只负责筛选和复制，不负责填写。

## 成功标准

- 你能拿到一份可执行的视频实现方案（按 scene 拆分）
- 你知道下一步要准备哪些素材
- 你知道该如何让工程/AI开始生成初版
