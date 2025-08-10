<template>
  <div class="user-view">
    <div class="page-header">
      <h1 class="page-title">
        <font-awesome-icon icon="user" />
        用户管理
      </h1>
      <p class="page-subtitle">管理系统用户信息、状态和权限</p>
    </div>

    <!-- 搜索和操作区域 -->
    <div class="toolbar">
      <div class="search-section">
        <div class="search-group">
          <font-awesome-icon icon="search" class="search-icon" />
          <input 
            v-model="searchForm.keyword" 
            type="text" 
            placeholder="搜索用户名、邮箱或手机号" 
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <select v-model="searchForm.role" class="filter-select">
          <option value="">全部角色</option>
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
          <option value="guest">访客</option>
        </select>
        <select v-model="searchForm.status" class="filter-select">
          <option value="">全部状态</option>
          <option value="active">启用</option>
          <option value="inactive">禁用</option>
        </select>
        <button class="search-btn" @click="handleSearch">
          <font-awesome-icon icon="search" />
          搜索
        </button>
      </div>
      
      <div class="action-section">
        <button class="action-btn primary" @click="showAddUserModal = true">
          <font-awesome-icon icon="user-plus" />
          添加用户
        </button>
        <button class="action-btn" @click="showImportModal = true">
          <font-awesome-icon icon="file-import" />
          导入
        </button>
        <button class="action-btn" @click="exportUsers">
          <font-awesome-icon icon="download" />
          导出
        </button>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="handleSelectAll" />
            </th>
            <th>用户信息</th>
            <th>角色</th>
            <th>状态</th>
            <th>最后登录</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="table-row">
            <td>
              <input 
                type="checkbox" 
                :value="user.id" 
                v-model="selectedUsers"
              />
            </td>
            <td>
              <div class="user-info" @click="viewUserDetail(user)">
                <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                <div class="user-details">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                  <div class="user-phone">{{ user.phone }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="role-tag" :class="user.role">
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td>
              <span class="status-tag" :class="user.status">
                {{ user.status === 'active' ? '启用' : '禁用' }}
              </span>
            </td>
            <td class="text-muted">{{ user.lastLogin || '从未登录' }}</td>
            <td class="text-muted">{{ user.createdAt }}</td>
            <td>
              <div class="action-buttons">
                <button class="action-btn small" @click="editUser(user)" title="编辑用户">
                  <font-awesome-icon icon="edit" />
                </button>
                <button 
                  class="action-btn small" 
                  :class="user.status === 'active' ? 'warning' : 'success'"
                  @click="toggleUserStatus(user)"
                  :title="user.status === 'active' ? '禁用用户' : '启用用户'"
                >
                  <font-awesome-icon :icon="user.status === 'active' ? 'ban' : 'check'" />
                </button>
                <button class="action-btn small danger" @click="deleteUser(user)" title="删除用户">
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <div class="pagination-info">
        显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, total) }} 条，共 {{ total }} 条
      </div>
      <div class="pagination-controls">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <font-awesome-icon icon="chevron-left" />
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </div>

    <!-- 用户添加弹窗 -->
    <UserModal
      :visible="showAddUserModal"
      :is-edit="false"
      @close="handleCloseUserModal"
      @submit="handleUserSubmit"
    />

    <!-- 用户编辑弹窗 -->
    <UserModal
      :visible="showEditUserModal"
      :user="currentUser"
      :is-edit="true"
      @close="handleCloseUserModal"
      @submit="handleUserSubmit"
    />

    <!-- 确认弹窗 -->
    <ConfirmModal
      :visible="showConfirmModal"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :details="confirmConfig.details"
      :type="confirmConfig.type"
      :confirm-text="confirmConfig.confirmText"
      :confirm-icon="confirmConfig.confirmIcon"
      @close="showConfirmModal = false"
      @confirm="handleConfirm"
    />

    <!-- 导入弹窗 -->
    <ImportModal
      :visible="showImportModal"
      @close="showImportModal = false"
      @import="handleUserImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UserModal from '@/components/Common/UserModal.vue'
import ConfirmModal from '@/components/Common/ConfirmModal.vue'
import ImportModal from '@/components/Common/ImportModal.vue'

const router = useRouter()

// 响应式数据
const searchForm = ref({
  keyword: '',
  role: '',
  status: ''
})

const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showConfirmModal = ref(false)
const showImportModal = ref(false)
const currentUser = ref<any>(null)
const confirmConfig = ref<any>({})
const selectedUsers = ref<string[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟用户数据
const users = ref([
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    role: 'admin',
    status: 'active',
    userGroup: 'admin',
    lastLogin: '2024-01-15 10:30:00',
    createdAt: '2024-01-01 09:00:00'
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    role: 'user',
    status: 'active',
    userGroup: 'operator',
    lastLogin: '2024-01-14 15:20:00',
    createdAt: '2024-01-02 10:00:00'
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    role: 'user',
    status: 'inactive',
    userGroup: 'viewer',
    lastLogin: null,
    createdAt: '2024-01-03 11:00:00'
  }
])

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 方法
const getRoleLabel = (role: string) => {
  const roleLabels: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客'
  }
  return roleLabels[role] || role
}

const handleSearch = () => {
  console.log('搜索用户:', searchForm.value)
  // TODO: 实现搜索逻辑
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = users.value.map(user => user.id)
  } else {
    selectedUsers.value = []
  }
}

const viewUserDetail = (user: any) => {
  router.push(`/permission/user/${user.id}`)
}

const editUser = (user: any) => {
  currentUser.value = user
  showEditUserModal.value = true
}

const toggleUserStatus = (user: any) => {
  const action = user.status === 'active' ? '禁用' : '启用'
  const type = user.status === 'active' ? 'warning' : 'success'
  
  confirmConfig.value = {
    title: `${action}用户`,
    message: `确定要${action}用户 "${user.name}" 吗？`,
    details: [
      `用户名：${user.name}`,
      `邮箱：${user.email}`,
      `当前状态：${user.status === 'active' ? '启用' : '禁用'}`
    ],
    type: type,
    confirmText: action,
    confirmIcon: user.status === 'active' ? 'ban' : 'check',
    onConfirm: () => {
  user.status = user.status === 'active' ? 'inactive' : 'active'
      console.log('用户状态已变更:', user)
      // TODO: 调用API更新用户状态
    }
  }
  
  showConfirmModal.value = true
}

const deleteUser = (user: any) => {
  confirmConfig.value = {
    title: '删除用户',
    message: `确定要删除用户 "${user.name}" 吗？`,
    details: [
      `用户名：${user.name}`,
      `邮箱：${user.email}`,
      '删除后无法恢复，请谨慎操作！'
    ],
    type: 'danger',
    confirmText: '删除',
    confirmIcon: 'trash',
    onConfirm: () => {
      // 从列表中移除用户
      const index = users.value.findIndex(u => u.id === user.id)
      if (index > -1) {
        users.value.splice(index, 1)
        total.value = users.value.length
      }
      console.log('用户已删除:', user)
      // TODO: 调用API删除用户
  }
  }
  
  showConfirmModal.value = true
}

const exportUsers = () => {
  console.log('导出用户数据')
  // TODO: 实现导出逻辑
}

// 处理用户提交（添加或编辑）
const handleUserSubmit = (userData: any) => {
  if (currentUser.value) {
    // 编辑用户
    const index = users.value.findIndex(u => u.id === currentUser.value.id)
    if (index > -1) {
      users.value[index] = { ...users.value[index], ...userData }
    }
    console.log('用户已更新:', userData)
  } else {
    // 添加用户
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      lastLogin: null,
      createdAt: new Date().toLocaleString()
    }
    users.value.push(newUser)
    total.value = users.value.length
    console.log('用户已添加:', newUser)
  }
  // TODO: 调用API保存用户数据
}

// 处理用户导入
const handleUserImport = (importedUsers: any[]) => {
  importedUsers.forEach(userData => {
    const newUser = {
      ...userData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      lastLogin: null,
      createdAt: new Date().toLocaleString()
    }
    users.value.push(newUser)
  })
  total.value = users.value.length
  console.log(`成功导入 ${importedUsers.length} 个用户`)
  // TODO: 调用API批量保存用户数据
}

// 处理确认操作
const handleConfirm = () => {
  if (confirmConfig.value.onConfirm) {
    confirmConfig.value.onConfirm()
  }
}

// 关闭弹窗时重置当前用户
const handleCloseUserModal = () => {
  currentUser.value = null
  showAddUserModal.value = false
  showEditUserModal.value = false
}

onMounted(() => {
  total.value = users.value.length
})
</script>

<style scoped>
.user-view {
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

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 24px;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.search-group {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00eeff;
  box-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.filter-select {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #00eeff;
}

.filter-select option {
  background: #1a2332;
  color: #fff;
}

.search-btn {
  padding: 12px 20px;
  background: linear-gradient(45deg, #00eeff, #00b4db);
  border: none;
  border-radius: 8px;
  color: #0f2027;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-btn:hover {
  background: linear-gradient(45deg, #00b4db, #00eeff);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 238, 255, 0.3);
}

.action-section {
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

.action-btn.small {
  padding: 8px;
  font-size: 12px;
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

.action-btn.danger {
  color: #e74c3c;
  border-color: rgba(231, 76, 60, 0.3);
}

.action-btn.danger:hover {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
}

/* 表格 */
.table-container {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
  font-weight: 600;
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

.table-row:hover {
  background: rgba(0, 238, 255, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(0, 238, 255, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: #fff;
}

.user-email,
.user-phone {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.role-tag {
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

.status-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.active {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-tag.inactive {
  background: rgba(149, 165, 166, 0.2);
  color: #95a5a6;
}

.text-muted {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
}

.pagination-info {
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:not(:disabled):hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
  border-color: #00eeff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #00eeff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .action-section {
    justify-content: center;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px 8px;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
  }
}
</style> 