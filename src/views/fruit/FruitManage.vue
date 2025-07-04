<template>
  <div class="fruit-manage">
    <div class="page-header">
      <h2>水果管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加水果
      </el-button>
    </div>

    <el-card class="table-card">
      <!-- 搜索区域 -->
      <div class="search-container">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="水果名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入水果名称"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="分类">
            <el-select
              v-model="searchForm.category_id"
              placeholder="请选择分类"
              clearable
            >
              <el-option
                v-for="category in categoryOptions"
                :key="category.id"
                :label="category.name"
                :value="category.id" 
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table 
        :data="fruits" 
        style="width: 100%" 
        v-loading="loading"
        border
        stripe
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column label="图片" width="120" align="center">
          <template #default="{ row }">
            <el-image
              style="width: 60px; height: 60px"
              :src="getImageUrl(row.image)"
              :preview-src-list="[getImageUrl(row.image)]"
              fit="cover"
              hide-on-click-modal
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="150" />
        <el-table-column prop="category_name" label="分类" width="120" />
        <el-table-column prop="price" label="价格(元)" width="120" align="right">
          <template #default="{ row }">
            <span style="color: #f56c6c">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStockTagType(row.stock)">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <div class="operation-buttons">
              <el-tooltip content="编辑" placement="top">
                <el-button type="primary" circle @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button type="danger" circle @click="handleDelete(row)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑水果对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑水果' : '添加水果'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="水果名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入水果名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="category in categoryOptions"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input-number 
            v-model="form.price" 
            :min="0" 
            :precision="2" 
            :step="0.1" 
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number 
            v-model="form.stock" 
            :min="0" 
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="图片URL" prop="image">
          <el-input v-model="form.image" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入水果描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { useStore } from 'vuex'

const store = useStore()

// 数据列表
const fruits = ref([])
const loading = ref(false)
const submitting = ref(false)
const categoryOptions = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 表单数据
const form = reactive({
  id: null,
  name: '',
  category_id: null, // 改为null而不是空字符串
  price: 0,
  stock: 0,
  image: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入水果名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能为负数', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能为负数', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请输入图片URL', trigger: 'blur' }
  ]
}

// 搜索表单
const searchForm = reactive({
  name: '',
  category_id: null // 改为null而不是空字符串
})

// 获取图片完整URL
const getImageUrl = (path) => {
  if (!path) return ''
  // 如果已经是完整URL则直接返回
  if (path.startsWith('http') || path.startsWith('https')) {
    return path
  }
  // 处理本地路径
  return path.startsWith('/') ? path : `/${path}`
}

// 获取库存标签类型
const getStockTagType = (stock) => {
  if (stock > 50) return 'success'
  if (stock > 10) return 'warning'
  return 'danger'
}

// 获取分类选项
const fetchCategoryOptions = async () => {
  try {
    const res = await store.dispatch('category/fetchCategories', { 
      page: 1, 
      limit: 100
    })
    // 确保分类数据正确加载
    console.log('分类数据:', res.data.list)
    categoryOptions.value = res.data.list.map(category => ({
      ...category,
      id: Number(category.id) // 确保id是数字类型
    }))
  } catch (error) {
    console.error('获取分类失败:', error)
    ElMessage.error('获取分类失败')
  }
}

// 获取水果列表
const fetchFruits = async () => {
  loading.value = true
  try {
    console.log('搜索参数:', {
      category_id: searchForm.category_id,
      type: typeof searchForm.category_id
    })
    const res = await store.dispatch('fruit/fetchFruits', {
      page: currentPage.value,
      limit: pageSize.value,
      name: searchForm.name.trim(),
      category_id: searchForm.category_id ? Number(searchForm.category_id) : undefined // 确保转换为数字类型
    })
    fruits.value = res.data.list.map(item => ({
      ...item,
      image: getImageUrl(item.image),
      category_id: Number(item.category_id), // 确保转换为数字类型
      category_name: categoryOptions.value.find(c => c.id === Number(item.category_id))?.name || '未知分类'
    }))
    total.value = res.data.total
  } catch (error) {
    console.error('获取水果列表失败:', error)
    ElMessage.error('获取水果列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchFruits()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchFruits()
}

// 处理添加
const handleAdd = () => {
  isEdit.value = false
  form.id = null
  form.name = ''
  form.category_id = categoryOptions.value[0]?.id || null // 确保类型一致
  form.price = 0
  form.stock = 0
  form.image = ''
  form.description = ''
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.category_id = row.category_id // 确保直接使用数字ID
  form.price = row.price
  form.stock = row.stock
  form.image = row.image
  form.description = row.description
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (row) => {
  if (confirm(`确定要删除水果"${row.name}"吗？删除后将无法恢复！`)) {
    try {
      await store.dispatch('fruit/deleteFruit', row.id)
      ElMessage.success('删除成功')
      fetchFruits()
    } catch (error) {
      console.error('删除水果失败:', error)
      ElMessage.error('删除水果失败')
    }
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        submitting.value = true
        if (isEdit.value) {
          const res = await store.dispatch('fruit/updateFruit', {
            id: form.id,
            data: {
              ...form,
              category_id: form.category_id
            }
          })
          if (res.code === 200) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            fetchFruits() // 确保更新后重新获取数据
          } else {
            ElMessage.error(res.msg || '更新失败')
          }
        } else {
          const res = await store.dispatch('fruit/addFruit', {
            ...form,
            category_id: form.category_id
          })
          if (res.code === 200) {
            ElMessage.success('添加成功')
            dialogVisible.value = false
            fetchFruits() // 确保添加后重新获取数据
            fetchCategoryOptions() // 同时刷新分类选项
          } else {
            ElMessage.error(res.msg || '添加失败')
          }
        }
      } catch (error) {
        ElMessage.error(error.message || (isEdit.value ? '更新失败' : '添加失败'))
      } finally {
        submitting.value = false
      }
    }
  })
}

// 处理搜索
const handleSearch = () => {
  console.log('当前选择的分类ID:', searchForm.category_id, typeof searchForm.category_id)
  currentPage.value = 1
  fetchFruits()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.category_id = null // 改为 null 而不是空字符串
  currentPage.value = 1
  fetchFruits()
}

// 初始化
onMounted(() => {
  fetchCategoryOptions()
  fetchFruits()
})
</script>

<style scoped>
.fruit-manage {
  padding: 20px;
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.table-card {
  margin-top: 20px;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
  --el-table-row-hover-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
  height: 50px;
}

:deep(.el-table td) {
  padding: 12px 0;
}

/* 表格操作按钮样式 */
.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

:deep(.el-button.is-circle) {
  padding: 8px;
  font-size: 16px;
}

:deep(.el-button--primary.is-circle) {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
}

:deep(.el-button--danger.is-circle) {
  background: linear-gradient(135deg, #f56c6c 0%, #ff9a9e 100%);
  border: none;
}

:deep(.el-button--primary.is-circle:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--danger.is-circle:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

/* 搜索区域样式 */
.search-container {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

:deep(.search-form .el-form-item) {
  margin-bottom: 0;
}

:deep(.search-form .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.search-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.search-form .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.search-form .el-button) {
  padding: 8px 16px;
  font-size: 14px;
}

:deep(.search-form .el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #36d1dc 100%);
  border: none;
}

:deep(.search-form .el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
</style>