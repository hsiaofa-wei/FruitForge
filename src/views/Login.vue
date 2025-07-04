<template>
  <!-- No changes to template section -->
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const form = ref({})

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const res = await login(form.value)
    console.log('登录响应:', res)
    
    if (res.code === 200) {
      // 保存token
      localStorage.setItem('token', res.data.token)
      
      // 保存用户信息
      const userInfo = {
        id: res.data.id,
        username: res.data.username,
        nickname: res.data.nickname || res.data.username,
        avatar: res.data.avatar || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        bio: res.data.bio || '',
        role: res.data.role
      }
      localStorage.setItem('user', JSON.stringify(userInfo))
      
      ElMessage.success('登录成功')
      router.push('/')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>
<style> 
</style> 