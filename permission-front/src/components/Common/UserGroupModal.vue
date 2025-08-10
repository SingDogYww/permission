<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          <font-awesome-icon :icon="isEdit ? 'edit' : 'users'" />
          {{ isEdit ? '编辑用户组' : '添加用户组' }}
        </h3>
        <button class="close-btn" @click="close">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- 基本信息 -->
          <div class="form-section">
            <label class="section-title">基本信息</label>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">用户组名称 *</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="form-input"
                  placeholder="请输入用户组名称"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">用户组编码 *</label>
                <input 
                  v-model="formData.code" 
                  type="text" 
                  class="form-input"
                  placeholder="请输入用户组编码"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">描述</label>
              <textarea 
                v-model="formData.description" 
                class="form-textarea"
                rows="3"
                placeholder="请输入用户组描述"
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">状态</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" v-model="formData.status" value="active" />
                  <span class="radio-mark"></span>
                  启用
                </label>
                <label class="radio-item">
                  <input type="radio" v-model="formData.status" value="inactive" />
                  <span class="radio-mark"></span>
                  禁用
                </label>
              </div>
            </div>
          </div>

          <!-- 绑定用户列表 (仅在编辑时显示) -->
          <div v-if="isEdit && userGroup" class="form-section">
            <label class="section-title">
              绑定用户 ({{ boundUsers.length }})
              <button type="button" class="add-btn" @click="showAddUserModal = true">
                <font-awesome-icon icon="user-plus" />
                添加用户
              </button>
            </label>
            <div class="user-list">
              <div v-if="boundUsers.length === 0" class="empty-state">
                <font-awesome-icon icon="users" class="empty-icon" />
                <p>暂无绑定用户</p>
              </div>
              <div v-else class="user-grid">
                <div v-for="user in boundUsers" :key="user.id" class="user-card">
                  <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                  <div class="user-info">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-email">{{ user.email }}</div>
                  </div>
                  <div class="user-role">
                    <span class="role-tag" :class="user.role">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    class="remove-btn" 
                    @click="removeUser(user)"
                    title="移除用户"
                  >
                    <font-awesome-icon icon="times" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 绑定角色列表 (仅在编辑时显示) -->
          <div v-if="isEdit && userGroup" class="form-section">
            <label class="section-title">
              绑定角色 ({{ boundRoles.length }})
              <button type="button" class="add-btn" @click="showAddRoleModal = true">
                <font-awesome-icon icon="shield-alt" />
                添加角色
              </button>
            </label>
            <div class="role-list">
              <div v-if="boundRoles.length === 0" class="empty-state">
                <font-awesome-icon icon="shield-alt" class="empty-icon" />
                <p>暂无绑定角色</p>
              </div>
              <div v-else class="role-grid">
                <div v-for="role in boundRoles" :key="role.id" class="role-card">
                  <div class="role-icon">
                    <font-awesome-icon icon="shield-alt" />
                  </div>
                  <div class="role-info">
                    <div class="role-name">{{ role.name }}</div>
                    <div class="role-description">{{ role.description }}</div>
                  </div>
                  <div class="role-type">
                    <span class="type-tag" :class="role.type">
                      {{ getRoleTypeLabel(role.type) }}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    class="remove-btn" 
                    @click="removeRole(role)"
                    title="移除角色"
                  >
                    <font-awesome-icon icon="times" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="close">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="handleSubmit">
          <font-awesome-icon icon="save" />
          {{ isEdit ? '保存' : '创建' }}
        </button>
      </div>
    </div>

    <!-- 添加用户弹窗 -->
    <div v-if="showAddUserModal" class="modal-overlay" @click="showAddUserModal = false">
      <div class="modal-container small" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <font-awesome-icon icon="user-plus" />
            添加用户到用户组
          </h3>
          <button class="close-btn" @click="showAddUserModal = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="search-box">
            <font-awesome-icon icon="search" class="search-icon" />
            <input 
              v-model="userSearchKeyword" 
              type="text" 
              placeholder="搜索用户"
              class="search-input"
            />
          </div>
          <div class="user-select-list">
            <div v-for="user in availableUsers" :key="user.id" class="user-select-item">
              <input 
                type="checkbox" 
                :value="user.id" 
                v-model="selectedUserIds"
                :id="`user-${user.id}`"
              />
              <label :for="`user-${user.id}`" class="user-select-label">
                <img :src="user.avatar" :alt="user.name" class="user-avatar small" />
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showAddUserModal = false">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="addSelectedUsers">
            <font-awesome-icon icon="plus" />
            添加选中用户
          </button>
        </div>
      </div>
    </div>

    <!-- 添加角色弹窗 -->
    <div v-if="showAddRoleModal" class="modal-overlay" @click="showAddRoleModal = false">
      <div class="modal-container small" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <font-awesome-icon icon="shield-alt" />
            添加角色到用户组
          </h3>
          <button class="close-btn" @click="showAddRoleModal = false">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <div class="search-box">
            <font-awesome-icon icon="search" class="search-icon" />
            <input 
              v-model="roleSearchKeyword" 
              type="text" 
              placeholder="搜索角色"
              class="search-input"
            />
          </div>
          <div class="role-select-list">
            <div v-for="role in availableRoles" :key="role.id" class="role-select-item">
              <input 
                type="checkbox" 
                :value="role.id" 
                v-model="selectedRoleIds"
                :id="`role-${role.id}`"
              />
              <label :for="`role-${role.id}`" class="role-select-label">
                <div class="role-icon">
                  <font-awesome-icon icon="shield-alt" />
                </div>
                <div class="role-info">
                  <div class="role-name">{{ role.name }}</div>
                  <div class="role-description">{{ role.description }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showAddRoleModal = false">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="addSelectedRoles">
            <font-awesome-icon icon="plus" />
            添加选中角色
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: string
  status: string
}

interface Role {
  id: string
  name: string
  description: string
  type: string
  permissions: string[]
}

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

const props = defineProps<{
  visible: boolean
  userGroup?: UserGroup | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

// 表单数据
const formData = ref({
  name: '',
  code: '',
  description: '',
  status: 'active'
})

// 弹窗状态
const showAddUserModal = ref(false)
const showAddRoleModal = ref(false)

// 搜索关键词
const userSearchKeyword = ref('')
const roleSearchKeyword = ref('')

// 选中的用户和角色ID
const selectedUserIds = ref<string[]>([])
const selectedRoleIds = ref<string[]>([])

// 模拟数据
const boundUsers = ref<User[]>([
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    role: 'admin',
    status: 'active'
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    role: 'user',
    status: 'active'
  }
])

const boundRoles = ref<Role[]>([
  {
    id: '1',
    name: '系统管理员',
    description: '拥有系统所有权限',
    type: 'system',
    permissions: ['*']
  },
  {
    id: '2',
    name: '用户管理员',
    description: '管理用户相关操作',
    type: 'business',
    permissions: ['user:read', 'user:write']
  }
])

const allUsers = ref<User[]>([
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    role: 'user',
    status: 'active'
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    role: 'guest',
    status: 'active'
  }
])

const allRoles = ref<Role[]>([
  {
    id: '3',
    name: '数据分析师',
    description: '查看和分析数据',
    type: 'business',
    permissions: ['data:read', 'report:read']
  },
  {
    id: '4',
    name: '访客',
    description: '基础查看权限',
    type: 'common',
    permissions: ['dashboard:read']
  }
])

// 计算属性
const availableUsers = computed(() => {
  const boundUserIds = boundUsers.value.map(u => u.id)
  const filtered = allUsers.value.filter(user => 
    !boundUserIds.includes(user.id) &&
    (user.name.includes(userSearchKeyword.value) || 
     user.email.includes(userSearchKeyword.value))
  )
  return filtered
})

const availableRoles = computed(() => {
  const boundRoleIds = boundRoles.value.map(r => r.id)
  const filtered = allRoles.value.filter(role => 
    !boundRoleIds.includes(role.id) &&
    (role.name.includes(roleSearchKeyword.value) || 
     role.description.includes(roleSearchKeyword.value))
  )
  return filtered
})

// 方法
const getRoleLabel = (role: string) => {
  const roleLabels: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客'
  }
  return roleLabels[role] || role
}

const getRoleTypeLabel = (type: string) => {
  const typeLabels: Record<string, string> = {
    system: '系统角色',
    business: '业务角色',
    common: '通用角色'
  }
  return typeLabels[type] || type
}

const removeUser = (user: User) => {
  const index = boundUsers.value.findIndex(u => u.id === user.id)
  if (index > -1) {
    boundUsers.value.splice(index, 1)
  }
}

const removeRole = (role: Role) => {
  const index = boundRoles.value.findIndex(r => r.id === role.id)
  if (index > -1) {
    boundRoles.value.splice(index, 1)
  }
}

const addSelectedUsers = () => {
  const usersToAdd = allUsers.value.filter(user => 
    selectedUserIds.value.includes(user.id)
  )
  boundUsers.value.push(...usersToAdd)
  selectedUserIds.value = []
  showAddUserModal.value = false
  userSearchKeyword.value = ''
}

const addSelectedRoles = () => {
  const rolesToAdd = allRoles.value.filter(role => 
    selectedRoleIds.value.includes(role.id)
  )
  boundRoles.value.push(...rolesToAdd)
  selectedRoleIds.value = []
  showAddRoleModal.value = false
  roleSearchKeyword.value = ''
}

const handleSubmit = () => {
  const data = {
    ...formData.value,
    users: boundUsers.value,
    roles: boundRoles.value
  }
  emit('submit', data)
}

const close = () => {
  emit('close')
}

// 监听属性变化
watch(() => props.userGroup, (newUserGroup) => {
  if (newUserGroup) {
    formData.value = {
      name: newUserGroup.name,
      code: newUserGroup.code,
      description: newUserGroup.description,
      status: newUserGroup.status
    }
  } else {
    formData.value = {
      name: '',
      code: '',
      description: '',
      status: 'active'
    }
  }
}, { immediate: true })

watch(() => props.visible, (visible) => {
  if (!visible) {
    showAddUserModal.value = false
    showAddRoleModal.value = false
    selectedUserIds.value = []
    selectedRoleIds.value = []
    userSearchKeyword.value = ''
    roleSearchKeyword.value = ''
  }
})
</script>

<style scoped>
/* 模态框基础样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-container.small {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
  background: rgba(0, 238, 255, 0.05);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.modal-title svg {
  color: #00eeff;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(0, 238, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

/* 表单样式 */
.form-section {
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #00eeff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
}

.add-btn {
  background: linear-gradient(45deg, #00eeff, #00b4db);
  border: none;
  border-radius: 6px;
  color: #0f2027;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-btn:hover {
  background: linear-gradient(45deg, #00b4db, #00eeff);
  transform: translateY(-1px);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #00eeff;
  box-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

.radio-item input[type="radio"] {
  display: none;
}

.radio-mark {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 238, 255, 0.3);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-item input[type="radio"]:checked + .radio-mark {
  border-color: #00eeff;
}

.radio-item input[type="radio"]:checked + .radio-mark::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00eeff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 用户列表样式 */
.user-list,
.role-list {
  margin-top: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-icon {
  font-size: 48px;
  color: #00eeff;
  margin-bottom: 16px;
  opacity: 0.7;
}

.user-grid,
.role-grid {
  display: grid;
  gap: 12px;
}

.user-card,
.role-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-card:hover,
.role-card:hover {
  background: rgba(0, 238, 255, 0.05);
  border-color: rgba(0, 238, 255, 0.3);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(0, 238, 255, 0.3);
}

.user-avatar.small {
  width: 32px;
  height: 32px;
}

.user-info {
  flex: 1;
}

.user-name,
.role-name {
  font-weight: 500;
  color: #fff;
  margin-bottom: 2px;
}

.user-email,
.role-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.role-icon {
  width: 40px;
  height: 40px;
  background: rgba(0, 238, 255, 0.1);
  border: 2px solid rgba(0, 238, 255, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00eeff;
  font-size: 16px;
}

.role-tag,
.type-tag {
  padding: 4px 8px;
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

.type-tag.system {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.type-tag.business {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.type-tag.common {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.remove-btn {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 6px;
  color: #e74c3c;
  padding: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  border-color: #e74c3c;
}

/* 搜索框样式 */
.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  box-sizing: border-box;
}

/* 选择列表样式 */
.user-select-list,
.role-select-list {
  max-height: 300px;
  overflow-y: auto;
}

.user-select-item,
.role-select-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.user-select-item:hover,
.role-select-item:hover {
  background: rgba(0, 238, 255, 0.05);
}

.user-select-label,
.role-select-label {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-primary {
  background: linear-gradient(45deg, #00eeff, #00b4db);
  color: #0f2027;
}

.btn-primary:hover {
  background: linear-gradient(45deg, #00b4db, #00eeff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 238, 255, 0.3);
}

/* 滚动条样式 */
.modal-body::-webkit-scrollbar,
.user-select-list::-webkit-scrollbar,
.role-select-list::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track,
.user-select-list::-webkit-scrollbar-track,
.role-select-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb,
.user-select-list::-webkit-scrollbar-thumb,
.role-select-list::-webkit-scrollbar-thumb {
  background: rgba(0, 238, 255, 0.3);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover,
.user-select-list::-webkit-scrollbar-thumb:hover,
.role-select-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 238, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    margin: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .user-card,
  .role-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 8px;
  }
}
</style> 