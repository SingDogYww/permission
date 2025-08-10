<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          <font-awesome-icon icon="edit" />
          编辑用户组基本信息
        </h3>
        <button class="close-btn" @click="close">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
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
          
          <div class="form-group">
            <label class="form-label">状态</label>
            <select v-model="formData.status" class="form-select">
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
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

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">
              取消
            </button>
            <button type="submit" class="btn btn-primary">
              <font-awesome-icon icon="save" />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface UserGroup {
  id: string
  name: string
  code: string
  description: string
  status: string
}

interface Props {
  visible: boolean
  userGroup: UserGroup | null
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: Partial<UserGroup>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref({
  name: '',
  code: '',
  status: 'active',
  description: ''
})

watch(() => props.userGroup, (newUserGroup) => {
  if (newUserGroup) {
    formData.value = {
      name: newUserGroup.name,
      code: newUserGroup.code,
      status: newUserGroup.status,
      description: newUserGroup.description
    }
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>

<style scoped>
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
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: rgba(0, 238, 255, 0.1);
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #00eeff;
  display: flex;
  align-items: center;
  gap: 8px;
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

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #00eeff;
  background: rgba(0, 238, 255, 0.1);
  box-shadow: 0 0 0 2px rgba(0, 238, 255, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-select {
  cursor: pointer;
}

.form-select option {
  background: rgba(15, 23, 42, 0.95);
  color: #fff;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 238, 255, 0.2);
  margin-top: 20px;
}

.btn {
  padding: 12px 20px;
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(45deg, #00eeff, #00b4db);
  color: #0f2027;
  border-color: transparent;
}

.btn-primary:hover {
  background: linear-gradient(45deg, #00b4db, #00eeff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 238, 255, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

.btn-secondary:hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
  border-color: #00eeff;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    margin: 10px;
  }

  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
}
</style> 