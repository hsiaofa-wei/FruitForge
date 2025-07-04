<template>
  <div class="user-password">
    <div class="page-header">
      <h2>修改密码</h2>
    </div>

    <el-card class="password-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="password-form"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确认修改
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateUserPassword } from '@/api/api'

const formRef = ref()
const submitting = ref(false)

// 表单数据
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证新密码
const validateNewPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
  } else if (value === form.oldPassword) {
    callback(new Error('新密码不能与当前密码相同'))
  } else {
    callback()
  }
}

// 验证确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, validator: validateNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 确认修改
    await ElMessageBox.confirm('确定要修改密码吗？', '确认修改', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'custom-message-box',
      confirmButtonClass: 'custom-confirm-button',
      cancelButtonClass: 'custom-cancel-button',
      center: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
    })
    
    submitting.value = true
    const res = await updateUserPassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    })
    
    if (res.code === 200) {
      ElMessage.success('密码修改成功，请重新登录')
      // 清除登录状态
      localStorage.removeItem('token')
      // 跳转到登录页
      window.location.href = '/login'
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('密码修改失败')
    }
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}
</script>

<style>
.user-password {
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

.form-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
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

:deep(.el-button--primary.is-disabled) {
  background: #a0cfff;
  transform: none;
  box-shadow: none;
}

/* 全局弹窗样式优化 */
.el-message-box, :deep(.custom-message-box) {
  border-radius: 8px;
  min-width: 320px;
  background: #fff;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  color: #303133;
}
.el-message-box__title,
.el-message-box__content,
:deep(.custom-message-box .el-message-box__title),
:deep(.custom-message-box .el-message-box__content) {
  color: #303133;
  text-align: center;
}
:deep(.custom-message-box .el-message-box__btns) {
  text-align: center;
  padding-top: 10px;
}
:deep(.custom-confirm-button) {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
  padding: 10px 20px;
  font-size: 14px;
}
:deep(.custom-cancel-button) {
  border: 1px solid #dcdfe6;
  padding: 10px 20px;
  font-size: 14px;
}
:deep(.custom-confirm-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
:deep(.custom-cancel-button:hover) {
  color: #409eff;
  border-color: #409eff;
}
</style>
