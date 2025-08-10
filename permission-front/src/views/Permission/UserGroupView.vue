<template>
  <div class="user-group-view">
    <div class="page-header">
      <h1 class="page-title">
        <font-awesome-icon icon="users" />
        用户组管理
      </h1>
      <p class="page-subtitle">管理用户组信息，分配用户和角色权限</p>
    </div>

    <!-- 搜索和操作区域 -->
    <div class="toolbar">
      <div class="search-section">
        <div class="search-group">
          <font-awesome-icon icon="search" class="search-icon" />
          <input 
            v-model="searchForm.keyword" 
            type="text" 
            placeholder="搜索用户组名称或描述" 
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
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
        <button class="action-btn primary" @click="showAddUserGroupModal = true">
          <font-awesome-icon icon="plus" />
          添加用户组
        </button>
        <button class="action-btn" @click="exportUserGroups">
          <font-awesome-icon icon="download" />
          导出
        </button>
      </div>
    </div>

    <!-- 用户组表格 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="handleSelectAll" />
            </th>
            <th>用户组信息</th>
            <th>状态</th>
            <th>用户数量</th>
            <th>角色数量</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="userGroup in filteredUserGroups" :key="userGroup.id" class="table-row">
            <td>
              <input 
                type="checkbox" 
                :value="userGroup.id" 
                v-model="selectedUserGroups"
              />
            </td>
            <td>
              <div class="usergroup-info" @click="viewUserGroupDetail(userGroup)">
                <div class="usergroup-icon">
                  <font-awesome-icon icon="users" />
                </div>
                <div class="usergroup-details">
                  <div class="usergroup-name">{{ userGroup.name }}</div>
                  <div class="usergroup-code">{{ userGroup.code }}</div>
                  <div class="usergroup-description">{{ userGroup.description }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="status-tag" :class="userGroup.status">
                {{ userGroup.status === 'active' ? '启用' : '禁用' }}
              </span>
            </td>
            <td class="text-center">
              <span class="count-badge">{{ userGroup.userCount }}</span>
            </td>
            <td class="text-center">
              <span class="count-badge">{{ userGroup.roleCount }}</span>
            </td>
            <td class="text-muted">{{ userGroup.createdAt }}</td>
            <td>
              <div class="action-buttons">
                <button 
                  class="action-btn small" 
                  @click="editUserGroup(userGroup)"
                  title="编辑基本信息"
                >
                  <font-awesome-icon icon="edit" />
                </button>
                <button 
                  class="action-btn small" 
                  :class="userGroup.status === 'active' ? 'warning' : 'success'"
                  @click="toggleUserGroupStatus(userGroup)"
                  :title="userGroup.status === 'active' ? '禁用' : '启用'"
                >
                  <font-awesome-icon 
                    :icon="userGroup.status === 'active' ? 'ban' : 'check'" 
                  />
                </button>
                <button 
                  class="action-btn small danger" 
                  @click="deleteUserGroup(userGroup)"
                  title="删除"
                >
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
        共 {{ total }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="pagination-controls">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <font-awesome-icon icon="chevron-left" />
          上一页
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </div>

    <!-- 用户组添加/编辑弹窗 -->
    <UserGroupModal
      :visible="showAddUserGroupModal || showEditUserGroupModal"
      :user-group="currentUserGroup"
      :is-edit="showEditUserGroupModal"
      @close="handleCloseUserGroupModal"
      @submit="handleUserGroupSubmit"
    />

    <!-- 用户组基本信息编辑弹窗 -->
    <UserGroupBasicModal
      :visible="showEditBasicModal"
      :user-group="currentUserGroup"
      @close="handleCloseBasicModal"
      @submit="handleBasicInfoSubmit"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UserGroupModal from '@/components/Common/UserGroupModal.vue'
import UserGroupBasicModal from '@/components/Common/UserGroupBasicModal.vue'
import ConfirmModal from '@/components/Common/ConfirmModal.vue'

const router = useRouter()

interface UserGroup {
  id: string
  name: string
  code: string
  description: string
  status: string
  userCount: number
  roleCount: number
  createdAt: string
  updatedAt: string
}

// 响应式数据
const searchForm = ref({
  keyword: '',
  status: ''
})

const showAddUserGroupModal = ref(false)
const showEditUserGroupModal = ref(false)
const showEditBasicModal = ref(false)
const showConfirmModal = ref(false)
const currentUserGroup = ref<UserGroup | null>(null)
const confirmConfig = ref<any>({})
const selectedUserGroups = ref<string[]>([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟用户组数据
const userGroups = ref<UserGroup[]>([
  {
    id: '1',
    name: '管理员组',
    code: 'admin_group',
    description: '系统管理员用户组，拥有所有权限',
    status: 'active',
    userCount: 3,
    roleCount: 2,
    createdAt: '2024-01-01 09:00:00',
    updatedAt: '2024-01-15 10:30:00'
  },
  {
    id: '2',
    name: '运营组',
    code: 'operator_group',
    description: '运营人员用户组，负责日常运营管理',
    status: 'active',
    userCount: 8,
    roleCount: 3,
    createdAt: '2024-01-02 10:00:00',
    updatedAt: '2024-01-14 15:20:00'
  },
  {
    id: '3',
    name: '客服组',
    code: 'service_group',
    description: '客服人员用户组，处理客户相关事务',
    status: 'active',
    userCount: 12,
    roleCount: 2,
    createdAt: '2024-01-03 11:00:00',
    updatedAt: '2024-01-13 14:10:00'
  },
  {
    id: '4',
    name: '财务组',
    code: 'finance_group',
    description: '财务人员用户组，负责财务相关工作',
    status: 'active',
    userCount: 5,
    roleCount: 4,
    createdAt: '2024-01-04 12:00:00',
    updatedAt: '2024-01-12 16:30:00'
  },
  {
    id: '5',
    name: '测试组',
    code: 'test_group',
    description: '测试环境用户组，用于系统测试',
    status: 'inactive',
    userCount: 2,
    roleCount: 1,
    createdAt: '2024-01-05 13:00:00',
    updatedAt: '2024-01-11 09:45:00'
  },
  {
    id: '6',
    name: '外部合作方',
    code: 'external_group',
    description: '外部合作伙伴用户组，有限权限访问',
    status: 'active',
    userCount: 6,
    roleCount: 2,
    createdAt: '2024-01-06 14:00:00',
    updatedAt: '2024-01-10 11:20:00'
  }
])

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const filteredUserGroups = computed(() => {
  let filtered = userGroups.value
  
  // 关键词搜索
  if (searchForm.value.keyword) {
    const keyword = searchForm.value.keyword.toLowerCase()
    filtered = filtered.filter(group => 
      group.name.toLowerCase().includes(keyword) ||
      group.code.toLowerCase().includes(keyword) ||
      group.description.toLowerCase().includes(keyword)
    )
  }
  
  // 状态筛选
  if (searchForm.value.status) {
    filtered = filtered.filter(group => group.status === searchForm.value.status)
  }
  
  return filtered
})

// 方法
const handleSearch = () => {
  console.log('搜索用户组:', searchForm.value)
  // TODO: 实现搜索逻辑
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedUserGroups.value = filteredUserGroups.value.map(group => group.id)
  } else {
    selectedUserGroups.value = []
  }
}

const viewUserGroupDetail = (userGroup: UserGroup) => {
  router.push(`/permission/user-group/${userGroup.id}`)
}

const editUserGroup = (userGroup: UserGroup) => {
  currentUserGroup.value = userGroup
  showEditBasicModal.value = true
}

const toggleUserGroupStatus = (userGroup: UserGroup) => {
  const newStatus = userGroup.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '禁用'
  
  confirmConfig.value = {
    title: `${action}用户组`,
    message: `确定要${action}用户组 "${userGroup.name}" 吗？`,
    details: newStatus === 'inactive' 
      ? ['禁用后，该用户组下的所有用户将无法正常使用相关功能。']
      : ['启用后，该用户组下的用户将恢复正常功能。'],
    type: newStatus === 'inactive' ? 'warning' : 'success',
    confirmText: action,
    confirmIcon: newStatus === 'active' ? 'check' : 'ban',
    action: () => {
      userGroup.status = newStatus
      userGroup.updatedAt = new Date().toLocaleString()
      console.log(`${action}用户组:`, userGroup)
    }
  }
  showConfirmModal.value = true
}

const deleteUserGroup = (userGroup: UserGroup) => {
  confirmConfig.value = {
    title: '删除用户组',
    message: `确定要删除用户组 "${userGroup.name}" 吗？`,
    details: [
      `删除后，该用户组下的 ${userGroup.userCount} 个用户将失去组关联，${userGroup.roleCount} 个角色绑定将被移除。`,
      '此操作不可撤销。'
    ],
    type: 'danger',
    confirmText: '删除',
    confirmIcon: 'trash',
    action: () => {
      const index = userGroups.value.findIndex(g => g.id === userGroup.id)
      if (index > -1) {
        userGroups.value.splice(index, 1)
        total.value = userGroups.value.length
      }
      console.log('删除用户组:', userGroup)
    }
  }
  showConfirmModal.value = true
}

const exportUserGroups = () => {
  console.log('导出用户组')
  // TODO: 实现导出功能
}

const handleUserGroupSubmit = (data: any) => {
  if (showEditUserGroupModal.value && currentUserGroup.value) {
    // 编辑用户组
    const index = userGroups.value.findIndex(g => g.id === currentUserGroup.value!.id)
    if (index > -1) {
      userGroups.value[index] = {
        ...userGroups.value[index],
        ...data,
        updatedAt: new Date().toLocaleString()
      }
    }
    console.log('编辑用户组:', data)
  } else {
    // 添加用户组
    const newUserGroup: UserGroup = {
      id: Date.now().toString(),
      name: data.name,
      code: data.code,
      description: data.description,
      status: data.status,
      userCount: data.users ? data.users.length : 0,
      roleCount: data.roles ? data.roles.length : 0,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString()
    }
    userGroups.value.unshift(newUserGroup)
    total.value = userGroups.value.length
    console.log('添加用户组:', newUserGroup)
  }
  
  handleCloseUserGroupModal()
}

const handleCloseUserGroupModal = () => {
  showAddUserGroupModal.value = false
  showEditUserGroupModal.value = false
  currentUserGroup.value = null
}

const handleBasicInfoSubmit = (data: any) => {
  if (currentUserGroup.value) {
    // 编辑用户组基本信息
    const index = userGroups.value.findIndex(g => g.id === currentUserGroup.value!.id)
    if (index > -1) {
      userGroups.value[index] = {
        ...userGroups.value[index],
        ...data,
        updatedAt: new Date().toLocaleString()
      }
    }
    console.log('编辑用户组基本信息:', data)
  }
  
  handleCloseBasicModal()
}

const handleCloseBasicModal = () => {
  showEditBasicModal.value = false
  currentUserGroup.value = null
}

const handleConfirm = () => {
  if (confirmConfig.value.action) {
    confirmConfig.value.action()
  }
  showConfirmModal.value = false
}

onMounted(() => {
  total.value = userGroups.value.length
})
</script>

<style scoped>
.user-group-view {
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

.usergroup-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.usergroup-icon {
  width: 48px;
  height: 48px;
  background: rgba(0, 238, 255, 0.1);
  border: 2px solid rgba(0, 238, 255, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00eeff;
  font-size: 20px;
}

.usergroup-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.usergroup-name {
  font-weight: 500;
  color: #fff;
  font-size: 16px;
}

.usergroup-code {
  font-size: 12px;
  color: rgba(0, 238, 255, 0.8);
  font-family: 'Courier New', monospace;
}

.usergroup-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.text-center {
  text-align: center;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: rgba(0, 238, 255, 0.1);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 12px;
  color: #00eeff;
  font-size: 12px;
  font-weight: 500;
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
  display: flex;
  align-items: center;
  gap: 6px;
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
  
  .usergroup-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .usergroup-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .usergroup-description {
    max-width: 200px;
  }
}
</style> 