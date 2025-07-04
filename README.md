# 水果管理系统

## 项目介绍
一个基于Vue3和Element Plus的水果库存管理系统，包含水果分类管理、库存统计、用户管理等功能模块。

## 功能特点
- **水果管理**：增删改查水果信息，包括名称、分类、价格、库存等
- **分类管理**：管理水果分类信息
- **用户中心**：
  - 个人资料管理
  - 头像修改（预设头像选择）
  - 密码修改
- **数据可视化**：使用ECharts展示水果分类统计图表
- **权限控制**：基于token的登录验证

## 技术栈
- 前端框架：Vue 3 + Vite
- UI组件库：Element Plus
- 图表库：ECharts
- 状态管理：Vuex
- 路由管理：Vue Router
- 图标库：Element Plus Icons + Font Awesome
## 不足之处
- 当前头像保存并不能同步更新到小头像
- 部分页面在小屏幕设备上显示效果不佳
- 部分表单验证规则不够完善
- 部分组件逻辑较复杂，可维护性有待提高
- 图表组件在数据量大时可能有性能问题
- 项目并没有连接数据库，数据暂时存在本地
- 部分功能如用户权限管理、数据导入导出等尚未实现

## 安装与运行
```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 生产环境构建
npm run build
```
## 部分截图展示
![部分截图预览](SomeDisplays/show(1).png)
![部分截图预览](SomeDisplays/show(2).png)
![部分截图预览](SomeDisplays/show(3).png)
![部分截图预览](SomeDisplays/show(4).png)
![部分截图预览](SomeDisplays/show(5).png)
![部分截图预览](SomeDisplays/show(6).png)
>更多内容请您下载观看