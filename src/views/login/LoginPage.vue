<template>
  <div class="login-container">
    <div class="login-box">
      <div class="tab-header">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          登录
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          注册
        </div>
      </div>

      <!-- 登录表单 -->
      <div v-if="activeTab === 'login'" class="form-container">
        <h2>用户登录</h2>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-width="80px"
          size="large"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="User"
            />
            <div class="input-tip">用户名长度3-20位，支持字母、数字和下划线</div>
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
            />
            <div class="input-tip">密码长度6-20位，需包含字母和数字</div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              :loading="loginLoading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 注册表单 -->
      <div v-if="activeTab === 'register'" class="form-container">
        <h2>用户注册</h2>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-width="80px"
          size="large"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              prefix-icon="User"
            />
            <div class="input-tip">3-20位字母、数字或下划线组合</div>
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
            />
            <div class="input-tip">6-20位字母、数字或下划线组合</div>
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              prefix-icon="Lock"
              show-password
            />
            <div class="input-tip">需与密码保持一致</div>
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              prefix-icon="Message"
            />
            <div class="input-tip">请输入有效的邮箱地址</div>
          </el-form-item>
          
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              prefix-icon="Phone"
            />
            <div class="input-tip">请输入有效的手机号，格式如：13812345678</div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%"
              :loading="registerLoading"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 已有用户展示 -->
      <div class="users-demo" v-if="activeTab === 'login'">
        <el-divider></el-divider>
        <div class="demo-users">
          <div 
            v-for="user in demoUsers" 
            :key="user.id"
            class="demo-user-item"
            @click="useDemo(user)"
          >
            <el-avatar :src="user.avatar" :size="40">
              {{ user.username.charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="user-info">
              <div class="username">{{ user.username }}</div>
              <div class="password">密码: {{ user.password }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

// 活动标签
const activeTab = ref('login');

// 加载状态
const loginLoading = ref(false);
const registerLoading = ref(false);

// 表单引用
const loginFormRef = ref();
const registerFormRef = ref();

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
});

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: ''
});

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
};

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
};

// 演示用户数据
const demoUsers = ref([
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: '/assets/admin.png'
  }
]);

// 使用演示账号
const useDemo = (user) => {
  loginForm.username = user.username;
  loginForm.password = user.password;
};

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loginLoading.value = true;
      try {
        const response = await store.dispatch('user/login', loginForm);
        if (response.code === 200) {
          ElMessage.success('登录成功');
          router.push('/fruit/home');
        } else {
          alert(response.message || '登录失败');
        }
      } catch (error) {
        alert('登录失败，请稍后重试');
      } finally {
        loginLoading.value = false;
      }
    }
  });
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      registerLoading.value = true;
      try {
        // 获取已注册用户
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.username === registerForm.username);
        
        if (existingUser) {
          alert('用户名已存在');
          return;
        }
        
         // 创建新用户对象
        const newUser = {
          username: registerForm.username,
          password: registerForm.password,
          nickname: registerForm.username, // 默认昵称为用户名
          email: registerForm.email,
          phone: registerForm.phone,
          user_pic: '/assets/default-avatar.png' // 默认头像
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        ElMessage.success('注册成功，请登录');
        activeTab.value = 'login';
        loginForm.username = registerForm.username;
        loginForm.password = registerForm.password;
        
        // 清空注册表单
        registerForm.username = '';
        registerForm.password = '';
        registerForm.confirmPassword = '';
        registerForm.email = '';
        registerForm.phone = '';
      } catch (error) {
        alert('注册失败，请稍后重试');
      } finally {
        registerLoading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;
}

.tab-header {
  display: flex;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  font-weight: 500;
  color: #606266;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  position: relative;
  overflow: hidden;
}

.tab-item.active {
  color: #409eff;
  background: white;
  border-bottom-color: #409eff;
}

.tab-item:hover {
  background: #ecf5ff;
}

.tab-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: #409eff;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.tab-item:hover::after {
  width: 100%;
}

.form-container {
  padding-right: 30px; 
}

.form-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
  font-weight: 500;
  font-size: 24px;
}

.users-demo {
  padding: 0 30px 30px; 
}

.demo-users {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-user-item {
  margin-top: 3px;
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.demo-user-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-info {
  margin-left: 12px;
  flex: 1;
}

.username {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.password {
  font-size: 12px;
  color: #909399;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-input__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-divider__text) {
  color: #909399;
  font-size: 14px;
  background: white;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .login-box {
    max-width: 100%;
    margin: 0 20px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .form-container h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
}

.input-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .input-tip {
    font-size: 11px;
  }
}
</style>