<template>
  <div v-if="visible" class="confirm-overlay" @click="close">
    <div class="confirm-modal" @click.stop>
      <div class="confirm-icon" :class="type">
        <font-awesome-icon :icon="getIcon()" />
      </div>
      
      <div class="confirm-content">
        <h3 class="confirm-title">{{ title }}</h3>
        <p class="confirm-message">{{ message }}</p>
        <div v-if="details" class="confirm-details">
          <p v-for="detail in details" :key="detail" class="detail-item">
            {{ detail }}
          </p>
        </div>
      </div>

      <div class="confirm-actions">
        <button class="btn-cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="btn-confirm" :class="type" @click="handleConfirm">
          <font-awesome-icon v-if="confirmIcon" :icon="confirmIcon" />
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
  title: string
  message: string
  details?: string[]
  type?: 'warning' | 'danger' | 'info' | 'success'
  confirmText?: string
  cancelText?: string
  confirmIcon?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'warning',
  confirmText: '确定',
  cancelText: '取消'
})

const emit = defineEmits<Emits>()

const getIcon = () => {
  const icons = {
    warning: 'exclamation-triangle',
    danger: 'exclamation-circle',
    info: 'info-circle',
    success: 'check-circle'
  }
  return icons[props.type]
}

const close = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}
</script>

<style scoped>
.confirm-overlay {
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
}

.confirm-modal {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 238, 255, 0.3);
  border-radius: 16px;
  min-width: 400px;
  max-width: 500px;
  padding: 32px;
  text-align: center;
  animation: confirmIn 0.3s ease-out;
}

@keyframes confirmIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.confirm-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
}

.confirm-icon.warning {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border: 2px solid rgba(243, 156, 18, 0.3);
}

.confirm-icon.danger {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 2px solid rgba(231, 76, 60, 0.3);
}

.confirm-icon.info {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border: 2px solid rgba(52, 152, 219, 0.3);
}

.confirm-icon.success {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 2px solid rgba(46, 204, 113, 0.3);
}

.confirm-content {
  margin-bottom: 32px;
}

.confirm-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px 0;
}

.confirm-message {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.confirm-details {
  margin-top: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid rgba(0, 238, 255, 0.5);
}

.detail-item {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 8px 0;
  text-align: left;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-cancel,
.btn-confirm {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-confirm {
  color: #fff;
}

.btn-confirm.warning {
  background: linear-gradient(45deg, #f39c12, #e67e22);
}

.btn-confirm.warning:hover {
  background: linear-gradient(45deg, #e67e22, #f39c12);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.btn-confirm.danger {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}

.btn-confirm.danger:hover {
  background: linear-gradient(45deg, #c0392b, #e74c3c);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.btn-confirm.info {
  background: linear-gradient(45deg, #3498db, #2980b9);
}

.btn-confirm.info:hover {
  background: linear-gradient(45deg, #2980b9, #3498db);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.btn-confirm.success {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
}

.btn-confirm.success:hover {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

/* 响应式设计 */
@media (max-width: 568px) {
  .confirm-modal {
    min-width: auto;
    width: 90%;
    padding: 24px;
  }
  
  .confirm-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .confirm-title {
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .confirm-message {
    font-size: 14px;
  }
  
  .confirm-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style> 