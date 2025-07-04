<template>
  <div class="user-profile">
    <div class="page-header">
      <h2>个人资料</h2>
    </div>

    <el-card class="profile-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="profile-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="form.bio"
            type="textarea"
            :rows="4"
            placeholder="请输入个人简介"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { updateUserProfile } from '@/api/api'

const formRef = ref(null)
const loading = ref(false)

const form = ref({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  bio: ''
})

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 获取用户信息
const getUserInfo = () => {
  const userInfo = localStorage.getItem('user')
  if (userInfo) {
    const user = JSON.parse(userInfo)
    console.log('获取到的用户信息:', user)
    form.value = {
      username: user.username || '',
      nickname: user.nickname || user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || ''
    }
    console.log('设置的表单数据:', form.value)
  }
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const submitData = {
      nickname: form.value.nickname,
      email: form.value.email,
      phone: form.value.phone,
      bio: form.value.bio
    }
    console.log('提交的数据:', submitData)
    
    const res = await updateUserProfile(submitData)
    console.log('更新结果:', res)
    
    if (res.code === 200) {
      // 更新本地存储的用户信息
      const userInfo = {
        ...JSON.parse(localStorage.getItem('user')),
        ...submitData
      }
      localStorage.setItem('user', JSON.stringify(userInfo))
      
      // 使用ElMessageBox弹窗提示
      await ElMessageBox.alert('个人资料保存成功', '提示', {
        confirmButtonText: '确定',
        type: 'success'
      })
    }
  } catch (error) {
    console.error('更新错误:', error)
    ElMessage.error('更新失败')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 初始化
onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.user-profile {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 120px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.profile-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  min-width: 100px;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
</style>
