<template>
  <div class="usergroup-detail-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <font-awesome-icon icon="arrow-left" />
          返回列表
        </button>
        <div class="breadcrumb">
          <span class="breadcrumb-item">用户组管理</span>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-item current">{{ userGroup.name }}</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn primary" @click="editUserGroup">
          <font-awesome-icon icon="edit" />
          编辑基本信息
        </button>
      </div>
    </div>

    <div class="detail-content">
      <!-- 基本信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <h3>
            <font-awesome-icon icon="users" />
            基本信息
          </h3>
        </div>
        <div class="card-body">
          <div class="usergroup-profile">
            <div class="icon-section">
              <div class="usergroup-icon">
                <font-awesome-icon icon="users" />
              </div>
              <div class="status-indicator" :class="userGroup.status"></div>
            </div>
            <div class="profile-info">
              <h2 class="usergroup-name">{{ userGroup.name }}</h2>
              <p class="usergroup-code">{{ userGroup.code }}</p>
              <div class="status-badge" :class="userGroup.status">
                {{ userGroup.status === 'active' ? '启用' : '禁用' }}
              </div>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <label>用户组名称</label>
              <span>{{ userGroup.name }}</span>
            </div>
            <div class="info-item">
              <label>用户组编码</label>
              <span class="code-text">{{ userGroup.code }}</span>
            </div>
            <div class="info-item">
              <label>状态</label>
              <span class="status-tag" :class="userGroup.status">
                {{ userGroup.status === 'active' ? '启用' : '禁用' }}
              </span>
            </div>
            <div class="info-item">
              <label>创建时间</label>
              <span>{{ userGroup.createdAt }}</span>
            </div>
            <div class="info-item" v-if="userGroup.description">
              <label>描述</label>
              <span>{{ userGroup.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 切换卡片 -->
      <div class="info-card">
        <div class="card-header">
          <div class="tab-header">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'users' }"
              @click="activeTab = 'users'"
            >
              <font-awesome-icon icon="user" />
              绑定用户 ({{ users.length }})
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'roles' }"
              @click="activeTab = 'roles'"
            >
              <font-awesome-icon icon="user-tag" />
              绑定角色 ({{ roles.length }})
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- 用户 Tab -->
          <div v-if="activeTab === 'users'" class="tab-content">
            <div class="section-header">
              <div class="search-section">
                <div class="search-group">
                  <font-awesome-icon icon="search" class="search-icon" />
                  <input 
                    v-model="userSearchKeyword" 
                    type="text" 
                    placeholder="搜索用户..." 
                    class="search-input"
                  />
                </div>
              </div>
              <button class="action-btn primary" @click="showAddUserModal = true">
                <font-awesome-icon icon="user-plus" />
                添加用户
              </button>
            </div>

            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>用户信息</th>
                    <th>角色</th>
                    <th>状态</th>
                    <th>加入时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in filteredUsers" :key="user.id" class="table-row">
                    <td>
                      <div class="user-info">
                        <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`" :alt="user.name" class="user-avatar" />
                        <div class="user-details">
                          <div class="user-name">{{ user.name }}</div>
                          <div class="user-email">{{ user.email }}</div>
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
                    <td class="text-muted">{{ user.joinedAt }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn small danger" @click="removeUser(user)">
                          <font-awesome-icon icon="trash" />
                          移除
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="filteredUsers.length === 0" class="empty-text">
                暂无用户数据
              </div>
            </div>
          </div>

          <!-- 角色 Tab -->
          <div v-if="activeTab === 'roles'" class="tab-content">
            <div class="section-header">
              <div class="search-section">
                <div class="search-group">
                  <font-awesome-icon icon="search" class="search-icon" />
                  <input 
                    v-model="roleSearchKeyword" 
                    type="text" 
                    placeholder="搜索角色..." 
                    class="search-input"
                  />
                </div>
              </div>
              <button class="action-btn primary" @click="showAddRoleModal = true">
                <font-awesome-icon icon="plus" />
                添加角色
              </button>
            </div>

            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>角色信息</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>加入时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="role in filteredRoles" :key="role.id" class="table-row">
                    <td>
                      <div class="role-info">
                        <div class="role-icon">
                          <font-awesome-icon icon="user-tag" />
                        </div>
                        <div class="role-details">
                          <div class="role-name">{{ role.name }}</div>
                          <div class="role-code">{{ role.code }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="type-tag" :class="role.type">
                        {{ getTypeLabel(role.type) }}
                      </span>
                    </td>
                    <td>
                      <span class="status-tag" :class="role.status">
                        {{ role.status === 'active' ? '启用' : '禁用' }}
                      </span>
                    </td>
                    <td class="text-muted">{{ role.joinedAt }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="action-btn small danger" @click="removeRole(role)">
                          <font-awesome-icon icon="trash" />
                          移除
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="filteredRoles.length === 0" class="empty-text">
                暂无角色数据
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加用户模态框 -->
    <div v-if="showAddUserModal" class="modal-overlay" @click="showAddUserModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>添加用户到用户组</h3>
          <button class="close-btn" @click="showAddUserModal = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="search-section">
            <div class="search-group">
              <font-awesome-icon icon="search" class="search-icon" />
              <input 
                v-model="availableUserSearchKeyword" 
                type="text" 
                placeholder="搜索可添加的用户..." 
                class="search-input"
              />
            </div>
          </div>
          <div class="user-list">
            <div v-for="user in filteredAvailableUsers" :key="user.id" class="user-item">
              <div class="user-info">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`" :alt="user.name" class="user-avatar" />
                <div class="user-details">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
              <button class="action-btn small primary" @click="addUser(user)">
                <font-awesome-icon icon="plus" />
                添加
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加角色模态框 -->
    <div v-if="showAddRoleModal" class="modal-overlay" @click="showAddRoleModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>添加角色到用户组</h3>
          <button class="close-btn" @click="showAddRoleModal = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="search-section">
            <div class="search-group">
              <font-awesome-icon icon="search" class="search-icon" />
              <input 
                v-model="availableRoleSearchKeyword" 
                type="text" 
                placeholder="搜索可添加的角色..." 
                class="search-input"
              />
            </div>
          </div>
          <div class="role-list">
            <div v-for="role in filteredAvailableRoles" :key="role.id" class="role-item">
              <div class="role-info">
                <div class="role-icon">
                  <font-awesome-icon icon="user-tag" />
                </div>
                <div class="role-details">
                  <div class="role-name">{{ role.name }}</div>
                  <div class="role-code">{{ role.code }}</div>
                </div>
              </div>
              <button class="action-btn small primary" @click="addRole(role)">
                <font-awesome-icon icon="plus" />
                添加
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑用户组基本信息弹窗 -->
    <UserGroupBasicModal
      v-if="showEditModal"
      :visible="showEditModal"
      :userGroup="userGroup"
      @close="showEditModal = false"
      @submit="handleEditSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserGroupBasicModal from '@/components/Common/UserGroupBasicModal.vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const activeTab = ref('users')
const userSearchKeyword = ref('')
const roleSearchKeyword = ref('')
const availableUserSearchKeyword = ref('')
const availableRoleSearchKeyword = ref('')

// 模态框状态
const showEditModal = ref(false)
const showAddUserModal = ref(false)
const showAddRoleModal = ref(false)
const showConfirmModal = ref(false)

// 选择状态
const selectedUsers = ref<number[]>([])
const selectedRoles = ref<number[]>([])

// 确认对话框状态
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmAction = ref<() => void>(() => {})

// 编辑表单
const editForm = reactive({
  name: '',
  code: '',
  status: 'active',
  description: ''
})

// 模拟数据
const userGroup = ref({
  id: '1',
  name: '开发团队',
  code: 'DEV_TEAM',
  description: '负责系统开发和维护的团队',
  status: 'active',
  createdAt: '2024-01-15 10:00:00'
})

const users = ref([
  {
    id: 1,
    username: 'zhang.san',
    name: '张三',
    email: 'zhang.san@company.com',
    role: 'user',
    status: 'active',
    joinedAt: '2024-01-20 14:30:00'
  },
  {
    id: 2,
    username: 'li.si',
    name: '李四',
    email: 'li.si@company.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-25 09:15:00'
  },
  {
    id: 3,
    username: 'wang.wu',
    name: '王五',
    email: 'wang.wu@company.com',
    role: 'user',
    status: 'inactive',
    joinedAt: '2024-02-01 16:45:00'
  }
])

const roles = ref([
  {
    id: 1,
    name: '开发工程师',
    code: 'DEVELOPER',
    description: '负责系统开发工作',
    type: 'custom',
    status: 'active',
    joinedAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '测试工程师',
    code: 'TESTER',
    description: '负责系统测试工作',
    type: 'system',
    status: 'active',
    joinedAt: '2024-01-18 11:20:00'
  }
])

// 可用用户列表（不在当前用户组中的用户）
const availableUsers = ref([
  {
    id: 4,
    username: 'zhao.liu',
    name: '赵六',
    email: 'zhao.liu@company.com',
    role: 'user',
    status: 'active'
  },
  {
    id: 5,
    username: 'sun.qi',
    name: '孙七',
    email: 'sun.qi@company.com',
    role: 'guest',
    status: 'active'
  },
  {
    id: 6,
    username: 'zhou.ba',
    name: '周八',
    email: 'zhou.ba@company.com',
    role: 'user',
    status: 'inactive'
  }
])

// 可用角色列表（不在当前用户组中的角色）
const availableRoles = ref([
  {
    id: 3,
    name: '产品经理',
    code: 'PRODUCT_MANAGER',
    description: '负责产品规划和管理',
    type: 'custom',
    status: 'active'
  },
  {
    id: 4,
    name: '项目经理',
    code: 'PROJECT_MANAGER',
    description: '负责项目管理和协调',
    type: 'system',
    status: 'active'
  },
  {
    id: 5,
    name: '运维工程师',
    code: 'DEVOPS',
    description: '负责系统运维工作',
    type: 'custom',
    status: 'inactive'
  }
])

// 计算属性
const filteredUsers = computed(() => {
  if (!userSearchKeyword.value) return users.value
  const query = userSearchKeyword.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

const filteredRoles = computed(() => {
  if (!roleSearchKeyword.value) return roles.value
  const query = roleSearchKeyword.value.toLowerCase()
  return roles.value.filter(role => 
    role.name.toLowerCase().includes(query) ||
    role.code.toLowerCase().includes(query) ||
    role.description.toLowerCase().includes(query)
  )
})

const filteredAvailableUsers = computed(() => {
  if (!availableUserSearchKeyword.value) return availableUsers.value
  const query = availableUserSearchKeyword.value.toLowerCase()
  return availableUsers.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

const filteredAvailableRoles = computed(() => {
  if (!availableRoleSearchKeyword.value) return availableRoles.value
  const query = availableRoleSearchKeyword.value.toLowerCase()
  return availableRoles.value.filter(role => 
    role.name.toLowerCase().includes(query) ||
    role.code.toLowerCase().includes(query) ||
    role.description.toLowerCase().includes(query)
  )
})

// 方法
const loadUserGroupDetail = () => {
  const groupId = Number(route.params.id)
  // 这里应该调用API获取用户组详情
  console.log('加载用户组详情:', groupId)
}

const goBack = () => {
  router.push('/permission/user-group')
}

const editUserGroup = () => {
  editForm.name = userGroup.value.name
  editForm.code = userGroup.value.code
  editForm.status = userGroup.value.status
  editForm.description = userGroup.value.description
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveBasicInfo = () => {
  // 这里应该调用API保存基本信息
  userGroup.value.name = editForm.name
  userGroup.value.code = editForm.code
  userGroup.value.status = editForm.status
  userGroup.value.description = editForm.description
  
  console.log('保存用户组基本信息:', editForm)
  showEditModal.value = false
}

const removeUser = (user: any) => {
  confirmTitle.value = '移除用户'
  confirmMessage.value = '确定要将该用户从用户组中移除吗？'
  confirmAction.value = () => {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      const removedUser = users.value.splice(index, 1)[0]
      availableUsers.value.push(removedUser)
      console.log('移除用户:', user.id)
    }
  }
  showConfirmModal.value = true
}

const removeRole = (role: any) => {
  confirmTitle.value = '移除角色'
  confirmMessage.value = '确定要将该角色从用户组中移除吗？'
  confirmAction.value = () => {
    const index = roles.value.findIndex(r => r.id === role.id)
    if (index > -1) {
      const removedRole = roles.value.splice(index, 1)[0]
      availableRoles.value.push(removedRole)
      console.log('移除角色:', role.id)
    }
  }
  showConfirmModal.value = true
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
  selectedUsers.value = []
  availableUserSearchKeyword.value = ''
}

const closeAddRoleModal = () => {
  showAddRoleModal.value = false
  selectedRoles.value = []
  availableRoleSearchKeyword.value = ''
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
}

const handleConfirm = () => {
  confirmAction.value()
  closeConfirmModal()
}

const toggleUserSelection = (user: any) => {
  const index = selectedUsers.value.indexOf(user.id)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(user.id)
  }
}

const toggleRoleSelection = (role: any) => {
  const index = selectedRoles.value.indexOf(role.id)
  if (index > -1) {
    selectedRoles.value.splice(index, 1)
  } else {
    selectedRoles.value.push(role.id)
  }
}

const addSelectedUsers = () => {
  selectedUsers.value.forEach(userId => {
    const userIndex = availableUsers.value.findIndex(u => u.id === userId)
    if (userIndex > -1) {
      const user = availableUsers.value.splice(userIndex, 1)[0]
      users.value.push({
        ...user,
        joinedAt: new Date().toLocaleString('zh-CN')
      })
    }
  })
  
  console.log('添加用户:', selectedUsers.value)
  closeAddUserModal()
}

const addSelectedRoles = () => {
  selectedRoles.value.forEach(roleId => {
    const roleIndex = availableRoles.value.findIndex(r => r.id === roleId)
    if (roleIndex > -1) {
      const role = availableRoles.value.splice(roleIndex, 1)[0]
      roles.value.push({
        ...role,
        joinedAt: new Date().toLocaleString('zh-CN')
      })
    }
  })
  
  console.log('添加角色:', selectedRoles.value)
  closeAddRoleModal()
}

// 新增方法：直接添加单个用户
const addUser = (user: any) => {
  const userIndex = availableUsers.value.findIndex(u => u.id === user.id)
  if (userIndex > -1) {
    const removedUser = availableUsers.value.splice(userIndex, 1)[0]
    users.value.push({
      ...removedUser,
      joinedAt: new Date().toLocaleString('zh-CN')
    })
    console.log('添加用户:', user.name)
  }
}

// 新增方法：直接添加单个角色
const addRole = (role: any) => {
  const roleIndex = availableRoles.value.findIndex(r => r.id === role.id)
  if (roleIndex > -1) {
    const removedRole = availableRoles.value.splice(roleIndex, 1)[0]
    roles.value.push({
      ...removedRole,
      joinedAt: new Date().toLocaleString('zh-CN')
    })
    console.log('添加角色:', role.name)
  }
}

// 获取角色标签
const getRoleLabel = (role: string) => {
  const roleLabels: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客'
  }
  return roleLabels[role] || role
}

// 获取类型标签
const getTypeLabel = (type: string) => {
  const typeLabels: Record<string, string> = {
    system: '系统角色',
    custom: '自定义角色'
  }
  return typeLabels[type] || type
}

// 处理编辑保存
const handleEditSave = (data: any) => {
  Object.assign(userGroup.value, data)
  showEditModal.value = false
  console.log('用户组信息已更新:', data)
}

// 生命周期
onMounted(() => {
  loadUserGroupDetail()
})
</script>

<style scoped>
.usergroup-detail-view {
  padding: 0;
}

/* 页面头部 */
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

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-item {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.breadcrumb-item.current {
  color: #fff;
  font-weight: 500;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
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

.action-btn.small {
  padding: 8px;
  font-size: 12px;
}

.action-btn.danger {
  color: #e74c3c;
  border-color: rgba(231, 76, 60, 0.3);
}

.action-btn.danger:hover {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 详情内容区域 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 基本信息卡片 */
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  padding: 24px;
}

.usergroup-profile {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.icon-section {
  position: relative;
}

.usergroup-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(0, 238, 255, 0.1);
  border: 3px solid rgba(0, 238, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #00eeff;
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

.usergroup-name {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
}

.usergroup-code {
  font-size: 18px;
  color: rgba(0, 238, 255, 0.8);
  font-family: 'Courier New', monospace;
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

.code-text {
  font-family: 'Courier New', monospace;
  color: rgba(0, 238, 255, 0.8);
}

.status-tag {
  display: inline-block;
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

/* Tab 头部 */
.tab-header {
  display: flex;
  background: none;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
}

.tab-btn {
  flex: 1;
  padding: 16px 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

.tab-btn:hover {
  background: rgba(0, 238, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

.tab-btn.active {
  color: #00eeff;
  background: rgba(0, 238, 255, 0.1);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #00eeff;
}

/* Tab 内容 */
.tab-content {
  padding: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-section {
  flex: 1;
  max-width: 400px;
}

.search-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00eeff;
  background: rgba(0, 238, 255, 0.1);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
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

.user-info, .role-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(0, 238, 255, 0.3);
}

.role-icon {
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

.user-details, .role-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name, .role-name {
  font-weight: 500;
  color: #fff;
}

.user-email, .role-code {
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

.type-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.type-tag.system {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.type-tag.custom {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.text-muted {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.empty-text {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  text-align: center;
  padding: 40px 20px;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: rgba(0, 238, 255, 0.1);
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: #00eeff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.user-list, .role-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.user-item, .role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-item:hover, .role-item:hover {
  background: rgba(0, 238, 255, 0.1);
  border-color: rgba(0, 238, 255, 0.3);
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
  
  .usergroup-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .usergroup-icon {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .tab-header {
    flex-direction: column;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px 8px;
  }
  
  .user-info, .role-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .user-avatar, .role-icon {
    width: 36px;
    height: 36px;
  }
  
  .modal-container {
    width: 95%;
    max-height: 90vh;
  }
}
</style> 