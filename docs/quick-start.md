# IT服务平台快速开始指南

## 🚀 项目启动

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问应用
打开浏览器访问: http://localhost:5173

**注意**: 项目启动后会自动显示登录页面，这是正确的行为，因为这是一个需要登录的平台系统。

## 📱 功能演示

### 用户角色登录测试

#### 普通用户
- 用户名: `user` 或任意用户名
- 密码: `123456` 或任意密码
- 登录后跳转到: `/user/news`

#### 服务提供方
- 用户名: `provider`
- 密码: `123456`
- 登录后跳转到: `/provider/dashboard`

#### 管理员
- 用户名: `admin`
- 密码: `123456`
- 登录后跳转到: `/admin/dashboard`

### 主要页面路由

#### 公共页面
- `/login` - 登录页（项目启动默认页面）
- `/register` - 注册页
- `/home` - 首页（需要登录后访问）

#### 普通用户页面
- `/user/news` - 资讯大厅
- `/user/services` - 服务市场
- `/user/forum` - 技术论坛
- `/user/bounty` - 需求悬赏
- `/user/orders` - 我的订单
- `/user/profile` - 个人中心

#### 服务提供方页面
- `/provider/dashboard` - 数据看板（包含ECharts图表）
- `/provider/services` - 服务管理
- `/provider/orders` - 订单管理
- `/provider/transactions` - 交易记录

#### 管理员页面
- `/admin/dashboard` - 管理后台
- `/admin/statistics` - 数据统计（包含ECharts图表）
- `/admin/users` - 用户管理
- `/admin/articles/review` - 文章审核
- `/admin/services/review` - 服务审核

## 🎨 技术特性

### 前端技术栈
- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 快速构建工具
- **Vue Router 4** - 路由管理
- **Ant Design Vue** - UI组件库
- **ECharts** - 数据可视化图表
- **Less** - CSS预处理器

### 核心功能
- ✅ 响应式布局设计
- ✅ 多角色权限控制
- ✅ 模块化路由配置
- ✅ 数据可视化图表
- ✅ 组件化开发
- ✅ 假数据模拟

### 页面特色
- **首页**: 轮播图、平台统计、热门服务展示
- **登录/注册**: 双栏布局、表单验证、社交登录
- **资讯列表**: 搜索筛选、标签过滤、分页展示
- **服务市场**: 网格/列表视图、价格筛选、评分排序
- **数据看板**: ECharts图表、实时数据、统计分析

## 📊 数据可视化

### 服务商数据看板
- 收入趋势图（折线图+柱状图）
- 订单状态分布（饼图）
- 服务分类收入（柱状图）
- 客户地域分布（环形图）

### 管理员统计页面
- 用户增长趋势（折线图）
- 交易金额趋势（面积图）
- 用户类型分布（饼图）
- 平台活跃度热力图
- 实时数据表格

## 🎯 开发规范

### 组件命名
- 页面组件: PascalCase (UserProfile.vue)
- 布局组件: PascalCase + Layout (UserLayout.vue)
- 业务组件: 功能描述 (ServiceCard.vue)

### 路由配置
- 模块化路由: `/src/router/modules/`
- 权限控制: meta字段配置
- 懒加载: 动态import

### 样式规范
- 使用Less预处理器
- 组件样式scoped
- 响应式设计
- Ant Design主题定制

## 🔧 开发工具

### 代码规范
```bash
# 代码检查
npm run lint

# 代码格式化
npm run format

# 构建生产版本
npm run build
```

### 推荐VSCode插件
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Auto Rename Tag

## 📝 项目结构

```
src/
├── api/                # API接口
├── assets/             # 静态资源
├── components/         # 公共组件
├── config/             # 配置文件
├── layouts/            # 布局组件
├── pages/              # 页面组件
│   ├── auth/          # 认证页面
│   ├── user/          # 用户页面
│   ├── provider/      # 服务商页面
│   ├── admin/         # 管理员页面
│   └── error/         # 错误页面
├── router/             # 路由配置
│   └── modules/       # 路由模块
├── stores/             # 状态管理
└── utils/              # 工具函数
```

## 🎉 下一步

1. **完善页面功能**: 添加更多交互逻辑
2. **接入真实API**: 替换模拟数据
3. **优化用户体验**: 添加加载状态、错误处理
4. **移动端适配**: 完善响应式设计
5. **性能优化**: 代码分割、图片懒加载
6. **测试覆盖**: 单元测试、集成测试

## 📞 技术支持

如有问题，请查看：
- [Vue 3 官方文档](https://vuejs.org/)
- [Ant Design Vue 文档](https://antdv.com/)
- [ECharts 官方文档](https://echarts.apache.org/)
- [Vite 官方文档](https://vitejs.dev/)

---

