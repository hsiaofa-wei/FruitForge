<template>
  <div class="user-avatar">
    <div class="page-header">
      <h2>修改头像</h2>
    </div>

    <el-card class="avatar-card">
      <div class="avatar-container">
        <div class="current-avatar">
          <h3>当前头像</h3>
          <el-avatar :size="120" :src="currentAvatar">
            <el-icon><User /></el-icon>
          </el-avatar>
        </div>

        <div class="avatar-options">
          <h3>选择头像</h3>
          <div class="avatar-grid">
            <div 
              v-for="(avatar, index) in avatarOptions" 
              :key="index"
              class="avatar-item"
              :class="{ 'avatar-selected': selectedAvatar === avatar }"
              @click="selectAvatar(avatar)"
            >
              <el-avatar :size="80" :src="avatar" />
            </div>
          </div>
        </div>
      </div>

      <div class="avatar-actions">
        <el-button 
          type="primary" 
          @click="handleSubmit" 
          :loading="submitting" 
          :disabled="!selectedAvatar"
          style="margin-right: 15px;margin-top: 0px;"
        >
          保存修改
        </el-button>
        <el-button @click="resetAvatar">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedAvatar = ref('')
const submitting = ref(false)

// 预设头像选项
const avatarOptions = [
  '/src/img/1.png',
  '/src/img/2.png',
  '/src/img/3.png',
  '/assets/avatars/avatar.png', 
]

// 使用computed从Vuex获取当前头像
const currentAvatar = computed(() => {
  return store.state.user.userInfo?.user_pic || ''
})

// 获取用户头像
const fetchUserAvatar = async () => {
  try {
    await store.dispatch('user/getUserProfile')
  } catch (error) {
    ElMessage.error('获取用户头像失败')
    console.error('获取用户头像错误:', error)
  }
}

// 选择头像
const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar
}

// 提交修改
const handleSubmit = async () => {
  if (!selectedAvatar.value) {
    ElMessage.warning('请先选择新头像')
    return
  }
  
  try {
    submitting.value = true
    
    // 调用Vuex action更新头像
    const res = await store.dispatch('user/updateUserAvatar', { 
      user_pic: selectedAvatar.value 
    })
    
    if (res.code === 200) {
      // 更新本地存储
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
      userInfo.user_pic = selectedAvatar.value
      localStorage.setItem('user', JSON.stringify(userInfo))
      
      ElMessage.success('头像更新成功')
      selectedAvatar.value = ''
    } else {
      ElMessage.error(res.message || '更新头像失败')
    }
  } catch (error) {
    console.error('更新头像错误:', error)
    ElMessage.error('更新失败: ' + (error.message || '服务器错误'))
  } finally {
    submitting.value = false
  }
}

// 重置头像
const resetAvatar = () => {
  selectedAvatar.value = ''
}

// 初始化
onMounted(() => {
  fetchUserAvatar()
})
</script>

<style scoped>
.user-avatar {
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

.avatar-card {
  max-width: 800px;
  margin: 0 auto;
}

.avatar-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
}

.current-avatar {
  margin-bottom: 30px;
  text-align: center;
  flex: 1;
  min-width: 200px;
}

.current-avatar h3 {
  margin-bottom: 20px;
  color: #303133;
}

.avatar-options {
  text-align: center;
  flex: 1;
  min-width: 200px;
}

.avatar-options h3 {
  margin-bottom: 20px;
  color: #303133;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.avatar-item {
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

.avatar-item:hover {
  background-color: #f5f7fa;
}

.avatar-selected {
  background-color: #ecf5ff;
  border: 1px solid #409eff;
}

.avatar-actions {
  margin-top: 30px;
  text-align: center;
}

/* 确保按钮高度一致 */
:deep(.el-button) {
  height: 40px;
  line-height: 40px;
  padding: 0 24px;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  min-width: 100px;
  margin-top: 20px;
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
</style>