快速开始：

```bash
npx skills add mattpocock/skills --skill=wayfinder
```

```bash
npx skills update wayfinder
```

[源码](https://github.com/mattpocock/skills/tree/main/skills/engineering/wayfinder)

## 它的作用

`wayfinder` 将一个对于单个 AI 代理会话而言过于庞大、且笼罩在迷雾之中（从当下到目标的路径尚不可见）的工作任务，在你的 Issue 跟踪器上绘制为一张由**决策卡片**（decision tickets）组成的**共享地图**，然后逐个解决它们，直到前路变得清晰。它**负责规划，不负责执行**：每个 ticket 解决的是一个决策——即需要确定的问题，而非需要执行的构建切片——当在有人真正去构建东西之前不再有任何需要决定的事项时，该地图即告完成——因此它产出的是决策，而非交付物。

## 何时使用它

你可以通过输入 `/wayfinder` 来调用它——AI 代理不会自行主动触发它。

当一项工作**超出单个代理会话所能容纳的范围**且通往其**终点**（destination）的路线依然一片迷雾时使用它——你可以感受到工作的轮廓，但尚无法将其撰写为规范文档（spec）或计划。要将*已经清晰*的讨论转化为 spec，请使用 [to-spec](https://aihero.dev/skills-to-spec)；要将已理解的计划拆分为可构建的 ticket，请使用 [to-tickets](https://aihero.dev/skills-to-tickets)。Wayfinder 位于两者的上游：当迷雾重重无法直接撰写 spec 时，它正是你所需要的工具。

## 前置条件

地图及其 ticket 存放在仓库的 Issue 跟踪器上，因此 wayfinder 需要 [setup-matt-pocock-skills](https://aihero.dev/skills-setup-matt-pocock-skills) 所铺设的跟踪器集成——它会生成一个“Wayfinding 路线规划操作”章节，描述如何在 GitHub、GitLab 或本地 markdown 中表达地图、子 ticket、阻塞依赖和前沿查询。若缺少该文档，wayfinder 默认使用本地 markdown 地图。

## 地图是索引，迷雾即前沿

**地图**（map）是一个单独的 `wayfinder:map` issue，其子 issue 即为具体的 ticket——这是整个团队可以关注的单一共享 URL。它是一个**索引，而非存储库**：每个决策恰好存在于一个地方（其对应的 ticket 中），地图只做摘要和链接，绝不重复表述。会话以低分辨率加载地图，并在需要时放大查看单个 ticket。

在活跃 ticket 之外是**战争迷雾**（fog of war）——你可以预见到即将到来但尚无法锁定的决策。检验某件事是 ticket 还是依然属于迷雾的标准在于你是否*现在就能精准陈述该问题*，而不是你现在能否回答它。解决一个 ticket 会扫清其前方的迷雾，将现在可以规范化的内容**晋级**（graduating）为新的 ticket。**前沿**（frontier）是指开放的、未被阻塞的、未被领取的 ticket——即已知世界的边缘——这正是跟踪器原生阻塞视图所可视化呈现的内容，因此你无需打开地图即可看到哪些任务是可以领取的。迷雾只在朝向**终点**的方向聚集；超越终点的工作会被判定为**超出范围**（out of scope），直接关闭，绝不晋级。

每个 ticket 分为 **HITL**（Human In The Loop 人在回路——如追问盘问、原型设计）或 **AFK**（Agent Alone 代理独立运行——如研究）；HITL ticket 只能通过实时互动来解决，因此代理绝不会自问自答。研究（Research）依然是一个真实的 ticket——下游决策所依附的共享阻塞源——但由于它是 AFK 类型的，会话不会停下来等待阅读：它会触发一个 `/research` **子代理**（subagent）去并行消灭该 ticket，以保持前沿的高效推进，并将发现捕获在临时的 `research/<name>` 分支上。

## 正常工作的标志

- 明确**终点**（destination）是第一步动作——在存在任何 ticket 之前——因为它确定了衡量每个 ticket 范围的基准。
- 一张地图对应一个 `wayfinder:map` issue；ticket 是其子 issue，通过**名称**引用，绝不使用裸露的 `#42`。
- 一个会话**最多解决一个 ticket**（研究类 ticket 除外），将答案记录为解决评论，关闭该 ticket，并在*目前为止的决策*列表中追加一行指针。
- 如果开场的盘问发现**没有迷雾**，它会停止并告诉你该旅程足够小，可以跳过地图。

## 它的位置

`wayfinder` 是一个针对宏大构想的**汇入通道**（on-ramp）：一个过于庞大且迷雾重重而无法在一次会话中写出 spec 的工作会生成一张清除了迷雾的决策地图，然后汇入主构建流程。当迷雾被驱散、前路清晰时，移交给 [to-spec](https://aihero.dev/skills-to-spec) 来规划多会话的构建（或者，如果工作结果证明很小，则直接进行实现）。它依赖 [grilling](https://aihero.dev/skills-grilling) 和 [domain-modeling](https://aihero.dev/skills-domain-modeling) 来解决单个 ticket，并依赖 [prototype](https://aihero.dev/skills-prototype) 和 [research](https://aihero.dev/skills-research) 来处理需要它们的 ticket 类型。当你不确定使用哪个技能或流程时，[ask-matt](https://aihero.dev/skills-ask-matt) 会为你导航。
