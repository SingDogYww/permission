<template>
  <div class="password-strength-indicator">
    <div class="strength-bar">
      <div 
        class="strength-fill" 
        :class="strengthLevel"
        :style="{ width: strengthPercentage + '%' }"
      ></div>
    </div>
    
    <div class="strength-info">
      <span class="strength-text" :class="strengthLevel">
        {{ strengthText }}
      </span>
      <span class="strength-score">{{ strengthScore }}/100</span>
    </div>
    
    <div class="password-checks" v-if="password">
      <div class="check-item" :class="{ valid: checks.length }">
        <i class="fas" :class="checks.length ? 'fa-check' : 'fa-times'"></i>
        至少8个字符
      </div>
      <div class="check-item" :class="{ valid: checks.uppercase }">
        <i class="fas" :class="checks.uppercase ? 'fa-check' : 'fa-times'"></i>
        包含大写字母
      </div>
      <div class="check-item" :class="{ valid: checks.lowercase }">
        <i class="fas" :class="checks.lowercase ? 'fa-check' : 'fa-times'"></i>
        包含小写字母
      </div>
      <div class="check-item" :class="{ valid: checks.number }">
        <i class="fas" :class="checks.number ? 'fa-check' : 'fa-times'"></i>
        包含数字
      </div>
      <div class="check-item" :class="{ valid: checks.special }">
        <i class="fas" :class="checks.special ? 'fa-check' : 'fa-times'"></i>
        包含特殊字符
      </div>
    </div>
    
    <div class="warnings" v-if="warnings.length > 0">
      <div 
        v-for="warning in warnings" 
        :key="warning"
        class="warning-item"
      >
        <i class="fas fa-exclamation-triangle"></i>
        {{ warning }}
      </div>
    </div>
    
    <div v-if="confirmPassword && password" class="match-check">
      <div class="check-item" :class="{ valid: passwordsMatch }">
        <i class="fas" :class="passwordsMatch ? 'fa-check' : 'fa-times'"></i>
        密码匹配
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

interface Props {
  password: string
  confirmPassword?: string
  historyPasswords?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  confirmPassword: '',
  historyPasswords: () => []
})

// 密码检查项
const checks = computed(() => ({
  length: props.password.length >= 8,
  uppercase: /[A-Z]/.test(props.password),
  lowercase: /[a-z]/.test(props.password),
  number: /[0-9]/.test(props.password),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(props.password)
}))

// 密码匹配检查
const passwordsMatch = computed(() => {
  return props.confirmPassword && props.password === props.confirmPassword
})

// 计算密码强度得分
const strengthScore = computed(() => {
  if (!props.password) return 0
  
  let score = 0
  const password = props.password
  
  // 基础长度分数
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10
  
  // 字符类型分数
  if (checks.value.uppercase) score += 15
  if (checks.value.lowercase) score += 15
  if (checks.value.number) score += 15
  if (checks.value.special) score += 15
  
  // 复杂度奖励
  const uniqueChars = new Set(password).size
  if (uniqueChars >= password.length * 0.7) score += 10
  
  // 常见模式惩罚
  const commonPatterns = [
    /123456/,
    /abcdef/,
    /qwerty/,
    /password/i,
    /(.)\1{2,}/  // 重复字符
  ]
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score -= 20
      break
    }
  }
  
  return Math.max(0, Math.min(100, score))
})

// 强度等级
const strengthLevel = computed(() => {
  const score = strengthScore.value
  if (score < 30) return 'very-weak'
  if (score < 50) return 'weak'
  if (score < 70) return 'medium'
  if (score < 90) return 'strong'
  return 'very-strong'
})

// 强度百分比
const strengthPercentage = computed(() => {
  return Math.max(10, strengthScore.value)
})

// 强度文本
const strengthText = computed(() => {
  const level = strengthLevel.value
  const texts = {
    'very-weak': '非常弱',
    'weak': '弱',
    'medium': '中等',
    'strong': '强',
    'very-strong': '非常强'
  }
  return texts[level as keyof typeof texts] || ''
})

// 警告信息
const warnings = computed(() => {
  const warnings: string[] = []
  
  if (!props.password) return warnings
  
  // 检查历史密码
  if (props.historyPasswords.includes(props.password)) {
    warnings.push('不能使用历史密码')
  }
  
  // 检查常见弱密码
  const commonPasswords = ['123456', 'password', 'qwerty', '111111', 'abc123']
  if (commonPasswords.some(pwd => props.password.toLowerCase().includes(pwd))) {
    warnings.push('包含常见弱密码模式')
  }
  
  // 检查重复字符
  if (/(.)\1{2,}/.test(props.password)) {
    warnings.push('包含重复字符')
  }
  
  // 检查键盘序列
  const keyboardPatterns = ['qwerty', 'asdf', '1234']
  if (keyboardPatterns.some(pattern => props.password.toLowerCase().includes(pattern))) {
    warnings.push('包含键盘序列')
  }
  
  return warnings
})
</script>

<style scoped>
.password-strength-indicator {
  margin-top: 8px;
}

.strength-bar {
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-fill.very-weak {
  background-color: #ff4d4f;
}

.strength-fill.weak {
  background-color: #ff7a45;
}

.strength-fill.medium {
  background-color: #ffa940;
}

.strength-fill.strong {
  background-color: #52c41a;
}

.strength-fill.very-strong {
  background: linear-gradient(90deg, #52c41a, #13c2c2);
}

.strength-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
}

.strength-text {
  font-weight: 500;
}

.strength-text.very-weak {
  color: #ff4d4f;
}

.strength-text.weak {
  color: #ff7a45;
}

.strength-text.medium {
  color: #ffa940;
}

.strength-text.strong {
  color: #52c41a;
}

.strength-text.very-strong {
  color: #13c2c2;
}

.strength-score {
  color: #8c8c8c;
}

.password-checks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 6px;
  margin-bottom: 12px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #8c8c8c;
  transition: color 0.3s ease;
}

.check-item.valid {
  color: #52c41a;
}

.check-item.valid i {
  color: #52c41a;
}

.check-item i {
  width: 12px;
  color: #ff4d4f;
}

.warnings {
  margin-bottom: 8px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #faad14;
  margin-bottom: 4px;
}

.warning-item i {
  width: 12px;
}

.match-check {
  margin-top: 8px;
}

.match-check .check-item {
  font-size: 12px;
}
</style> 