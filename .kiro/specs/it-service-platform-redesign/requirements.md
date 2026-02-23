# 需求文档：IT服务平台前端系统重构

## 简介

基于IT服务平台七大核心模块的系统设计文档，对现有Vue 3前端系统进行全面重构与功能补全。系统覆盖首页与资讯、需求悬赏、服务交易、订单管理、互动交流、个人中心、系统管理七大模块，支持普通用户、服务提供方、管理员三种角色，实现需求发布→匹配→交付→结算全链路闭环。现有项目基于Vue 3 + Vite + Ant Design Vue + Pinia技术栈，已有部分页面实现，需要补全缺失页面、重构路由与菜单体系、增强组件复用性。

## 术语表

- **Platform（平台）**: IT服务平台前端系统整体
- **Router（路由系统）**: Vue Router路由配置模块，负责页面导航与权限控制
- **Menu_System（菜单系统）**: 侧边栏与顶部导航菜单配置模块
- **User（普通用户）**: 注册后的默认角色，可浏览资讯、发布需求、购买服务、参与论坛
- **Provider（服务提供方）**: 通过审核升级的角色，可发布服务商品、管理订单、查看交易记录
- **Admin（管理员）**: 系统管理角色，负责审核、用户管理、数据统计等后台管理功能
- **Layout（布局组件）**: 各角色对应的页面框架组件，包含导航栏、侧边栏、内容区
- **Page_Component（页面组件）**: 对应具体路由的Vue单文件组件
- **Business_Component（业务组件）**: 可跨页面复用的业务逻辑组件
- **Store（状态管理）**: Pinia状态管理模块，管理全局与模块级状态
- **API_Module（API模块）**: 封装后端接口调用的模块
- **Bounty（需求悬赏）**: 用户发布的IT服务需求，附带悬赏金额
- **Service_Product（服务商品）**: 服务提供方发布的可购买IT服务
- **Order（订单）**: 服务交易或需求悬赏产生的交易记录
- **Forum_Post（论坛帖子）**: 互动交流模块中用户发布的讨论内容

## 需求

### 需求 1：首页与资讯模块

**用户故事：** 作为普通用户，我希望通过平台首页快速了解平台动态、浏览资讯内容和发现推荐服务，以便高效获取信息和找到所需服务。

#### 验收标准

1. WHEN User访问平台根路径, THE Platform SHALL 展示包含轮播Banner、热门服务推荐、最新资讯列表和平台统计数据的首页
2. WHEN User点击资讯大厅菜单, THE Platform SHALL 展示支持分类筛选、关键词搜索和分页加载的资讯列表页
3. WHEN User点击某条资讯, THE Platform SHALL 导航至资讯详情页，展示资讯标题、正文、发布时间、阅读量和相关推荐
4. THE Platform SHALL 在首页提供服务推荐区域，按热度和评分展示推荐服务卡片
5. WHEN User未登录时访问首页, THE Platform SHALL 允许浏览公开资讯内容，同时展示登录引导

### 需求 2：需求悬赏模块

**用户故事：** 作为普通用户，我希望发布IT服务需求并设置悬赏金额，以便吸引服务提供方响应我的需求。

#### 验收标准

1. WHEN User点击发布悬赏按钮, THE Platform SHALL 展示标准化需求发布表单，包含需求标题、分类、描述、预算范围、截止日期和附件上传字段
2. WHEN User填写需求表单并保存为草稿, THE Platform SHALL 将需求存储至草稿箱，并在需求草稿页展示所有草稿记录
3. WHEN User提交需求发布, THE Platform SHALL 将需求提交审核，并在需求审核结果页展示审核状态（待审核、已通过、已驳回）
4. WHEN User访问需求列表页, THE Platform SHALL 展示所有已发布需求，支持按分类、预算范围、状态进行筛选和排序
5. WHEN User点击某条需求, THE Platform SHALL 导航至需求详情页，展示需求完整信息、响应列表和当前状态
6. WHILE 需求处于已发布状态, THE Platform SHALL 允许服务提供方提交响应方案
7. IF User提交的需求内容不符合平台规范, THEN THE Platform SHALL 在审核结果页展示驳回原因并允许修改后重新提交

### 需求 3：服务交易模块

**用户故事：** 作为服务提供方，我希望发布和管理服务商品，以便用户能够发现并购买我的服务。

#### 验收标准

1. WHEN Provider点击创建服务按钮, THE Platform SHALL 展示服务商品发布表单，包含服务名称、分类、描述、定价、服务周期、交付标准和封面图片字段
2. WHEN Provider编辑已有服务, THE Platform SHALL 在服务编辑页加载现有服务数据并允许修改
3. WHEN Provider提交服务发布, THE Platform SHALL 将服务提交审核，并在审核结果页展示审核状态
4. WHEN User访问服务列表页, THE Platform SHALL 展示所有已上架服务，支持按分类、价格区间、评分进行筛选和排序
5. WHEN User点击某个服务, THE Platform SHALL 导航至服务详情页，展示服务完整信息、提供方信息、用户评价和购买按钮
6. WHEN User点击购买按钮, THE Platform SHALL 导航至服务购买/支付页，展示订单确认信息和支付方式选择
7. IF 服务审核未通过, THEN THE Platform SHALL 在审核结果页展示驳回原因并允许Provider修改后重新提交

### 需求 4：订单管理模块

**用户故事：** 作为用户和服务提供方，我希望管理交易订单的全生命周期，以便跟踪服务交付进度和处理交易纠纷。

#### 验收标准

1. WHEN User访问我的订单页, THE Platform SHALL 展示用户版订单列表，支持按订单状态（待支付、进行中、待验收、已完成、已取消、申诉中）筛选
2. WHEN Provider访问订单管理页, THE Platform SHALL 展示服务商版订单列表，支持按订单状态筛选和批量操作
3. WHEN User或Provider点击某个订单, THE Platform SHALL 导航至订单详情页，展示订单完整信息和操作按钮
4. WHILE 订单处于进行中状态, THE Platform SHALL 在订单详情页提供交付物上传功能供Provider使用
5. WHILE 订单处于待验收状态, THE Platform SHALL 在订单详情页提供验收通过和验收拒绝操作供User使用
6. WHEN User对订单发起申诉, THE Platform SHALL 导航至申诉页面，允许User填写申诉原因和上传证据
7. WHEN Admin处理申诉, THE Platform SHALL 在仲裁页面展示双方证据并提供仲裁操作
8. WHEN User或Provider访问交易记录页, THE Platform SHALL 展示交易流水列表，支持按时间范围查询和导出为Excel文件

### 需求 5：互动交流模块

**用户故事：** 作为普通用户，我希望在论坛中发布帖子、参与讨论和关注其他用户，以便与社区成员交流技术经验。

#### 验收标准

1. WHEN User访问论坛首页, THE Platform SHALL 展示论坛板块分类、热门帖子和最新帖子列表
2. WHEN User点击发布帖子按钮, THE Platform SHALL 展示帖子发布表单，包含标题、板块选择、正文编辑器和标签字段
3. WHEN User访问帖子列表页, THE Platform SHALL 展示指定板块下的帖子列表，支持按热度、最新、精华进行排序
4. WHEN User点击某个帖子, THE Platform SHALL 导航至帖子详情页，展示帖子内容、评论列表和点赞/收藏操作
5. WHEN User访问我的帖子页, THE Platform SHALL 展示当前用户发布的所有帖子
6. WHEN User访问我的收藏页, THE Platform SHALL 展示当前用户收藏的帖子和服务
7. WHEN User访问我的点赞页, THE Platform SHALL 展示当前用户点赞过的帖子
8. WHEN User访问关注列表页, THE Platform SHALL 展示当前用户关注的其他用户列表
9. WHEN User访问粉丝列表页, THE Platform SHALL 展示关注当前用户的粉丝列表

### 需求 6：个人中心模块

**用户故事：** 作为注册用户，我希望管理个人信息、账号安全和平台偏好设置，以便维护账号状态和获取个性化体验。

#### 验收标准

1. WHEN User访问个人信息页, THE Platform SHALL 展示并允许编辑用户头像、昵称、简介、联系方式等基本信息
2. WHEN User访问账号安全页, THE Platform SHALL 提供修改密码、绑定手机号、绑定邮箱功能
3. WHEN User访问角色申请页, THE Platform SHALL 展示服务提供方角色申请表单，包含资质证明、服务领域和个人简介字段
4. WHILE User的角色申请处于审核中状态, THE Platform SHALL 在角色申请页展示审核进度
5. WHEN User访问消息通知页, THE Platform SHALL 展示系统通知、订单通知、互动通知的分类消息列表
6. WHEN User访问我的订阅页, THE Platform SHALL 展示用户订阅的服务分类和关注的服务提供方列表
7. WHEN User访问隐私设置页, THE Platform SHALL 提供个人信息可见性、消息接收偏好等隐私配置选项
8. IF User提交的角色申请审核通过, THEN THE Platform SHALL 将用户角色升级为Provider并更新导航菜单

### 需求 7：系统管理模块（管理员专属）

**用户故事：** 作为管理员，我希望通过后台管理系统审核内容、管理用户和监控平台运营数据，以便维护平台秩序和运营质量。

#### 验收标准

1. WHEN Admin访问审核中心, THE Platform SHALL 展示待审核内容的统一列表，包含需求审核、服务审核、文章审核和论坛帖子审核，支持按类型筛选
2. WHEN Admin访问用户管理页, THE Platform SHALL 展示用户列表，支持搜索、筛选、查看详情、禁用/启用账号操作
3. WHEN Admin访问角色权限分配页, THE Platform SHALL 展示角色列表和对应权限配置，允许创建角色和分配权限
4. WHEN Admin访问数据统计分析页, THE Platform SHALL 展示平台核心运营指标，包含用户增长趋势、订单量统计、交易额统计和服务分类分布图表
5. WHEN Admin访问系统日志页, THE Platform SHALL 展示操作日志列表，支持按时间范围、操作类型和操作人进行筛选
6. WHEN Admin访问公告管理页, THE Platform SHALL 提供公告的创建、编辑、发布、下架和删除功能
7. WHEN Admin访问论坛板块管理页, THE Platform SHALL 提供论坛板块的创建、编辑、排序和启用/禁用功能

### 需求 8：路由与导航体系重构

**用户故事：** 作为开发者，我希望路由配置和菜单体系与七大模块设计完全对齐，以便系统导航结构清晰且易于维护。

#### 验收标准

1. THE Router SHALL 为七大模块的所有页面配置对应路由，路由路径遵循 `/角色/模块/功能` 的命名规范
2. THE Router SHALL 对每个路由配置正确的角色权限元信息（meta.role），确保User路由允许user和provider角色访问，Provider路由仅允许provider角色访问，Admin路由仅允许admin角色访问
3. THE Menu_System SHALL 为三种角色分别配置完整的侧边栏菜单，菜单项与路由一一对应
4. WHEN User角色升级为Provider, THE Menu_System SHALL 动态切换至Provider菜单布局
5. THE Router SHALL 对所有需要认证的路由配置路由守卫，未登录用户访问受保护路由时重定向至登录页
6. IF User访问无权限的路由, THEN THE Router SHALL 重定向至403权限不足页面

### 需求 9：组件化与复用性设计

**用户故事：** 作为开发者，我希望系统具有良好的组件化设计和高复用性，以便减少重复代码并提升开发效率。

#### 验收标准

1. THE Platform SHALL 将列表筛选、分页、搜索框、空状态、加载动画等通用UI封装为公共组件，存放于 `src/components/common/` 目录
2. THE Platform SHALL 将服务卡片、订单卡片、文章卡片、用户头像、富文本编辑器、图片上传、评论列表等业务组件封装为可复用组件，存放于 `src/components/business/` 目录
3. THE Platform SHALL 为每个核心模块创建独立的Pinia Store模块，存放于 `src/stores/` 目录
4. THE Platform SHALL 为每个核心模块创建独立的API接口模块，存放于 `src/api/` 目录
5. THE Platform SHALL 确保三种角色的Layout组件结构统一，均包含顶部导航栏、侧边菜单栏、面包屑导航和主内容区域

### 需求 10：缺失页面补全

**用户故事：** 作为开发者，我希望补全现有系统中缺失的页面组件，以便系统功能覆盖七大模块设计文档的所有页面。

#### 验收标准

1. THE Platform SHALL 创建需求草稿页（`BountyDraft.vue`），展示用户保存的需求草稿列表
2. THE Platform SHALL 创建需求审核结果页（`BountyAuditResult.vue`），展示需求的审核状态和驳回原因
3. THE Platform SHALL 创建服务购买/支付页（`ServicePurchase.vue`），展示订单确认和支付方式选择
4. THE Platform SHALL 创建服务审核结果页（`ServiceAuditResult.vue`），展示服务商品的审核状态
5. THE Platform SHALL 创建订单交付页（`OrderDelivery.vue`），供Provider上传交付物
6. THE Platform SHALL 创建订单验收页（`OrderAcceptance.vue`），供User确认验收结果
7. THE Platform SHALL 创建订单申诉页（`OrderAppeal.vue`），供User填写申诉信息
8. THE Platform SHALL 创建订单仲裁页（`OrderArbitration.vue`），供Admin进行仲裁处理
9. THE Platform SHALL 创建交易记录查询/导出页（`TransactionHistory.vue`），支持User和Provider查看交易流水
10. THE Platform SHALL 创建我的帖子页（`MyPosts.vue`）、我的点赞页（`MyLikes.vue`），补全互动交流模块
11. THE Platform SHALL 创建账号安全页（`AccountSecurity.vue`）、角色申请页（`RoleApplication.vue`）、我的订阅页（`Subscriptions.vue`）、隐私设置页（`PrivacySettings.vue`），补全个人中心模块
12. THE Platform SHALL 创建需求审核页（`BountyReview.vue`）和论坛板块管理页（`ForumSectionManage.vue`），补全管理员系统管理模块
13. THE Platform SHALL 创建403权限不足错误页面（`403.vue`）
