# 实现计划：IT服务平台前端系统重构

## 概述

基于设计文档，按模块递进方式实现：先搭建基础设施（公共组件、API模块、Store模块、路由配置），再逐模块实现页面组件，最后完成集成与增强。所有代码基于 Vue 3 + Vite + Ant Design Vue + Pinia 技术栈，使用 JavaScript。

## Tasks

- [x] 1. 搭建公共组件库（src/components/common/）
  - [x] 1.1 创建 SearchFilter 搜索筛选栏组件
    - 实现通用搜索+筛选组合组件，支持 input/select/range/date 四种筛选类型
    - Props: `filters`（筛选项配置数组）、`defaultValues`（默认值）
    - Events: `search(params)`、`reset()`
    - _需求: 9.1_

  - [x] 1.2 创建 PaginationWrapper 分页包装器组件
    - 封装 Ant Design `a-pagination`，统一分页参数和样式
    - Props: `total`、`current`、`pageSize`
    - Events: `change(page, pageSize)`
    - _需求: 9.1_

  - [x] 1.3 创建 EmptyState 空状态组件
    - 统一空数据展示，支持自定义描述、图片和操作按钮
    - Props: `description`、`image`、`showAction`
    - _需求: 9.1_

  - [x] 1.4 创建 LoadingSpinner 加载动画组件
    - 封装 `a-spin`，统一加载状态展示
    - _需求: 9.1_

  - [x] 1.5 创建 ImageUpload 图片上传组件
    - 支持裁剪、预览、多图上传
    - Props: `maxCount`、`maxSize`、`accept`、`action`
    - Events: `change(fileList)`、`success(file)`
    - _需求: 9.1_

  - [x] 1.6 创建 RichTextEditor 富文本编辑器组件
    - 基于 textarea 的 Markdown 编辑器，支持工具栏和预览
    - Props: `modelValue`（v-model）、`placeholder`、`maxLength`、`rows`
    - _需求: 9.1_

- [x] 2. 搭建业务组件库（src/components/business/）
  - [x] 2.1 创建 ServiceCard 服务卡片组件
    - 支持 grid/list 两种展示模式，展示服务封面、标题、价格、评分、标签
    - Props: `service`、`mode`；Events: `click(id)`
    - _需求: 9.2_

  - [x] 2.2 创建 OrderCard 订单卡片组件
    - 根据角色（user/provider/admin）展示不同操作按钮
    - Props: `order`、`role`；Events: `click(id)`、`action(type, id)`
    - _需求: 9.2_

  - [x] 2.3 创建 ArticleCard 文章/资讯卡片组件
    - 展示文章标题、摘要、封面、作者、时间、浏览量
    - Props: `article`、`showCover`；Events: `click(id)`
    - _需求: 9.2_

  - [x] 2.4 创建 BountyCard 悬赏卡片组件
    - 展示悬赏标题、预算、截止日期、状态、技能标签、响应数
    - Props: `bounty`；Events: `click(id)`
    - _需求: 9.2_

  - [x] 2.5 创建 UserAvatar 用户头像组件
    - 展示用户头像和昵称，支持不同尺寸
    - _需求: 9.2_

  - [x] 2.6 创建 CommentList 评论列表组件
    - 支持评论展示、回复、点赞、删除
    - Props: `comments`、`loading`、`allowReply`
    - Events: `submit(content, parentId)`、`like(commentId)`、`delete(commentId)`
    - _需求: 9.2_

  - [x] 2.7 创建 StatusTag 状态标签组件
    - 根据业务类型（order/bounty/service/audit）和状态值自动匹配颜色
    - Props: `status`、`type`
    - _需求: 9.2_

  - [x] 2.8 创建 AuditResultPanel 审核结果面板组件
    - 展示审核状态（pending/approved/rejected）、驳回原因、审核时间
    - Props: `status`、`reason`、`auditTime`、`allowResubmit`
    - Events: `resubmit()`
    - _需求: 9.2_

- [x] 3. 检查点 - 公共组件与业务组件
  - 确保所有组件可正常导入和渲染，ask the user if questions arise.

- [x] 4. 创建 API 接口模块（src/api/）
  - [x] 4.1 创建 service.js 服务交易 API 模块
    - 实现 getServiceList、getServiceDetail、createService、updateService、deleteService、purchaseService
    - 统一使用 `src/utils/request.js` 的 Axios 实例
    - _需求: 9.4_

  - [x] 4.2 创建 order.js 订单管理 API 模块
    - 实现 getOrderList、getOrderDetail、createOrder、deliverOrder、acceptOrder、rejectOrder、appealOrder、arbitrateOrder、getTransactions、exportTransactions
    - _需求: 9.4_

  - [x] 4.3 创建 news.js 资讯 API 模块
    - 实现 getNewsList、getNewsDetail、getLatestNews
    - _需求: 9.4_

  - [x] 4.4 创建 forum.js 论坛 API 模块
    - 实现 getSections、getPostList、getPostDetail、createPost、likePost、favoritePost、getMyPosts、getMyLikes
    - _需求: 9.4_

  - [x] 4.5 创建 user.js 用户/个人中心 API 模块
    - 实现 getProfile、updateProfile、changePassword、bindPhone、bindEmail、applyRole、getMessages、markAsRead、getSubscriptions、updatePrivacySettings
    - _需求: 9.4_

  - [x] 4.6 创建 admin.js 管理员 API 模块
    - 实现 getDashboardData、reviewContent、getStatistics、getLogs、manageAnnouncement、manageForumSection
    - _需求: 9.4_

  - [x] 4.7 创建 common.js 公共 API 模块
    - 实现文件上传、全局搜索等公共接口
    - _需求: 9.4_

- [x] 5. 创建 Pinia Store 模块（src/stores/）
  - [x] 5.1 创建 auth.js 认证状态 Store
    - State: token、userInfo
    - Getters: isAuthenticated、userRole、userId
    - Actions: login、logout、refreshUserInfo、updateRole
    - _需求: 9.3_

  - [x] 5.2 创建 bounty.js 悬赏模块 Store
    - State: bountyList、currentBounty、drafts、filters、pagination、loading
    - Actions: fetchBountyList、fetchBountyDetail、createBounty、saveDraft、fetchDrafts、deleteDraft、bidBounty
    - _需求: 9.3_

  - [x] 5.3 创建 service.js 服务模块 Store
    - State: serviceList、currentService、filters、pagination、loading
    - Actions: fetchServiceList、fetchServiceDetail、createService、updateService、purchaseService
    - _需求: 9.3_

  - [x] 5.4 创建 order.js 订单模块 Store
    - State: orderList、currentOrder、statusFilter、pagination、loading
    - Actions: fetchOrderList、fetchOrderDetail、createOrder、deliverOrder、acceptOrder、rejectOrder、appealOrder、arbitrateOrder、fetchTransactions、exportTransactions
    - _需求: 9.3_

  - [x] 5.5 创建 forum.js 论坛模块 Store
    - State: sections、postList、currentPost、myPosts、myLikes、hotPosts、pagination、loading
    - Actions: fetchSections、fetchPostList、fetchPostDetail、createPost、likePost、favoritePost、fetchMyPosts、fetchMyLikes
    - _需求: 9.3_

  - [x] 5.6 创建 user.js 用户/个人中心 Store
    - State: profile、messages、unreadCount、subscriptions、privacySettings、roleApplication
    - Actions: fetchProfile、updateProfile、changePassword、bindPhone、bindEmail、applyRole、fetchMessages、markAsRead、fetchSubscriptions、updatePrivacySettings
    - _需求: 9.3_

  - [x] 5.7 创建 news.js 资讯模块 Store
    - State: newsList、currentNews、categories、filters、pagination、loading
    - Actions: fetchNewsList、fetchNewsDetail、fetchLatestNews
    - _需求: 9.3_

  - [x] 5.8 创建 admin.js 管理员模块 Store
    - State: pendingReviews、statistics、logs、announcements、forumSections
    - Actions: fetchDashboardData、reviewContent、fetchStatistics、fetchLogs、manageAnnouncement、manageForumSection
    - _需求: 9.3_

- [x] 6. 检查点 - API 与 Store 模块
  - 确保所有 API 模块和 Store 模块可正常导入，Store actions 正确调用对应 API，ask the user if questions arise.

- [x] 7. 实现首页与资讯模块页面（需求1）
  - [x] 7.1 重构 Home.vue 首页
    - 独立全屏布局：顶部导航栏 → 轮播Banner → 平台统计 → 热门服务推荐 → 最新资讯 → 页脚
    - 已登录用户显示头像和快捷入口，未登录用户显示登录引导
    - 调用 newsStore.fetchLatestNews() 和 serviceStore.fetchServiceList() 获取推荐数据
    - 复用 ServiceCard（热门服务）、ArticleCard（最新资讯）
    - _需求: 1.1, 1.4, 1.5_

  - [ ]* 7.2 编写 Property 12 属性测试：首页服务推荐排序
    - **Property 12: 首页推荐排序**
    - 生成随机服务数据集，验证排序函数输出符合热度+评分降序规则
    - **验证: 需求 1.4**

  - [x] 7.3 增强 NewsList.vue 资讯列表页
    - 顶部搜索筛选栏 + 分类标签栏 + 资讯列表 + 分页
    - 复用 SearchFilter、ArticleCard、PaginationWrapper
    - 接入 newsStore.fetchNewsList()
    - _需求: 1.2_

  - [x] 7.4 增强 NewsDetail.vue 资讯详情页
    - 文章标题区 → 作者信息栏 → 正文内容（Markdown渲染）→ 相关推荐
    - 展示标题、正文、发布时间、阅读量、作者信息
    - 复用 ArticleCard（相关推荐）
    - _需求: 1.3_

  - [ ]* 7.5 编写 Property 2 属性测试：详情页信息完整性（资讯部分）
    - **Property 2: 详情页信息完整性**
    - 生成随机资讯数据，验证详情渲染包含标题、正文、发布时间、阅读量
    - **验证: 需求 1.3**

- [x] 8. 实现需求悬赏模块页面（需求2）
  - [x] 8.1 增强 BountyList.vue 悬赏列表页
    - 搜索筛选栏 + 悬赏列表 + 分页
    - 筛选：分类、预算范围（Slider）、状态、排序
    - 复用 SearchFilter、BountyCard、PaginationWrapper
    - 接入 bountyStore.fetchBountyList()
    - _需求: 2.4_

  - [x] 8.2 创建 BountyDraft.vue 需求草稿页（新增）
    - 草稿列表表格：标题、分类、保存时间、操作列
    - 操作：继续编辑（跳转 CreateBounty 加载草稿）、删除草稿
    - 接入 bountyStore.fetchDrafts()、bountyStore.deleteDraft()
    - 复用 EmptyState、PaginationWrapper
    - _需求: 2.2, 10.1_

  - [ ]* 8.3 编写 Property 3 属性测试：草稿保存与恢复的往返一致性
    - **Property 3: 草稿往返一致性**
    - 生成随机表单数据，序列化后反序列化应得到等价数据
    - **验证: 需求 2.2**

  - [x] 8.4 创建 BountyAuditResult.vue 需求审核结果页（新增）
    - 审核状态面板 + 需求摘要 + 操作按钮
    - 待审核（蓝色进度）、已通过（绿色成功）、已驳回（红色警告+驳回原因）
    - 已驳回时显示"修改后重新提交"按钮
    - 复用 AuditResultPanel
    - _需求: 2.3, 2.7, 10.2_

  - [ ]* 8.5 编写 Property 6 属性测试：审核状态一致性
    - **Property 6: 审核状态一致性**
    - 生成随机审核状态，验证展示逻辑与实际状态匹配
    - **验证: 需求 2.3, 3.3**

  - [x] 8.6 增强 BountyDetail.vue 悬赏详情页
    - 悬赏信息头部 → 需求详情 → 响应列表/投标区域 → 操作按钮
    - 发布者视角：查看响应列表、选择中标者
    - 服务商视角：提交响应方案
    - 复用 StatusTag、CommentList
    - _需求: 2.5, 2.6_

  - [ ]* 8.7 编写 Property 7 属性测试：状态依赖的操作可用性（悬赏部分）
    - **Property 7: 状态依赖操作可用性**
    - 生成随机悬赏状态，验证操作按钮集合与状态规则匹配
    - **验证: 需求 2.6**

- [x] 9. 实现服务交易模块页面（需求3）
  - [x] 9.1 增强 ServiceDetail.vue 服务详情页
    - 服务封面+基本信息 → 详细描述 → 提供方信息 → 用户评价 → 购买按钮
    - 购买按钮跳转至 ServicePurchase 页面
    - 复用 CommentList（用户评价）、StatusTag
    - _需求: 3.5_

  - [x] 9.2 创建 ServicePurchase.vue 服务购买/支付页（新增）
    - 订单确认区（服务信息摘要、数量、总价）→ 支付方式选择 → 确认支付按钮
    - 支付方式：支付宝、微信支付、余额支付（Radio选择）
    - 从路由参数获取 serviceId，调用 serviceStore 加载服务信息
    - 提交调用 orderStore.createOrder()
    - _需求: 3.6, 10.3_

  - [x] 9.3 创建 ServiceAuditResult.vue 服务审核结果页（新增）
    - 与 BountyAuditResult 类似，展示服务审核状态
    - 复用 AuditResultPanel
    - _需求: 3.3, 3.7, 10.4_

  - [ ]* 9.4 编写 Property 4 属性测试：服务编辑数据预填充的往返一致性
    - **Property 4: 服务编辑预填充往返一致性**
    - 生成随机服务数据，验证编辑页预填充逻辑的正确性
    - **验证: 需求 3.2**

- [x] 10. 检查点 - 首页、悬赏、服务模块
  - 确保所有新增和增强页面可正常渲染，路由跳转正确，ask the user if questions arise.

- [x] 11. 实现订单管理模块页面（需求4）
  - [x] 11.1 增强 OrderList.vue 用户订单列表页
    - 状态标签页（Tab切换：全部/待支付/进行中/待验收/已完成/已取消/申诉中）+ 订单列表
    - 复用 OrderCard、PaginationWrapper、StatusTag
    - 接入 orderStore.fetchOrderList('user')
    - _需求: 4.1_

  - [x] 11.2 增强 OrderManage.vue 服务商订单管理页
    - 与用户订单列表类似，增加批量操作功能（批量确认接单、批量标记发货）
    - 复用 OrderCard、SearchFilter、PaginationWrapper
    - _需求: 4.2_

  - [x] 11.3 增强 OrderDetail.vue 订单详情页（用户端和服务商端）
    - 订单状态进度条（a-steps）→ 订单基本信息 → 服务/需求信息 → 交付物区域 → 操作按钮
    - 根据订单状态和角色动态显示操作按钮
    - _需求: 4.3_

  - [x] 11.4 创建 OrderDelivery.vue 订单交付页（新增，Provider端）
    - 订单信息摘要 → 交付物上传区域 → 交付说明 → 提交按钮
    - 支持多文件上传（代码、文档、设计稿等）
    - 复用 ImageUpload（扩展为文件上传）
    - 接入 orderStore.deliverOrder()
    - _需求: 4.4, 10.5_

  - [x] 11.5 创建 OrderAcceptance.vue 订单验收页（新增，User端）
    - 订单信息 → 交付物查看/下载 → 验收评分（a-rate）→ 验收通过/拒绝按钮
    - 拒绝时需填写拒绝原因
    - 接入 orderStore.acceptOrder() / orderStore.rejectOrder()
    - _需求: 4.5, 10.6_

  - [x] 11.6 创建 OrderAppeal.vue 订单申诉页（新增，User端）
    - 订单信息摘要 → 申诉类型选择 → 申诉原因描述 → 证据上传 → 提交按钮
    - 申诉类型：服务质量不达标、未按时交付、沟通问题、其他
    - 复用 ImageUpload、RichTextEditor
    - 接入 orderStore.appealOrder()
    - _需求: 4.6, 10.7_

  - [x] 11.7 创建 OrderArbitration.vue 订单仲裁页（新增，Admin端）
    - 订单信息 → 买方证据 → 卖方证据 → 仲裁意见 → 仲裁结果选择
    - 仲裁结果：支持买方（退款）、支持卖方（放款）、部分退款
    - 复用 RichTextEditor
    - 接入 orderStore.arbitrateOrder()
    - _需求: 4.7, 10.8_

  - [x] 11.8 创建 TransactionHistory.vue 交易记录查询/导出页（新增）
    - 时间范围选择 + 交易类型筛选 + 交易流水表格 + 导出按钮
    - 使用 xlsx 库导出为 Excel 文件
    - 复用 SearchFilter、PaginationWrapper
    - 接入 orderStore.fetchTransactions() / orderStore.exportTransactions()
    - _需求: 4.8, 10.9_

  - [ ]* 11.9 编写 Property 1 属性测试：列表筛选结果一致性
    - **Property 1: 列表筛选结果一致性**
    - 生成随机筛选条件和数据集，验证筛选函数返回的结果都满足条件
    - **验证: 需求 2.4, 3.4, 4.1, 4.2, 5.3, 7.1, 7.2, 7.5, 4.8**

  - [ ]* 11.10 编写 Property 7 属性测试：状态依赖的操作可用性（订单部分）
    - **Property 7: 状态依赖操作可用性（订单）**
    - 生成随机订单状态和角色组合，验证操作按钮集合与状态规则匹配
    - **验证: 需求 4.4, 4.5**

- [x] 12. 检查点 - 订单管理模块
  - 确保订单全生命周期页面（列表→详情→交付→验收→申诉→仲裁→交易记录）流程完整，ask the user if questions arise.

- [x] 13. 实现互动交流模块页面（需求5）
  - [x] 13.1 增强 ForumHome.vue 论坛首页
    - 板块分类导航 + 热门帖子轮播 + 最新帖子列表
    - 板块分类使用 a-tabs 或卡片网格
    - 复用 SearchFilter
    - 接入 forumStore.fetchSections()、forumStore.fetchPostList()
    - _需求: 5.1_

  - [x] 13.2 增强 PostDetail.vue 帖子详情页
    - 帖子标题+作者信息 → 帖子正文 → 点赞/收藏操作栏 → 评论列表
    - 复用 CommentList、UserAvatar
    - 接入 forumStore.fetchPostDetail()、forumStore.likePost()、forumStore.favoritePost()
    - _需求: 5.4_

  - [x] 13.3 创建 MyPosts.vue 我的帖子页（新增）
    - 帖子列表表格：标题、板块、发布时间、浏览量、评论数、操作列
    - 操作：编辑、删除
    - 复用 PaginationWrapper、EmptyState
    - 接入 forumStore.fetchMyPosts()
    - _需求: 5.5, 10.10_

  - [x] 13.4 创建 MyLikes.vue 我的点赞页（新增）
    - 点赞帖子列表：帖子标题、作者、点赞时间
    - 操作：取消点赞、查看帖子
    - 复用 PaginationWrapper、EmptyState
    - 接入 forumStore.fetchMyLikes()
    - _需求: 5.7, 10.10_

  - [x] 13.5 增强 Favorites.vue 我的收藏页
    - 增加标签页切换：收藏的帖子 / 收藏的服务
    - 复用 ServiceCard、PaginationWrapper
    - _需求: 5.6_

  - [ ]* 13.6 编写 Property 8 属性测试：用户数据隔离
    - **Property 8: 用户数据隔离**
    - 生成随机用户ID和数据集，验证过滤函数只返回属于该用户的数据
    - **验证: 需求 5.5, 5.6, 5.7, 5.8, 5.9**

- [x] 14. 实现个人中心模块页面（需求6）
  - [x] 14.1 创建 AccountSecurity.vue 账号安全页（新增）
    - 安全设置列表：修改密码、绑定手机号、绑定邮箱
    - 每项使用 a-list-item 展示，点击展开操作表单
    - 接入 userStore.changePassword()、userStore.bindPhone()、userStore.bindEmail()
    - _需求: 6.2, 10.11_

  - [x] 14.2 创建 RoleApplication.vue 角色申请页（新增）
    - 未申请：服务提供方权益说明 + 申请表单（资质证明上传、服务领域选择、个人简介）
    - 审核中：展示审核进度
    - 已通过：展示通过信息，引导切换至 Provider 面板
    - 已驳回：展示驳回原因，允许重新申请
    - 复用 ImageUpload、AuditResultPanel
    - 接入 userStore.applyRole()
    - _需求: 6.3, 6.4, 6.8, 10.11_

  - [ ]* 14.3 编写 Property 13 属性测试：角色升级后菜单切换
    - **Property 13: 角色升级菜单切换**
    - 模拟角色变更，验证菜单配置切换正确
    - **验证: 需求 6.8**

  - [x] 14.4 增强 Messages.vue 消息通知页
    - 增加消息分类标签页：系统通知 / 订单通知 / 互动通知
    - 每条消息：标题、内容摘要、时间、已读/未读状态
    - 操作：标记已读、全部已读、删除
    - 接入 userStore.fetchMessages()、userStore.markAsRead()
    - _需求: 6.5_

  - [ ]* 14.5 编写 Property 14 属性测试：消息分类正确性
    - **Property 14: 消息分类正确性**
    - 生成随机消息数据，验证分类函数归类正确
    - **验证: 需求 6.5**

  - [x] 14.6 创建 Subscriptions.vue 我的订阅页（新增）
    - 订阅分类标签页：订阅的服务分类 / 关注的服务提供方
    - 复用 UserAvatar、PaginationWrapper
    - 接入 userStore.fetchSubscriptions()
    - _需求: 6.6, 10.11_

  - [x] 14.7 创建 PrivacySettings.vue 隐私设置页（新增）
    - 隐私配置列表：个人信息可见性（Radio）、消息接收偏好（Checkbox）、是否允许被搜索（Switch）、是否显示在线状态（Switch）
    - 使用 a-form 表单，底部保存按钮
    - 接入 userStore.updatePrivacySettings()
    - _需求: 6.7, 10.11_

  - [ ]* 14.8 编写 Property 5 属性测试：个人信息编辑的往返一致性
    - **Property 5: 个人信息编辑往返一致性**
    - 生成随机用户信息，更新后重新获取应一致
    - **验证: 需求 6.1**

- [x] 15. 检查点 - 互动交流与个人中心模块
  - 确保论坛和个人中心所有页面可正常渲染和交互，ask the user if questions arise.

- [x] 16. 实现系统管理模块页面（需求7，管理员专属）
  - [x] 16.1 增强 Dashboard.vue 管理后台首页
    - 增加审核待办数量提示
    - 接入 adminStore.fetchDashboardData()
    - _需求: 7.1_

  - [x] 16.2 增强 ArticleReview.vue 审核中心
    - 增加统一审核入口，支持按类型筛选（需求/服务/文章/帖子）
    - 复用 SearchFilter、StatusTag
    - _需求: 7.1_

  - [x] 16.3 创建 BountyReview.vue 需求审核页（新增）
    - 待审核需求列表 + 审核详情弹窗
    - 审核操作：通过、驳回（需填写驳回原因）
    - 复用 SearchFilter、PaginationWrapper
    - 接入 adminStore.reviewContent('bounty', ...)
    - _需求: 7.1, 10.12_

  - [x] 16.4 增强 RoleManage.vue 角色权限分配页
    - 增加权限配置功能：角色列表 + 权限树形选择
    - _需求: 7.3_

  - [x] 16.5 增强 Statistics.vue 数据统计分析页
    - 增加 ECharts 图表：用户增长趋势（折线图）、订单量统计（柱状图）、交易额统计（面积图）、服务分类分布（饼图）
    - 接入 adminStore.fetchStatistics()
    - _需求: 7.4_

  - [x] 16.6 增强 Announcements.vue 公告管理页
    - 增加公告创建/编辑弹窗、发布/下架/删除操作
    - 接入 adminStore.manageAnnouncement()
    - _需求: 7.6_

  - [x] 16.7 创建 ForumSectionManage.vue 论坛板块管理页（新增）
    - 板块列表表格 + 创建/编辑弹窗
    - 表格列：板块名称、描述、排序、帖子数、状态、操作
    - 操作：创建、编辑、排序（拖拽排序）、启用/禁用
    - 复用 SearchFilter
    - 接入 adminStore.manageForumSection()
    - _需求: 7.7, 10.12_

  - [ ]* 16.8 编写 Property 15 属性测试：管理员内容管理往返一致性
    - **Property 15: 管理员内容管理往返一致性**
    - 生成随机公告/板块数据，验证 CRUD 往返一致性
    - **验证: 需求 7.6, 7.7**

- [x] 17. 重构路由与导航体系（需求8）
  - [x] 17.1 重构公共路由 router/modules/router.js
    - 配置首页、登录、注册、403 路由
    - 路由路径遵循命名规范
    - _需求: 8.1_

  - [x] 17.2 重构用户路由 router/modules/user.js
    - 配置资讯、悬赏、服务、订单、论坛、文章、个人中心完整路由表
    - 所有路由配置 meta.role: ['user', 'provider']
    - 包含所有新增页面路由（BountyDraft、BountyAuditResult、ServicePurchase、OrderAcceptance、OrderAppeal、TransactionHistory、MyPosts、MyLikes、AccountSecurity、RoleApplication、Subscriptions、PrivacySettings）
    - _需求: 8.1, 8.2_

  - [x] 17.3 重构服务商路由 router/modules/provider.js
    - 配置数据看板、服务管理、订单管理、交易记录路由
    - 所有路由配置 meta.role: ['provider']
    - 包含新增页面路由（ServiceAuditResult、OrderDelivery）
    - _需求: 8.1, 8.2_

  - [x] 17.4 重构管理员路由 router/modules/admin.js
    - 配置管理后台、用户管理、内容审核、订单管理、数据统计、系统日志、公告管理路由
    - 所有路由配置 meta.role: ['admin']
    - 包含新增页面路由（BountyReview、ForumSectionManage、OrderArbitration）
    - _需求: 8.1, 8.2_

  - [x] 17.5 重构路由入口 router/index.js 并实现路由守卫
    - 合并所有路由模块
    - 实现路由守卫：页面标题设置、认证检查、角色权限检查、guest页面重定向
    - 未登录访问受保护路由 → 重定向登录页（携带 redirect 参数）
    - 无权限访问 → 重定向 403 页面
    - _需求: 8.5, 8.6_

  - [x] 17.6 创建 403.vue 权限不足错误页面（新增）
    - 展示权限不足提示和返回首页按钮
    - _需求: 8.6, 10.13_

  - [ ]* 17.7 编写 Property 9 属性测试：路由配置完整性与权限正确性
    - **Property 9: 路由配置完整性与权限正确性**
    - 遍历所有预期页面，验证路由表中存在对应配置且权限正确
    - **验证: 需求 8.1, 8.2**

  - [ ]* 17.8 编写 Property 11 属性测试：路由守卫认证保护
    - **Property 11: 路由守卫认证保护**
    - 生成随机路由和认证状态组合，验证守卫行为正确
    - **验证: 需求 8.5, 8.6**

- [x] 18. 重构菜单配置与布局组件（需求8、9）
  - [x] 18.1 重构 config/menu.js 菜单配置
    - 为三种角色分别配置完整侧边栏菜单，菜单项与路由一一对应
    - 用户菜单新增：需求草稿、我的帖子、我的点赞、账号安全、角色申请、我的订阅、隐私设置、交易记录
    - 管理员菜单新增：需求审核、板块管理
    - _需求: 8.3_

  - [x] 18.2 重构 UserLayout.vue 用户布局组件
    - 确保包含顶部导航栏、侧边菜单栏、面包屑导航、主内容区域
    - 菜单根据 menu.js 配置动态渲染
    - _需求: 9.5_

  - [x] 18.3 重构 ProviderLayout.vue 服务商布局组件
    - 确保包含顶部导航栏、侧边菜单栏、面包屑导航、主内容区域
    - _需求: 9.5_

  - [x] 18.4 重构 AdminLayout.vue 管理员布局组件
    - 确保包含顶部导航栏、侧边菜单栏、面包屑导航、主内容区域
    - _需求: 9.5_

  - [ ]* 18.5 编写 Property 10 属性测试：菜单与路由的一一对应
    - **Property 10: 菜单路由对应**
    - 遍历菜单配置，验证每个菜单项的 path 在路由表中存在
    - **验证: 需求 8.3**

  - [ ]* 18.6 编写 Property 16 属性测试：Layout组件结构统一性
    - **Property 16: Layout结构统一性**
    - 验证三个 Layout 组件渲染输出均包含顶部导航栏、侧边菜单栏、面包屑导航、主内容区域
    - **验证: 需求 9.5**

- [x] 19. 检查点 - 路由、菜单与布局
  - 确保所有路由可正常访问，菜单与路由一一对应，三种角色布局结构统一，路由守卫正确拦截，ask the user if questions arise.

- [x] 20. 集成验证与缺失页面完整性检查
  - [x] 20.1 验证所有新增页面组件存在性
    - 确认 BountyDraft、BountyAuditResult、ServicePurchase、ServiceAuditResult、OrderDelivery、OrderAcceptance、OrderAppeal、OrderArbitration、TransactionHistory、MyPosts、MyLikes、AccountSecurity、RoleApplication、Subscriptions、PrivacySettings、BountyReview、ForumSectionManage、403 共18个页面文件均已创建
    - _需求: 10.1 ~ 10.13_

  - [ ]* 20.2 编写 Property 17 属性测