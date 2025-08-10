<template>
  <div class="user-detail-view">
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <font-awesome-icon icon="arrow-left" />
          返回
        </button>
        <h1 class="page-title">
          <font-awesome-icon icon="user" />
          用户详情
        </h1>
      </div>
      <div class="header-actions">
        <button class="action-btn primary" @click="editUser">
          <font-awesome-icon icon="edit" />
          编辑用户
        </button>
        <button 
          class="action-btn" 
          :class="user.status === 'active' ? 'warning' : 'success'"
          @click="toggleUserStatus"
        >
          <font-awesome-icon :icon="user.status === 'active' ? 'ban' : 'check'" />
          {{ user.status === 'active' ? '禁用用户' : '启用用户' }}
        </button>
      </div>
    </div>

    <div class="detail-content">
      <!-- 基本信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <h3>基本信息</h3>
        </div>
        <div class="card-body">
          <div class="user-profile">
            <div class="avatar-section">
              <img :src="user.avatar" :alt="user.name" class="user-avatar" />
              <div class="status-indicator" :class="user.status"></div>
            </div>
            <div class="profile-info">
              <h2 class="user-name">{{ user.name }}</h2>
              <p class="user-title">{{ getRoleLabel(user.role) }}</p>
              <div class="status-badge" :class="user.status">
                {{ user.status === 'active' ? '活跃' : '已禁用' }}
              </div>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <label>用户ID</label>
              <span>{{ user.id }}</span>
            </div>
            <div class="info-item">
              <label>邮箱地址</label>
              <span>{{ user.email }}</span>
            </div>
            <div class="info-item">
              <label>手机号码</label>
              <span>{{ user.phone }}</span>
            </div>
            <div class="info-item">
              <label>用户角色</label>
              <span class="role-tag" :class="user.role">
                {{ getRoleLabel(user.role) }}
              </span>
            </div>
            <div class="info-item">
              <label>创建时间</label>
              <span>{{ user.createdAt }}</span>
            </div>
            <div class="info-item">
              <label>最后登录</label>
              <span>{{ user.lastLogin || '从未登录' }}</span>
            </div>
            <div class="info-item">
              <label>登录次数</label>
              <span>{{ user.loginCount || 0 }} 次</span>
            </div>
            <div class="info-item">
              <label>最后活跃</label>
              <span>{{ user.lastActive || '未知' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户组信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <h3>用户组信息</h3>
        </div>
        <div class="card-body">
          <div class="permission-section">
            <div class="section-title">所属用户组</div>
            <div class="group-tags">
              <span v-if="user.userGroup" class="group-tag">
                {{ getUserGroupName(user.userGroup) }}
              </span>
              <span v-else class="empty-text">暂无用户组</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动日志卡片 -->
      <div class="info-card">
        <div class="card-header">
          <h3>最近活动</h3>
        </div>
        <div class="card-body">
          <div class="activity-list">
            <div v-for="activity in user.activities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <font-awesome-icon :icon="getActivityIcon(activity.type)" />
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-desc">{{ activity.description }}</div>
                <div class="activity-time">{{ activity.createdAt }}</div>
              </div>
            </div>
            <div v-if="!user.activities?.length" class="empty-text">暂无活动记录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 模拟用户详细数据
const user = ref({
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138001',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  role: 'admin',
  status: 'active',
  lastLogin: '2024-01-15 10:30:00',
  createdAt: '2024-01-01 09:00:00',
  loginCount: 156,
  lastActive: '2024-01-15 10:30:00',
  userGroup: 'admin',
  activities: [
    {
      id: '1',
      type: 'login',
      title: '用户登录',
      description: '从 192.168.1.100 登录系统',
      createdAt: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      type: 'edit',
      title: '修改密码',
      description: '用户修改了登录密码',
      createdAt: '2024-01-14 15:20:00'
    },
    {
      id: '3',
      type: 'permission',
      title: '权限变更',
      description: '管理员为用户分配了新的权限',
      createdAt: '2024-01-10 09:15:00'
    }
  ]
})

const goBack = () => {
  router.go(-1)
}

const editUser = () => {
  // TODO: 跳转到编辑用户页面或打开编辑弹窗
  console.log('编辑用户:', user.value)
}

const toggleUserStatus = () => {
  const action = user.value.status === 'active' ? '禁用' : '启用'
  if (confirm(`确定要${action}用户 "${user.value.name}" 吗？`)) {
    user.value.status = user.value.status === 'active' ? 'inactive' : 'active'
    console.log('用户状态已变更:', user.value)
  }
}

const getRoleLabel = (role: string) => {
  const roleLabels: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客'
  }
  return roleLabels[role] || role
}

const getUserGroupName = (groupId: string) => {
  const groupNames: Record<string, string> = {
    admin: '管理员组',
    system: '系统管理员',
    operator: '操作员',
    viewer: '查看员'
  }
  return groupNames[groupId] || groupId
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    login: 'sign-in-alt',
    edit: 'edit',
    permission: 'key',
    create: 'plus',
    delete: 'trash'
  }
  return icons[type] || 'info'
}

onMounted(() => {
  // 根据路由参数加载用户数据
  const userId = route.params.id
  console.log('加载用户详情:', userId)
  // TODO: 从API加载用户详情数据
})
</script>

<style scoped>
.user-detail-view {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
  border-color: #00eeff;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.page-title .fa-icon,
.page-title svg {
  color: #00eeff;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.action-btn:hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
  border-color: #00eeff;
}

.action-btn.primary {
  background: linear-gradient(45deg, #00eeff, #00b4db);
  color: #0f2027;
  border-color: transparent;
}

.action-btn.primary:hover {
  background: linear-gradient(45deg, #00b4db, #00eeff);
}

.action-btn.warning {
  color: #f39c12;
  border-color: rgba(243, 156, 18, 0.3);
}

.action-btn.warning:hover {
  background: rgba(243, 156, 18, 0.1);
  border-color: #f39c12;
}

.action-btn.success {
  color: #2ecc71;
  border-color: rgba(46, 204, 113, 0.3);
}

.action-btn.success:hover {
  background: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background: rgba(0, 238, 255, 0.1);
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
}

.card-header h3 {
  color: #00eeff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 24px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.avatar-section {
  position: relative;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid rgba(0, 238, 255, 0.3);
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 3px solid rgba(15, 23, 42, 0.8);
}

.status-indicator.active {
  background: #2ecc71;
}

.status-indicator.inactive {
  background: #95a5a6;
}

.profile-info {
  flex: 1;
}

.user-name {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
}

.user-title {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 16px 0;
}

.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.active {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-badge.inactive {
  background: rgba(149, 165, 166, 0.2);
  color: #95a5a6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.info-item span {
  font-size: 16px;
  color: #fff;
}

.role-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-tag.admin {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.role-tag.user {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.role-tag.guest {
  background: rgba(149, 165, 166, 0.2);
  color: #95a5a6;
}

.permission-section {
  margin-bottom: 24px;
}

.permission-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
}

.group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.group-tag {
  padding: 6px 12px;
  background: rgba(0, 238, 255, 0.2);
  color: #00eeff;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.permission-item {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #00eeff;
}

.permission-name {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
}

.permission-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.login {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.activity-icon.edit {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.activity-icon.permission {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.activity-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.empty-text {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  text-align: center;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .header-left {
    justify-content: center;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .user-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .activity-item {
    gap: 12px;
  }
  
  .activity-icon {
    width: 32px;
    height: 32px;
  }
}
</style> 