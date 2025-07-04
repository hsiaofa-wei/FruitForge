import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';

// 路由配置
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用 HTML5 History 模式
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue'), // 登录页面，独立布局
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/components/PageContainer.vue'), // 主布局组件
      redirect: '/login', // 默认重定向到登录页面
      meta: { requiresAuth: true },
      children: [
        {
          path: '/fruit/manage',
          component: () => import('@/views/fruit/FruitManage.vue'), // 水果管理页面
          meta: { requiresAuth: true }
        },
        {
          path: '/fruit/channel',
          component: () => import('@/views/fruit/FruitChannel.vue'), // 水果分类页面
          meta: { requiresAuth: true }
        },
        {
          path: '/fruit/home',
          component: () => import('@/views/fruit/home.vue'), // 水果分类页面
          meta: { requiresAuth: true }
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue'), // 用户个人资料页面
          meta: { requiresAuth: true }
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue'), // 用户头像设置页面
          meta: { requiresAuth: true }
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue'), // 用户密码修改页面
          meta: { requiresAuth: true }
        },
      ],
    },
  ],
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    ElMessage.error('请先登录');
    next('/login');
  } else if (to.path === '/login' && token) {
    next('/fruit/home');
  } else {
    next();
  }
});

export default router;