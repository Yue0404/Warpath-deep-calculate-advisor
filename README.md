# Warpath 深度计算器

这是一个无需后端服务器的静态网页计算器。页面和计算逻辑由原生 JavaScript ES 模块构成，运行时不需要第三方包；模型、概率和决策参考值来自 `data/` 中的 JSON。构建时会校验模型 ID、游戏版本、配置组、上限、概率行和全部状态覆盖，并在复制期间再次读取数据；若数据在构建中途改变，构建会停止。

## 本地使用

需要 Node.js 20 或更高版本。

```sh
npm test
npm run build
npm run dev -- --port=4173 --base=/calculator/
```

开发服务器会先构建，然后在 `http://localhost:4173/calculator/` 提供 `dist/`。端口可改为其他 `--port` 数值。`--base` 用于模拟项目 Pages 子路径，必须以 `/` 开头或结尾（脚本会自动补齐）。构建产物只包括页面、样式、`src/` 和三份运行时 JSON，不包含离线证据目录 `data/source/`。

## 计算模型与边界

模型目标是让三条等价值属性全部到达 11 品，并最小化期望剩余计算卡。状态按三条品阶排序，因此有 364 种状态。每次无锁计算成本为 5，锁一条成本为 20；看到结果后比较接受与放弃对应的未来期望卡耗，已支付的本次 5 卡视为沉没成本。目标达成时价值为 0。

参考值只计算不锁、三条独立抽取、整组接受或免费放弃且放弃保留原状态的策略；没有把保底或追赶效果放入转移，也没有对锁定策略求 Bellman 最优解。锁定模式下对已出现结果的比较，也仍以不锁后续策略的参考值计算。数据中的“不锁筛选成本低于锁成本”和结果分布一阶随机占优属于模型假设下的推导，不是服务器实现的实机证明。特别是当前品阶是否对应概率索引、三条是否独立均未由客户端表确认。页面应将超出概率表支持范围的结果标成“参考值可比较，但配置概率不支持”。本模型不能代表词条有不同价值、特定词条优先或中间目标的情形。

模型对应游戏版本 657、客户端包版本 14.40.400、runtime 14.40.32 的配置组 40。概率和模型的适用边界见运行时 JSON 与 [验收记录](docs/verification.md)。

## 语言

计算器提供 18 种语言：简体中文、繁体中文、英语、阿拉伯语、法语、德语、印度尼西亚语、意大利语、日语、韩语、马来语、波兰语、葡萄牙语、俄语、西班牙语、泰语、土耳其语和越南语。阿拉伯语界面使用从右向左（RTL）排版。游戏支持语言的信息来源是 [Warpath: Ace Shooter 的 App Store 产品页面](https://apps.apple.com/us/app/warpath-ace-shooter/id1529067679)。

作者：Warpath 钥钥（国际服 UID：35600096）；主页：[哔哩哔哩](https://space.bilibili.com/30300043)。

## GitHub Pages 部署

仓库为 [`Yue0404/Warpath-deep-calculate-advisor`](https://github.com/Yue0404/Warpath-deep-calculate-advisor)。`.github/workflows/pages.yml` 会在针对 `main` 或 `master` 的 PR 上运行测试和构建；合并后推送到这两个分支时部署，也可在 Actions 页面手动运行 `workflow_dispatch`。首次使用时，在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中将来源设为 **GitHub Actions**。部署成功后的预期地址为 [https://yue0404.github.io/Warpath-deep-calculate-advisor/](https://yue0404.github.io/Warpath-deep-calculate-advisor/)。GitHub Pages 为静态托管，不需要自有服务器，公开仓库的站点可供访客打开。

该地址是预期 Pages 地址；只有工作流完成部署后才表示站点已发布。
