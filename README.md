# 水果管理系统

## 部分截图展示
![部分截图预览](SomeDisplays/show(1).png)
![部分截图预览](SomeDisplays/show(2).png)
![部分截图预览](SomeDisplays/show(3).png)
![部分截图预览](SomeDisplays/show(4).png)
![部分截图预览](SomeDisplays/show(5).png)
![部分截图预览](SomeDisplays/show(6).png)
>更多内容请您下载观看

## 项目介绍
基于 **Vue 3 + Vite + Element Plus** 构建的现代化水果库存管理后台，提供高效的库存跟踪、分类管理、用户权限和数据可视化功能。

## 功能模块
- **水果管理**：添加/编辑/删除水果，批量操作库存
- **分类管理**：分类树形结构维护
- **用户管理**：个人信息、头像、密码修改
- **数据看板**：ECharts 图表（饼图、柱状图、折线图等）
- **登录/登出**：Token 认证 + 路由拦截

## 项目亮点
- 完整 CRUD 操作：水果信息（名称、分类、价格、库存、产地等）增删改查
- 多级分类管理：支持水果分类的动态添加/编辑/删除
- 用户中心：个人资料、头像上传/预设选择、密码修改
- 数据可视化：ECharts 实时展示分类库存占比、价格分布等图表
- 权限与安全：基于 Token 的登录验证与路由守卫
- 响应式设计：适配 PC 端后台管理界面

## 技术栈
- 前端框架：Vue 3 (Composition API)
- 构建工具：Vite（极速开发体验）
- UI 组件库：Element Plus
- 图表库：ECharts
- 状态管理：Vuex（或 Pinia，根据你的实际代码）
- 路由管理：Vue Router（路由守卫 + 懒加载）
- 图标库：Element Plus Icons + Font Awesome
- 其他：Axios（API 请求）、Token 认证

## 安装与运行
```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产环境构建
npm run build
```
