<template>
  <div class="page-container">
    <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
         <div class="logo">
          <span v-show="!isCollapse">水果管理系统</span>
          <span v-show="isCollapse">系统</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :router="true"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
        <el-menu-item index="/fruit/home">
  <el-icon><HomeFilled /></el-icon>
  <template #title>首页</template>
</el-menu-item>
          <el-menu-item index="/fruit/manage">
            <el-icon><Goods /></el-icon>
            <template #title>水果管理</template>
          </el-menu-item>
          <el-menu-item index="/fruit/channel">
            <el-icon><Menu /></el-icon>
            <template #title>分类管理</template>
          </el-menu-item>
          <el-sub-menu index="user">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户中心</span>
            </template>
            <el-menu-item index="/user/profile">
              <el-icon><User /></el-icon>
              <span>个人资料</span>
            </el-menu-item>
            <el-menu-item index="/user/avatar">
              <el-icon><Picture /></el-icon>
              <span>修改头像</span>
            </el-menu-item>
            <el-menu-item index="/user/password">
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-left">
            <el-icon
              class="collapse-btn"
              @click="toggleCollapse"
            >
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
            <div class="welcome-text">
             你好，管理员{{ userInfo.username }} ！
            </div>
          </div>
          <div class="header-right">
            <div class="user-info">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="user-dropdown">
                  <el-avatar :size="40" :src="userInfo.avatar || '/assets/default-avatar.png'" />
                  <span class="username">{{ userInfo.username }}</span>
                  <el-icon class="el-icon--right"><CaretBottom /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">
                      <el-icon><User /></el-icon>
                      个人资料
                    </el-dropdown-item>
                    <el-dropdown-item command="avatar">
                      <el-icon><Picture /></el-icon>
                      修改头像
                    </el-dropdown-item>
                    <el-dropdown-item command="password">
                      <el-icon><Lock /></el-icon>
                      修改密码
                    </el-dropdown-item>
                    <el-dropdown-item divided command="logout">
                      <el-icon><SwitchButton /></el-icon>
                      退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import {
  Goods,
  Menu,
  Fold,
  Expand,
  User,
  Picture,
  Lock,
  SwitchButton,
  CaretBottom,
  HomeFilled
} from '@element-plus/icons-vue'
import { fa } from 'element-plus/es/locales.mjs'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

// 用户信息
const userInfo = ref({
  username: 'admin',
  avatar: '/assets/default-avatar.png'
})

// 从localStorage获取用户信息
const getUserInfo = () => {
  const user = localStorage.getItem('user')
  if (user) {
    userInfo.value = JSON.parse(user)
  }
}

const activeMenu = computed(() => route.path)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  console.log('isCollapse:', isCollapse.value) // 调试用，确认状态变化
}

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'avatar':
      router.push('/user/avatar')
      break
    case 'password':
      router.push('/user/password')
      break
    case 'logout': 
      try {
        // 确认退出弹窗
        await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'centered-message-box',
          center: true
        })
        
        // 显示正在退出提示
        const loadingInstance = ElLoading.service({
          lock: true,
          text: '正在安全退出...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        
        // 模拟异步退出操作
        setTimeout(() => {
          // 清除登录状态
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // 关闭加载提示
          loadingInstance.close();
          
          // 显示退出成功提示
          ElMessage.success({
            message: '您已安全退出系统',
            duration: 1000,
            onClose: () => {
              // 跳转到登录页
              router.push('/login');
            }
          });
        }, 1000);
      } catch {
        // 用户取消操作
        ElMessage.info('已取消退出操作');
      }
      break;
  }
}

// 初始化
onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.page-container {
  height: 100vh;
  width: 100%;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #304156;
  transition: width 0.3s ease;
  overflow: hidden;
}
/* 折叠状态下菜单样式 */
:deep(.el-menu--collapse) {
  width: 64px;
}

:deep(.el-menu--collapse .el-sub-menu__title span),
:deep(.el-menu--collapse .el-menu-item span) {
  display: none;
}

:deep(.el-menu--collapse .el-sub-menu__title .el-sub-menu__icon-arrow) {
  display: none;
}

/* 确保折叠按钮样式正确 */
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  margin-right: 15px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  color: #409eff;
  transform: scale(1.1);
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.el-menu-vertical {
  border-right: none;
  background-color: #304156;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-menu-item.is-active) {
  color: #409eff;
  background-color: #263445;
}

:deep(.el-menu-item:hover) {
  background-color: #263445;
  color: #fff;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}

.collapse-btn:hover {
  color: #409eff;
}

.welcome-text {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
  height: 100%;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(0, 0, 0, 0.025);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #303133;
}

.username {
  font-size: 14px;
  margin: 0 4px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu) {
  padding: 4px 0;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(236, 232, 232, 0.1);
  background-color: #fff !important;
  border: 1px solid #e4e7ed;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #303133 !important;
  background-color: #fff !important;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f7fa !important;
  color: #409eff !important;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 16px;
}

:deep(.el-dropdown-menu__item.is-divided) {
  border-top: 1px solid #ebeef5;
  margin: 4px 0;
}

/* 自定义消息框样式 */
:deep(.custom-message-box .el-message-box__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  text-align: center; 
}

:deep(.custom-message-box .el-message-box__content) {
  font-size: 16px;
  color: #606266;
  padding: 20px 0;
  text-align: center;
}

:deep(.custom-message-box .el-message-box__btns) {
  padding-top: 20px;
  text-align: center;
}

:deep(.custom-message-box .el-button) {
  padding: 12px 24px;
  font-size: 16px;
  min-width: 100px;
}

:deep(.custom-confirm-button) {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  margin: 0 10px;
  color: #fff;
}

:deep(.custom-cancel-button) {
  border: 1px solid #dcdfe6;
  padding: 10px 20px;
  font-size: 14px;
  margin: 0 10px;
  color: #303133;
}

:deep(.custom-confirm-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.custom-cancel-button:hover) {
  color: #409eff;
  border-color: #409eff;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 56px;
  line-height: 56px;
}

:deep(.el-sub-menu .el-menu-item) {
  height: 50px;
  line-height: 50px;
  padding-left: 48px !important;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--primary.is-disabled) {
  background: #a0cfff;
  transform: none;
  box-shadow: none;
}

:deep(.el-sub-menu__title) {
  color: #bfcbd9;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #263445;
  color: #fff;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #409eff;
}

:deep(.el-sub-menu .el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: #263445;
  color: #fff;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  color: #409eff;
  background-color: #263445;
}

:deep(.el-sub-menu .el-menu) {
  background-color: #304156 !important;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: #304156 !important;
  color: #bfcbd9 !important;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: #263445 !important;
  color: #fff !important;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  color: #409eff !important;
  background-color: #263445 !important;
}

:deep(.el-dropdown-menu) {
  background-color: #304156 !important;
  border: none;
}

:deep(.el-dropdown-menu__item) {
  color: #bfcbd9 !important;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #263445 !important;
  color: #fff !important;
}

:deep(.el-dropdown-menu__item.is-divided) {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>