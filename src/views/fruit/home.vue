<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :xs="24" :sm="12" :md="6" v-for="stat in stats" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分类统计图表 -->
    <el-card shadow="hover" class="mb-20">
      <template #header>
        <div class="card-header">
          <span>水果分类统计</span>
          <el-button type="primary" size="small" @click="refreshData">刷新数据</el-button>
        </div>
      </template>
      <div class="chart-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="chart-wrapper">
              <div id="categoryPieChart" style="width: 100%; height: 300px;"></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-wrapper">
              <div id="categoryBarChart" style="width: 100%; height: 300px;"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 热门水果列表 -->
    <el-card shadow="hover" class="mb-20">
      <template #header>
        <div class="card-header">
          <span>热门水果</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索水果名称"
            style="width: 200px"
            clearable
            @clear="handleSearchClear"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
        </div>
      </template>
      <el-table :data="filteredFruits" style="width: 100%" v-loading="loading">
        <el-table-column prop="image" label="图片" width="100">
          <template #default="{ row }">
            <el-image
              style="width: 60px; height: 60px"
              :src="getImageUrl(row.image)"
              :preview-src-list="[getImageUrl(row.image)]"
              fit="cover"
              :hide-on-click-modal="true"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" sortable width="150" />
        <el-table-column prop="category_name" label="分类" sortable width="120" />
        <el-table-column prop="price" label="价格(元)" sortable width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" sortable width="100">
          <template #default="{ row }">
            <el-tag :type="getStockTagType(row.stock)">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
      </el-table>
      <el-pagination
        class="mt-20"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalFruits"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup>

import { ref, onMounted, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()

// 统计数据
const stats = ref([
  {
    title: '水果总数',
    value: 0,
    icon: 'el-icon-apple',
    color: '#ff4d4f'
  },
  {
    title: '分类数量',
    value: 0,
    icon: 'el-icon-menu',
    color: '#13c2c2'
  },
  {
    title: '库存总量',
    value: 0,
    icon: 'el-icon-box',
    color: '#52c41a'
  },
  {
    title: '平均价格',
    value: 0,
    icon: 'el-icon-coin',
    color: '#faad14'
  }
])

// 分类数据
const categories = computed(() => store.state.category.categories)
const categoryPieChart = ref(null)
const categoryBarChart = ref(null)

// 水果数据
const fruits = computed(() => store.state.fruit.fruits)
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const totalFruits = computed(() => store.state.fruit.total)

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

// 过滤后的水果列表
const filteredFruits = computed(() => {
  if (!searchKeyword.value) return fruits.value
  return fruits.value.filter(fruit => 
    fruit.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 初始化图表
const initCharts = () => {
  // 销毁旧图表
  if (categoryPieChart.value) {
    categoryPieChart.value.dispose()
  }
  if (categoryBarChart.value) {
    categoryBarChart.value.dispose()
  }
  
  // 初始化新图表
  categoryPieChart.value = echarts.init(document.getElementById('categoryPieChart'))
  categoryBarChart.value = echarts.init(document.getElementById('categoryBarChart'))
  
  // 更新图表数据
  updateCharts()
}

// 更新图表数据
const updateCharts = () => {
  if (!categories.value.length || !fruits.value.length) return
  
  // 准备饼图数据
  const pieData = categories.value.map(category => ({
    name: category.name,
    value: fruits.value.filter(fruit => fruit.category_id === category.id).length
  }))
  
  // 准备柱状图数据
  const barData = categories.value.map(category => ({
    name: category.name,
    value: fruits.value.filter(fruit => fruit.category_id === category.id).length
  }))
  
  // 设置饼图配置
  const pieOption = {
    title: {
      text: '水果分类占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: pieData.map(item => item.name)
    },
    series: [
      {
        name: '水果数量',
        type: 'pie',
        radius: '50%',
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  // 设置柱状图配置
  const barOption = {
    title: {
      text: '水果分类数量',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: barData.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '水果数量',
        type: 'bar',
        data: barData.map(item => item.value),
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }
  
  // 更新图表
  categoryPieChart.value.setOption(pieOption)
  categoryBarChart.value.setOption(barOption)
}

// 更新统计数据
const updateStats = () => {
  if (!fruits.value.length || !categories.value.length) return
  
  stats.value[0].value = fruits.value.length
  stats.value[1].value = categories.value.length
  stats.value[2].value = fruits.value.reduce((sum, fruit) => sum + fruit.stock, 0)
  stats.value[3].value = (fruits.value.reduce((sum, fruit) => sum + fruit.price, 0) / fruits.value.length).toFixed(2)
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      store.dispatch('fruit/fetchFruits', { page: 1, limit: 100 }),
      store.dispatch('category/fetchCategories', { page: 1, limit: 100 }) // 增加limit参数获取更多分类
    ])
    updateStats()
    updateCharts()
    ElMessage.success('数据刷新成功')
  } catch (error) {
    console.error('刷新数据失败:', error)
    ElMessage.error('刷新数据失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理搜索清除
const handleSearchClear = () => {
  currentPage.value = 1
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  // 添加数据获取逻辑
  store.dispatch('fruit/fetchFruits', { 
    page: currentPage.value, 
    limit: pageSize.value 
  })
}

// 监听数据变化
watch([fruits, categories], () => {
  updateStats()
  updateCharts()
}, { deep: true })

// 监听窗口大小变化
window.addEventListener('resize', () => {
  categoryPieChart.value?.resize()
  categoryBarChart.value?.resize()
})

// 初始化
onMounted(() => {
  refreshData()
  initCharts()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  position: relative; /* 确保容器有定位上下文 */
  z-index: 1; /* 确保内容在正常层级 */ 
}

.mb-20 {
  margin-bottom: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-icon i {
  font-size: 24px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  padding: 20px 0;
}

.chart-wrapper {
  height: 300px;
}

</style>