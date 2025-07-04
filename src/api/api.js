import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 模拟数据
const mockData = {
  // 用户数据
  users: [
    {
      username: 'admin',
      password: '123456',
      nickname: '管理员',
      user_pic: '/assets/admin.png'
    },
    {
      username: 'user1',
      password: 'password',
      nickname: '测试用户',
      user_pic: '/assets/user1.png'
    }
  ],
  
  // 水果分类数据
  categories: [
    { id: 1, name: "苹果类", description: "精选全球优质苹果" },
    { id: 2, name: "柑橘类", description: "酸甜多汁的柑橘家族" },
    { id: 3, name: "浆果类", description: "精致小巧的营养宝库" },
    { id: 4, name: "热带水果", description: "阳光充足的热带美味" }
  ],
  
  // 水果数据
  fruits: [
    {
      id: 1,
      name: "新疆阿克苏冰糖心苹果",
      category_id: 1,
      category_name: "苹果类",
      price: 25.80,
      originalPrice: 32.90,
      stock: 100,
      unit: "箱(约5斤)",
      image: "/src/img/1.png",
      description: "新疆阿克苏核心产区，冰糖心明显，脆甜多汁，果皮薄，果肉细腻，甜度高，汁水丰富。",
      nutrition: "富含维生素C和膳食纤维，有助于消化和增强免疫力。每100克含维生素C约4毫克，膳食纤维2.4克。",
      sweetness: "高甜度(糖度14-16度)",
      storage: "阴凉通风处可保存15天，冷藏更佳"
    },
    {
      id: 2,
      name: "日本阳光富士苹果",
      category_id: 1,
      category_name: "苹果类",
      price: 45.90,
      originalPrice: 59.90,
      stock: 80,
      unit: "箱(6个装)",
      image: "/src/img/2.png",
      description: "日本顶级品种，全年超2000小时日照，蜜心明显，口感如蜜般清甜。",
      nutrition: "富含果胶和多酚，抗氧化能力是普通苹果的3倍。",
      sweetness: "超高甜度(糖度16-18度)",
      storage: "冷藏保存20天"
    },
    {
      id: 3,
      name: "甘肃花牛苹果",
      category_id: 1,
      category_name: "苹果类",
      price: 22.50,
      stock: 120,
      unit: "箱(约8斤)",
      image: "/src/img/3.png",
      description: "中国国家地理标志产品，果面鲜红有条纹，肉质松脆多汁，酸甜平衡。",
      nutrition: "维生素B族含量突出，有助于神经系统健康。",
      sweetness: "中甜度(糖度12-14度)",
      storage: "常温保存15天"
    },
    {
      id: 4,
      name: "美国红地厘蛇果",
      category_id: 1,
      category_name: "苹果类",
      price: 38.80,
      originalPrice: 45.00,
      stock: 60,
      unit: "箱(12个装)",
      image: "/src/img/4.png",
      description: "经典蛇果品种，果形高桩五棱突出，肉质致密，香气浓郁持久。",
      nutrition: "富含槲皮素，有助于心血管健康。",
      sweetness: "中高甜度(糖度14-16度)",
      storage: "冷藏保存30天"
    },
    {
      id: 5,
      name: "山东红富士苹果",
      category_id: 1,
      category_name: "苹果类",
      price: 19.90,
      originalPrice: 25.90,
      stock: 150,
      unit: "箱(约10斤)",
      image: "/src/img/5.png",
      description: "山东红富士苹果产自烟台优质产区，果形端正，色泽鲜艳，果肉细腻，汁水丰富，甜酸适口。烟台地区昼夜温差大，有利于糖分积累。",
      nutrition: "富含维生素C和果胶，有助于增强免疫力和降低胆固醇。每100克含维生素C约4毫克，果胶约0.8克。",
      sweetness: "中高甜度(糖度13-15度)",
      storage: "阴凉通风处可保存1个月，冷藏更佳"
    },
    {
      id: 6,
      name: "美国新奇士橙",
      category_id: 2,
      category_name: "柑橘类",
      price: 35.90,
      originalPrice: 45.90,
      stock: 90,
      unit: "箱(约8斤)",
      image: "/src/img/6.png",
      description: "美国新奇士橙果形饱满，色泽鲜艳，皮薄多汁，酸甜适中，带有独特香气。每个橙子都有Sunkist品牌标识。",
      nutrition: "富含维生素C和类黄酮，有助于增强免疫力和抗氧化。每100克含维生素C约53毫克，类黄酮含量丰富。",
      sweetness: "中甜度(糖度12-14度)",
      storage: "常温保存10-14天，冷藏可延长至3周"
    },
    {
      id: 7,
      name: "广东砂糖橘",
      category_id: 2,
      category_name: "柑橘类",
      price: 15.90,
      stock: 200,
      unit: "箱(约5斤)",
      image: "/src/img/7.png",
      description: "皮薄易剥无籽，果肉脆嫩化渣，甜度纯正无酸味，春节必备年货。",
      nutrition: "维生素C含量是橙子的1.5倍。",
      sweetness: "高甜度(糖度15-17度)",
      storage: "常温保存10天"
    },
    {
      id: 8,
      name: "以色列葡萄柚",
      category_id: 2,
      category_name: "柑橘类",
      price: 29.90,
      originalPrice: 36.00,
      stock: 70,
      unit: "箱(6个装)",
      image: "/src/img/8.png",
      description: "红心品种，果肉深红多汁，富含花青素，适合减肥人群食用。",
      nutrition: "富含柚皮苷，有助于控制血糖。",
      sweetness: "低酸微苦(糖度10-12度)",
      storage: "冷藏保存14天"
    },
    {
      id: 9,
      name: "云南褚橙",
      category_id: 2,
      category_name: "柑橘类",
      price: 49.90,
      stock: 60,
      unit: "箱(约10斤)",
      image: "/src/img/9.png",
      description: "褚时健培育的明星品种，24:1黄金甜酸比，果肉细腻无渣。",
      nutrition: "富含类黄酮，抗氧化能力突出。",
      sweetness: "黄金甜酸比(糖度13-15度)",
      storage: "常温保存20天"
    },
    {
      id: 10,
      name: "埃及橙",
      category_id: 2,
      category_name: "柑橘类",
      price: 36.90,
      stock: 80,
      unit: "箱(约8斤)",
      image: "/src/img/10.png",
      description: "尼罗河沿岸种植，皮薄多汁，酸甜平衡，带有独特花香。",
      nutrition: "维生素C含量是普通橙子的1.2倍。",
      sweetness: "中高甜度(糖度13-15度)",
      storage: "常温保存30天"
    },
    {
      id: 11,
      name: "澳洲手指青柠",
      category_id: 2,
      category_name: "柑橘类",
      price: 128.00,
      stock: 30,
      unit: "盒(100g)",
      image: "/src/img/11.png",
      description: "米其林餐厅专用食材，果肉呈鱼子酱状爆珠，带有独特柑橘清香。",
      nutrition: "柠檬酸含量是普通柠檬的2倍。",
      sweetness: "酸度突出(糖度6-8度)",
      storage: "冷藏保存10天"
    },
    {
      id: 12,
      name: "澳洲无籽红提",
      category_id: 3,
      category_name: "浆果类",
      price: 69.90,
      originalPrice: 89.90,
      stock: 50,
      unit: "箱(约2斤)",
      image: "/src/img/12.png",
      description: "澳洲无籽红提果实饱满，色泽鲜红，皮薄无籽，口感脆甜，带有淡淡的玫瑰香气。果粉是果实自然分泌的保护层。",
      nutrition: "富含花青素和多种矿物质，有助于抗氧化和心血管健康。每100克含钾约191毫克，花青素含量丰富。",
      sweetness: "中甜度(糖度15-17度)",
      storage: "冷藏保存10-14天，食用前清洗"
    },
    {
      id: 13,
      name: "智利进口车厘子",
      category_id: 3,
      category_name: "浆果类",
      price: 198.00,
      originalPrice: 258.00,
      stock: 40,
      unit: "箱(约5斤)",
      image: "/src/img/13.png",
      description: "智利车厘子产自南半球优质产区，果实饱满，色泽深红，果肉厚实，甜度高，口感脆爽。JJ级表示单果直径28-30mm。",
      nutrition: "富含花青素和铁元素，具有抗氧化作用，有助于美容养颜。每100克含铁约0.36毫克，花青素含量丰富。",
      sweetness: "中高甜度(糖度16-18度)",
      storage: "冷藏保存7-10天，食用前清洗"
    },
    {
      id: 14,
      name: "辽宁蓝莓",
      category_id: 3,
      category_name: "浆果类",
      price: 45.00,
      stock: 60,
      unit: "盒(125g*6盒)",
      image: "/src/img/14.png",
      description: "人工采摘筛选，果粉完整，颗粒饱满，爆浆口感明显。",
      nutrition: "花青素含量是普通水果的10倍以上。",
      sweetness: "中甜度(糖度12-14度)",
      storage: "冷藏保存7天"
    },
    {
      id: 15,
      name: "江苏黑树莓",
      category_id: 3,
      category_name: "浆果类",
      price: 58.00,
      stock: 30,
      unit: "盒(100g*8盒)",
      image: "/src/img/15.png",
      description: "稀有品种，中空造型独特，果香浓郁，酸甜平衡。",
      nutrition: "鞣花酸含量高，具有抗癌特性。",
      sweetness: "清甜微酸(糖度10-12度)",
      storage: "冷藏保存3天"
    },
    {
      id: 16,
      name: "云南黄金莓",
      category_id: 3,
      category_name: "浆果类",
      price: 65.00,
      stock: 25,
      unit: "盒(150g*4盒)",
      image: "/src/img/16.png",
      description: "高原种植品种，金黄色泽，皮薄无籽，蜂蜜般香甜。",
      nutrition: "富含叶黄素，有助于眼部健康。",
      sweetness: "蜜甜无酸(糖度16-18度)",
      storage: "冷藏保存5天"
    },
    {
      id: 17,
      name: "海南金煌芒果",
      category_id: 4,
      category_name: "热带水果",
      price: 39.90,
      originalPrice: 49.90,
      stock: 70,
      unit: "箱(约8斤)",
      image: "/src/img/17.png",
      description: "海南金煌芒果是芒果中的优质品种，果形大，单果重可达1-2斤。果肉橙黄色，肉质细腻，纤维极少。",
      nutrition: "富含维生素A、C和胡萝卜素，有助于保护视力和皮肤健康。每100克含维生素A约1500IU，维生素C约23毫克。",
      sweetness: "超高甜度(糖度18-22度)",
      storage: "常温放置2-3天后熟，熟后冷藏保存3-5天"
    },
    {
      id: 18,
      name: "泰国金枕头榴莲",
      category_id: 4,
      category_name: "热带水果",
      price: 159.00,
      originalPrice: 199.00,
      stock: 20,
      unit: "个(约3-4斤)",
      image: "/src/img/18.png",
      description: "泰国金枕头榴莲是榴莲中的优质品种，果肉金黄，口感细腻，甜度高，气味浓郁但不刺鼻。A级表示果肉饱满，出肉率高。",
      nutrition: "富含蛋白质、脂肪和多种维生素，热量较高，适量食用可补充能量。每100克含蛋白质约2.6克，脂肪约3.3克。",
      sweetness: "高甜度(糖度25-30度)",
      storage: "未开果常温保存，开果后冷藏并尽快食用"
    },
    {
      id: 19,
      name: "越南红心火龙果",
      category_id: 4,
      category_name: "热带水果",
      price: 29.90,
      originalPrice: 39.90,
      stock: 80,
      unit: "箱(约4个)",
      image: "/src/img/19.png",
      description: "越南红心火龙果果皮鲜红，果肉紫红色，富含天然色素，口感清甜多汁，籽粒细小可食用。红心火龙果的花青素含量高于白心品种。",
      nutrition: "富含花青素和膳食纤维，有助于抗氧化和肠道健康。每100克含膳食纤维约1.6克，花青素含量丰富。",
      sweetness: "中甜度(糖度13-15度)",
      storage: "阴凉处保存7天，冷藏可延长至2周"
    },
    {
      id: 20,
      name: "菲律宾菠萝蜜",
      category_id: 4,
      category_name: "热带水果",
      price: 39.90,
      stock: 30,
      unit: "个(约8-10斤)",
      image: "/src/img/20.png",
      description: "干苞品种，果肉金黄厚实，Q弹有嚼劲，带有焦糖香气。",
      nutrition: "富含植物蛋白和膳食纤维。",
      sweetness: "高甜度(糖度18-20度)",
      storage: "常温保存5天"
    },
    {
      id: 21,
      name: "海南贵妃芒",
      category_id: 4,
      category_name: "热带水果",
      price: 32.80,
      stock: 60,
      unit: "箱(约6斤)",
      image: "/src/img/21.png",
      description: "红黄渐变果皮，果核薄如纸，果肉细腻无纤维，入口即化。",
      nutrition: "β-胡萝卜素含量是普通芒果的3倍。",
      sweetness: "蜜甜无丝(糖度20-22度)",
      storage: "常温催熟后冷藏"
    },
    {
      id: 22,
      name: "泰国椰皇",
      category_id: 4,
      category_name: "热带水果",
      price: 15.90,
      stock: 100,
      unit: "个",
      image: "/src/img/22.png",
      description: "老椰品种，椰肉厚实雪白，椰水清甜富含电解质。",
      nutrition: "富含月桂酸，具有抗菌作用。",
      sweetness: "清甜爽口(糖度8-10度)",
      storage: "冷藏保存7天"
    },
    {
      id: 23,
      name: "台湾凤梨释迦",
      category_id: 4,
      category_name: "热带水果",
      price: 79.90,
      originalPrice: 99.90,
      stock: 25,
      unit: "个(约1-1.5斤)",
      image: "/src/img/23.png",
      description: "台湾凤梨释迦是释迦和凤梨的杂交品种，果肉Q弹，甜度高，带有凤梨香气，籽少肉多，口感独特。",
      nutrition: "富含维生素B群和矿物质，有助于新陈代谢和神经系统健康。每100克含维生素B1约0.1毫克，钾约250毫克。",
      sweetness: "超高甜度(糖度20-25度)",
      storage: "常温放置变软后食用，熟后冷藏保存2-3天"
    }
  ]
}

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

// 登录接口
export const login = (data) => {
  return new Promise((resolve) => {
    // 从localStorage获取注册用户
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // 合并模拟用户和注册用户
    const allUsers = [...mockData.users, ...users];
    
    const user = allUsers.find(
      u => u.username === data.username && u.password === data.password
    );
    
    if (user) {
      resolve({
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock-token-' + Date.now(),
          user_pic: user.user_pic || '/assets/default-avatar.png',
          nickname: user.nickname || user.username
        }
      });
    } else {
      resolve({
        code: 401,
        message: '用户名或密码错误'
      });
    }
  });
};

// 获取水果分类列表（带分页和搜索）
export const getCategories = (params) => {
  return new Promise((resolve) => {
    const { page = 1, limit = 5, name = '' } = params
    
    // 过滤分类列表
    let filteredCategories = [...mockData.categories]
    
    // 按名称搜索
    if (name) {
      filteredCategories = filteredCategories.filter(category => 
        category.name.toLowerCase().includes(name.toLowerCase())
      )
    }
    
    // 分页处理
    const start = (page - 1) * limit
    const end = start + limit
    const list = filteredCategories.slice(start, end)
    
    console.log('过滤后的分类列表:', filteredCategories)
    console.log('分页后的分类列表:', list)
    
    resolve({
      code: 200,
      message: '获取成功',
      data: {
        list,
        total: filteredCategories.length,
        page,
        limit
      }
    })
  })
}

// 获取水果列表（带分页和搜索）
export const getFruits = (params) => {
  return new Promise((resolve) => {
    const { page = 1, limit = 5, name = '', category_id = '' } = params
    
    // 过滤水果列表
    let filteredFruits = [...mockData.fruits]
    
    // 按名称搜索
    if (name) {
      filteredFruits = filteredFruits.filter(fruit => 
        fruit.name.toLowerCase().includes(name.toLowerCase())
      )
    }
    
    // 按分类筛选
    if (category_id) {
      filteredFruits = filteredFruits.filter(fruit => 
        fruit.category_id === category_id
      )
    }
    
    // 分页处理
    const start = (page - 1) * limit
    const end = start + limit
    const list = filteredFruits.slice(start, end)
    
    console.log('过滤后的水果列表:', filteredFruits)
    console.log('分页后的水果列表:', list)
    
    resolve({
      code: 200,
      message: '获取成功',
      data: {
        list,
        total: filteredFruits.length,
        page,
        limit
      }
    })
  })
}

// 添加水果分类
export const addCategory = (data) => {
  return new Promise((resolve) => {
    const newCategory = {
      id: mockData.categories.length + 1,
      ...data
    }
    mockData.categories.push(newCategory)
    resolve({
      code: 200,
      message: '添加成功',
      data: newCategory
    })
  })
}

// 添加水果
export const addFruit = (data) => {
  return new Promise((resolve) => {
    const newFruit = {
      id: mockData.fruits.length + 1,
      ...data
    }
    mockData.fruits.push(newFruit)
    resolve({
      code: 200,
      message: '添加成功',
      data: newFruit
    })
  })
}

// 更新水果分类
export const updateCategory = (id, data) => {
  return new Promise((resolve) => {
    const index = mockData.categories.findIndex(c => c.id === id)
    if (index !== -1) {
      mockData.categories[index] = { ...mockData.categories[index], ...data }
      resolve({
        code: 200,
        message: '更新成功',
        data: mockData.categories[index]
      })
    } else {
      resolve({
        code: 404,
        message: '分类不存在'
      })
    }
  })
}

// 更新水果
export const updateFruit = (id, data) => {
  return new Promise((resolve) => {
    const index = mockData.fruits.findIndex(f => f.id === id)
    if (index !== -1) {
      mockData.fruits[index] = { ...mockData.fruits[index], ...data }
      resolve({
        code: 200,
        message: '更新成功',
        data: mockData.fruits[index]
      })
    } else {
      resolve({
        code: 404,
        message: '水果不存在'
      })
    }
  })
}

// 删除水果分类
export const deleteCategory = (id) => {
  return new Promise((resolve) => {
    const index = mockData.categories.findIndex(c => c.id === id)
    if (index !== -1) {
      mockData.categories.splice(index, 1)
      resolve({
        code: 200,
        message: '删除成功'
      })
    } else {
      resolve({
        code: 404,
        message: '分类不存在'
      })
    }
  })
}

// 删除水果
export const deleteFruit = (id) => {
  return new Promise((resolve) => {
    const index = mockData.fruits.findIndex(f => f.id === id)
    if (index !== -1) {
      mockData.fruits.splice(index, 1)
      resolve({
        code: 200,
        message: '删除成功'
      })
    } else {
      resolve({
        code: 404,
        message: '水果不存在'
      })
    }
  })
}

// 获取用户资料
export const getUserProfile = () => {
  return new Promise((resolve) => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
    resolve({
      code: 200,
      message: '获取成功',
      data: {
        username: userInfo.username || '',
        nickname: userInfo.nickname || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        bio: userInfo.bio || '',
        user_pic: userInfo.user_pic || ''
      }
    })
  })
}

// 更新用户资料
export const updateUserProfile = (data) => {
  return new Promise((resolve) => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
    const updatedUserInfo = { ...userInfo, ...data }
    localStorage.setItem('user', JSON.stringify(updatedUserInfo))
    resolve({
      code: 200,
      message: '更新成功',
      data: updatedUserInfo
    })
  })
}

// 更新用户头像
export const updateUserAvatar = (data) => {
  return new Promise((resolve) => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
    const updatedUserInfo = { ...userInfo, user_pic: data.user_pic }
    localStorage.setItem('user', JSON.stringify(updatedUserInfo))
    resolve({
      code: 200,
      message: '更新成功',
      data: updatedUserInfo
    })
  })
}

// 更新用户密码
export const updateUserPassword = (data) => {
  return new Promise((resolve) => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
    if (userInfo.password !== data.oldPassword) {
      resolve({
        code: 400,
        message: '当前密码错误'
      })
      return
    }
    const updatedUserInfo = { ...userInfo, password: data.newPassword }
    localStorage.setItem('user', JSON.stringify(updatedUserInfo))
    resolve({
      code: 200,
      message: '密码修改成功'
    })
  })
}

// 添加退出登录接口
export const logout = () => {
  return request({
    url: '/logout',
    method: 'post'
  })
}
