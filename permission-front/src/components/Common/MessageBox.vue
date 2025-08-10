<template>
  <div v-if="visible" class="message-overlay" @click="close">
    <div class="message-box" @click.stop>
      <div class="message-icon" :class="type">
        <i :class="getIconClass()"></i>
      </div>
      <div class="message-content">
        <h3 class="message-title">{{ title }}</h3>
        <p class="message-text">{{ message }}</p>
      </div>
      <div class="message-actions">
        <button @click="close" class="btn-confirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  visible: boolean
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  type: 'info'
})

const emit = defineEmits<{
  close: []
}>()

const getIconClass = () => {
  switch (props.type) {
    case 'success':
      return 'fas fa-check-circle'
    case 'error':
      return 'fas fa-times-circle'
    case 'warning':
      return 'fas fa-exclamation-triangle'
    default:
      return 'fas fa-info-circle'
  }
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.message-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 320px;
  max-width: 480px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: messageIn 0.3s ease-out;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.message-icon {
  text-align: center;
  margin-bottom: 16px;
}

.message-icon i {
  font-size: 48px;
}

.message-icon.success i {
  color: #52c41a;
}

.message-icon.error i {
  color: #ff4d4f;
}

.message-icon.warning i {
  color: #faad14;
}

.message-icon.info i {
  color: #1890ff;
}

.message-content {
  text-align: center;
  margin-bottom: 24px;
}

.message-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.message-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.message-actions {
  text-align: center;
}

.btn-confirm {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm:hover {
  background: linear-gradient(45deg, #5a6fd8, #6a4190);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style> 