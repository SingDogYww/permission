<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">
        <font-awesome-icon icon="home" />
        工作台
      </h1>
      <p class="page-subtitle">欢迎回来，{{ userInfo.name }}！今天是 {{ currentDate }}</p>
    </div>

    <!-- 数据卡片区 -->
    <div class="stats-grid">
      <div 
        v-for="stat in statsData" 
        :key="stat.key"
        class="stat-card"
        :class="stat.key"
      >
        <div class="stat-icon">
          <font-awesome-icon :icon="stat.icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-trend" :class="stat.trend.type">
            <font-awesome-icon :icon="stat.trend.type === 'up' ? 'arrow-up' : 'arrow-down'" />
            <span>{{ stat.trend.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表和通知区域 -->
    <div class="content-grid">
      <!-- 访问趋势图 -->
      <div class="chart-card">
        <div class="card-header">
          <h3>访问趋势</h3>
          <div class="chart-tabs">
            <button 
              v-for="period in chartPeriods" 
              :key="period.key"
              class="chart-tab"
              :class="{ active: activePeriod === period.key }"
              @click="activePeriod = period.key"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="trendChart" class="trend-chart"></canvas>
        </div>
      </div>

      <!-- 用户分布图 -->
      <div class="chart-card">
        <div class="card-header">
          <h3>用户角色分布</h3>
        </div>
        <div class="chart-container">
          <canvas ref="pieChart" class="pie-chart"></canvas>
        </div>
        <div class="chart-legend">
          <div 
            v-for="item in pieData" 
            :key="item.label"
            class="legend-item"
          >
            <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
            <span class="legend-label">{{ item.label }}</span>
            <span class="legend-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知和日志区域 -->
    <div class="info-grid">
      <!-- 系统通知 -->
      <div class="info-card">
        <div class="card-header">
          <h3>
            <font-awesome-icon icon="bell" />
            系统通知
          </h3>
          <a href="#" class="more-link">查看更多</a>
        </div>
        <div class="notification-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item"
            :class="notification.type"
          >
            <div class="notification-icon">
              <font-awesome-icon :icon="notification.icon" />
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
            <div class="notification-status" :class="{ read: notification.read }"></div>
          </div>
        </div>
      </div>

      <!-- 最近操作 -->
      <div class="info-card">
        <div class="card-header">
          <h3>
            <font-awesome-icon icon="history" />
            最近操作
          </h3>
          <a href="#" class="more-link">查看更多</a>
        </div>
        <div class="activity-list">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-avatar">
              <img :src="activity.user.avatar" :alt="activity.user.name" />
            </div>
            <div class="activity-content">
              <div class="activity-text">
                <strong>{{ activity.user.name }}</strong> {{ activity.action }}
              </div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="info-card">
        <div class="card-header">
          <h3>
            <font-awesome-icon icon="rocket" />
            快捷操作
          </h3>
        </div>
        <div class="quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.key"
            class="quick-action-btn"
            @click="handleQuickAction(action.key)"
          >
            <font-awesome-icon :icon="action.icon" />
            <span>{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const activePeriod = ref('week')
const trendChart = ref<HTMLCanvasElement>()
const pieChart = ref<HTMLCanvasElement>()

// 用户信息
const userInfo = ref({
  name: '管理员'
})

// 当前日期
const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})

// 统计数据
const statsData = ref([
  {
    key: 'users',
    label: '在线用户',
    value: '1,234',
    icon: 'users',
    trend: { type: 'up', value: 12 }
  },
  {
    key: 'visits',
    label: '今日访问',
    value: '8,765',
    icon: 'eye',
    trend: { type: 'up', value: 8 }
  },
  {
    key: 'health',
    label: '系统健康度',
    value: '98.5%',
    icon: 'heartbeat',
    trend: { type: 'up', value: 2 }
  },
  {
    key: 'tasks',
    label: '待处理事项',
    value: '23',
    icon: 'tasks',
    trend: { type: 'down', value: 5 }
  }
])

// 图表时间段
const chartPeriods = [
  { key: 'day', label: '今日' },
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' }
]

// 饼图数据
const pieData = ref([
  { label: '管理员', value: 15, color: '#00eeff' },
  { label: '普通用户', value: 234, color: '#00b4db' },
  { label: '访客', value: 89, color: '#0083b0' }
])

// 通知数据
const notifications = ref([
  {
    id: 1,
    type: 'info',
    icon: 'info-circle',
    title: '系统将于今晚23:00进行维护升级',
    time: '2小时前',
    read: false
  },
  {
    id: 2,
    type: 'warning',
    icon: 'exclamation-triangle',
    title: '发现异常登录行为，请注意安全',
    time: '4小时前',
    read: false
  },
  {
    id: 3,
    type: 'success',
    icon: 'check-circle',
    title: '数据备份已完成',
    time: '1天前',
    read: true
  }
])

// 最近操作
const recentActivities = ref([
  {
    id: 1,
    user: {
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan'
    },
    action: '创建了新用户 "李四"',
    time: '10分钟前'
  },
  {
    id: 2,
    user: {
      name: '王五',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu'
    },
    action: '修改了角色权限',
    time: '30分钟前'
  },
  {
    id: 3,
    user: {
      name: '赵六',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu'
    },
    action: '导出了用户数据',
    time: '1小时前'
  }
])

// 快捷操作
const quickActions = ref([
  { key: 'addUser', label: '添加用户', icon: 'user-plus' },
  { key: 'addRole', label: '创建角色', icon: 'user-tag' },
  { key: 'systemLog', label: '查看日志', icon: 'file-alt' },
  { key: 'backup', label: '数据备份', icon: 'download' }
])

// 方法
const handleQuickAction = (key: string) => {
  switch (key) {
    case 'addUser':
      router.push('/permission/user')
      break
    case 'addRole':
      router.push('/permission/role')
      break
    case 'systemLog':
      router.push('/system/logs')
      break
    case 'backup':
      console.log('执行数据备份')
      break
  }
}

// 绘制趋势图
const drawTrendChart = () => {
  if (!trendChart.value) return
  
  const ctx = trendChart.value.getContext('2d')
  if (!ctx) return
  
  const canvas = trendChart.value
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  
  // 设置画布尺寸
  canvas.width = width * window.devicePixelRatio
  canvas.height = height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  // 模拟数据
  const data = [120, 190, 300, 500, 200, 300, 450]
  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  
  // 绘制网格线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  
  for (let i = 0; i <= 5; i++) {
    const y = (height / 5) * i
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(width - 20, y)
    ctx.stroke()
  }
  
  // 绘制折线
  const stepX = (width - 60) / (data.length - 1)
  const maxValue = Math.max(...data)
  
  ctx.strokeStyle = '#00eeff'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  data.forEach((value, index) => {
    const x = 40 + index * stepX
    const y = height - 20 - ((value / maxValue) * (height - 40))
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
  
  // 绘制数据点
  ctx.fillStyle = '#00eeff'
  data.forEach((value, index) => {
    const x = 40 + index * stepX
    const y = height - 20 - ((value / maxValue) * (height - 40))
    
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })
}

// 绘制饼图
const drawPieChart = () => {
  if (!pieChart.value) return
  
  const ctx = pieChart.value.getContext('2d')
  if (!ctx) return
  
  const canvas = pieChart.value
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  
  canvas.width = width * window.devicePixelRatio
  canvas.height = height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 3
  
  const total = pieData.value.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -Math.PI / 2
  
  pieData.value.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.lineTo(centerX, centerY)
    ctx.fillStyle = item.color
    ctx.fill()
    
    currentAngle += sliceAngle
  })
}

onMounted(async () => {
  await nextTick()
  drawTrendChart()
  drawPieChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    setTimeout(() => {
      drawTrendChart()
      drawPieChart()
    }, 100)
  })
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.page-title .fa-icon,
.page-title svg {
  color: #00eeff;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  margin: 0;
}

/* 数据卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #00eeff, #00b4db);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 238, 255, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(0, 238, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #00eeff;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.up {
  color: #2ecc71;
}

.stat-trend.down {
  color: #e74c3c;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header h3 {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-tabs {
  display: flex;
  gap: 8px;
}

.chart-tab {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.chart-tab:hover,
.chart-tab.active {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
  border-color: #00eeff;
}

.chart-container {
  height: 300px;
  position: relative;
}

.trend-chart,
.pie-chart {
  width: 100%;
  height: 100%;
}

.chart-legend {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
}

.legend-value {
  color: #00eeff;
  font-weight: 500;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.info-card {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
}

.more-link {
  color: #00eeff;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
}

.more-link:hover {
  color: #00b4db;
}

/* 通知列表 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.notification-item.info {
  border-left-color: #3498db;
}

.notification-item.warning {
  border-left-color: #f39c12;
}

.notification-item.success {
  border-left-color: #2ecc71;
}

.notification-icon {
  width: 20px;
  text-align: center;
  margin-top: 2px;
}

.notification-content {
  flex: 1;
}

.notification-title {
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.notification-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00eeff;
  margin-top: 6px;
}

.notification-status.read {
  background: rgba(255, 255, 255, 0.3);
}

/* 活动列表 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(0, 238, 255, 0.3);
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.activity-text strong {
  color: #00eeff;
}

.activity-time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  background: rgba(0, 238, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.quick-action-btn:hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 238, 255, 0.2);
}

.quick-action-btn .fa-icon,
.quick-action-btn svg {
  font-size: 24px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style> 