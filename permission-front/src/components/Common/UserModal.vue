<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          <font-awesome-icon :icon="isEdit ? 'edit' : 'user-plus'" />
          {{ isEdit ? '编辑用户' : '添加用户' }}
        </h3>
        <button class="close-btn" @click="close">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- 头像选择区域 -->
          <div class="form-section">
            <label class="section-title">用户头像</label>
            <div class="avatar-section">
              <div class="current-avatar">
                <img :src="formData.avatar" :alt="formData.name" class="avatar-preview" />
                <div class="avatar-overlay" @click="showAvatarModal = true">
                  <font-awesome-icon icon="camera" />
                  <span>更换头像</span>
                </div>
              </div>
              <div class="avatar-actions">
                <button type="button" class="btn-avatar" @click="showAvatarModal = true">
                  <font-awesome-icon icon="images" />
                  选择头像
                </button>
                <button type="button" class="btn-avatar" @click="triggerFileUpload">
                  <font-awesome-icon icon="upload" />
                  上传头像
                </button>
                <input 
                  ref="fileInput" 
                  type="file" 
                  accept="image/*" 
                  style="display: none" 
                  @change="handleFileUpload"
                />
              </div>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="form-section">
            <label class="section-title">基本信息</label>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  用户名 <span class="required">*</span>
                </label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="form-input"
                  placeholder="请输入用户名"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  邮箱地址 <span class="required">*</span>
                </label>
                <input 
                  v-model="formData.email" 
                  type="email" 
                  class="form-input"
                  placeholder="请输入邮箱地址"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  手机号码 <span class="required">*</span>
                </label>
                <input 
                  v-model="formData.phone" 
                  type="tel" 
                  class="form-input"
                  placeholder="请输入手机号码"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">
                  用户角色 <span class="required">*</span>
                </label>
                <select v-model="formData.role" class="form-select" required>
                  <option value="">请选择角色</option>
                  <option value="admin">管理员</option>
                  <option value="user">普通用户</option>
                  <option value="guest">访客</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">用户状态</label>
                <select v-model="formData.status" class="form-select">
                  <option value="active">启用</option>
                  <option value="inactive">禁用</option>
                </select>
              </div>
              <div class="form-group" v-if="!isEdit">
                <label class="form-label">
                  初始密码 <span class="required">*</span>
                </label>
                <div class="password-input">
                  <input 
                    v-model="formData.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-input"
                    placeholder="请输入初始密码"
                    required
                  />
                  <button 
                    type="button" 
                    class="password-toggle" 
                    @click="showPassword = !showPassword"
                  >
                    <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 用户组设置 -->
          <div class="form-section">
            <label class="section-title">用户组设置</label>
            <div class="form-group">
              <label class="form-label">用户组 <span class="required">*</span></label>
              <select v-model="formData.userGroup" class="form-select" required>
                <option value="">请选择用户组</option>
                <option v-for="group in availableGroups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- 其他信息 -->
          <div class="form-section">
            <label class="section-title">其他信息</label>
            <div class="form-group">
              <label class="form-label">备注</label>
              <textarea 
                v-model="formData.remark" 
                class="form-textarea"
                placeholder="请输入备注信息"
                rows="3"
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="close">取消</button>
        <button type="button" class="btn-submit" @click="handleSubmit">
          {{ isEdit ? '保存' : '添加' }}
        </button>
      </div>
    </div>

    <!-- 头像选择弹窗 -->
    <div v-if="showAvatarModal" class="avatar-modal-overlay" @click="closeAvatarModal">
      <div class="avatar-modal" @click.stop>
        <div class="avatar-modal-header">
          <h4>选择头像</h4>
          <button class="close-btn" @click="closeAvatarModal">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="avatar-modal-body">
          <div class="avatar-grid">
            <div 
              v-for="avatar in systemAvatars" 
              :key="avatar.id"
              class="avatar-option"
              :class="{ active: formData.avatar === avatar.url }"
              @click="selectAvatar(avatar.url)"
            >
              <img :src="avatar.url" :alt="avatar.name" />
              <div class="avatar-name">{{ avatar.name }}</div>
            </div>
          </div>
        </div>
        <div class="avatar-modal-footer">
          <button class="btn-cancel" @click="closeAvatarModal">取消</button>
          <button class="btn-submit" @click="confirmAvatarSelection">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'

interface Props {
  visible: boolean
  user?: any
  isEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<Emits>()

const showPassword = ref(false)
const showAvatarModal = ref(false)
const fileInput = ref<HTMLInputElement>()

// 表单数据
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  role: '',
  status: 'active',
  password: '',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  userGroup: '',
  remark: ''
})

// 可选用户组
const availableGroups = ref([
  { id: 'admin', name: '管理员组' },
  { id: 'system', name: '系统管理员' },
  { id: 'operator', name: '操作员' },
  { id: 'viewer', name: '查看员' }
])



// 系统头像
const systemAvatars = ref([
  { id: '1', name: '默认', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' },
  { id: '2', name: '男性1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=male1' },
  { id: '3', name: '男性2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=male2' },
  { id: '4', name: '女性1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=female1' },
  { id: '5', name: '女性2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=female2' },
  { id: '6', name: '商务', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=business' },
  { id: '7', name: '休闲', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casual' },
  { id: '8', name: '年轻', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=young' }
])

// 监听用户数据变化
watch(() => props.user, (newUser) => {
  if (newUser && props.isEdit) {
    Object.assign(formData, {
      name: newUser.name || '',
      email: newUser.email || '',
      phone: newUser.phone || '',
      role: newUser.role || '',
      status: newUser.status || 'active',
      avatar: newUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      userGroup: newUser.userGroup || '',
      remark: newUser.remark || ''
    })
  }
}, { immediate: true })

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    password: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    userGroup: '',
    remark: ''
  })
}

// 关闭弹窗
const close = () => {
  emit('close')
  resetForm()
}

// 提交表单
const handleSubmit = () => {
  // 验证必填字段
  if (!formData.name || !formData.email || !formData.phone || !formData.role || !formData.userGroup) {
    alert('请填写必填字段')
    return
  }

  if (!props.isEdit && !formData.password) {
    alert('请设置初始密码')
    return
  }

  emit('submit', { ...formData })
  close()
}

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value?.click()
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 检查文件大小（限制2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }

    // 读取文件并转换为base64
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        formData.avatar = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

// 选择系统头像
const selectAvatar = (avatarUrl: string) => {
  formData.avatar = avatarUrl
}

// 关闭头像选择弹窗
const closeAvatarModal = () => {
  showAvatarModal.value = false
}

// 确认头像选择
const confirmAvatarSelection = () => {
  closeAvatarModal()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
  padding: 20px;
}

.modal-container {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
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
  color: #00eeff;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #00eeff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.current-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(0, 238, 255, 0.3);
  cursor: pointer;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: all 0.3s ease;
}

.current-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay span {
  font-size: 10px;
  color: #fff;
}

.avatar-actions {
  display: flex;
  gap: 12px;
}

.btn-avatar {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.btn-avatar:hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
  border-color: #00eeff;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-select {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #00eeff;
  box-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-select option {
  background: #1a2332;
  color: #fff;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  color: #00eeff;
}

.form-textarea {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #00eeff;
  box-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
}

.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.checkbox-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.checkbox-item input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 238, 255, 0.3);
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.checkbox-item input[type="checkbox"]:checked + .checkmark {
  background: #00eeff;
  border-color: #00eeff;
}

.checkbox-item input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #0f2027;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  flex: 1;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checkbox-label small {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid rgba(0, 238, 255, 0.2);
  background: rgba(0, 238, 255, 0.05);
}

.btn-cancel,
.btn-submit {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-submit {
  background: linear-gradient(45deg, #00eeff, #00b4db);
  color: #0f2027;
}

.btn-submit:hover {
  background: linear-gradient(45deg, #00b4db, #00eeff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 238, 255, 0.3);
}

/* 头像选择弹窗 */
.avatar-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.avatar-modal {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.avatar-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
}

.avatar-modal-header h4 {
  color: #00eeff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.avatar-modal-body {
  padding: 20px;
  max-height: 50vh;
  overflow-y: auto;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.avatar-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-option:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 238, 255, 0.3);
}

.avatar-option.active {
  border-color: #00eeff;
  background: rgba(0, 238, 255, 0.1);
}

.avatar-option img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(0, 238, 255, 0.2);
}

.avatar-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.avatar-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid rgba(0, 238, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .avatar-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .avatar-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-avatar {
    justify-content: center;
  }
  
  .avatar-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
  }
  
  .avatar-option img {
    width: 50px;
    height: 50px;
  }
}
</style> 