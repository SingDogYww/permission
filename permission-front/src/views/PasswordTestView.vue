<template>
  <div class="password-test-container">
    <div class="test-card">
      <h2>密码强度测试</h2>
      <p class="description">
        测试不同密码的强度评估，包括弱密码检测和历史密码验证。
      </p>
      
      <div class="test-section">
        <h3>密码输入测试</h3>
        <div class="input-group">
          <label>测试密码：</label>
          <input 
            v-model="testPassword" 
            type="password" 
            placeholder="输入密码进行测试"
            class="password-input"
          />
        </div>
        
        <div class="input-group">
          <label>确认密码：</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="确认密码"
            class="password-input"
          />
        </div>
        
        <PasswordStrengthIndicator 
          :password="testPassword"
          :confirm-password="confirmPassword"
          :history-passwords="historyPasswords"
        />
      </div>
      
      <div class="test-section">
        <h3>预设密码测试</h3>
        <div class="preset-passwords">
          <button 
            v-for="preset in presetPasswords" 
            :key="preset.label"
            @click="testPassword = preset.value"
            class="preset-btn"
            :class="preset.type"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
      
      <div class="test-section">
        <h3>历史密码列表</h3>
        <div class="history-list">
          <div 
            v-for="pwd in historyPasswords" 
            :key="pwd"
            class="history-item"
          >
            {{ pwd }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator.vue'

const testPassword = ref('')
const confirmPassword = ref('')

// 历史密码列表
const historyPasswords = ref([
  'oldpassword123',
  'previouspass456',
  'lastpassword789',
  'Huawei12#$%'
])

// 预设密码测试用例
const presetPasswords = [
  { label: '很弱密码', value: '123456', type: 'very-weak' },
  { label: '弱密码', value: 'password', type: 'weak' },
  { label: '中等密码', value: 'Password123', type: 'medium' },
  { label: '强密码', value: 'MyStr0ng@Pass', type: 'strong' },
  { label: '很强密码', value: 'C0mpl3x#P@ssw0rd!2024', type: 'very-strong' },
  { label: '您的示例', value: 'Huawei12#$%', type: 'strong' },
  { label: '键盘序列', value: 'qwerty123', type: 'weak' },
  { label: '重复字符', value: 'aaaa1234', type: 'weak' },
  { label: '历史密码', value: 'oldpassword123', type: 'warning' }
]
</script>

<style scoped>
.password-test-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.test-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 10px;
  font-size: 28px;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(103, 126, 234, 0.05);
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

h3 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 18px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.password-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.password-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(103, 126, 234, 0.1);
}

.preset-passwords {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.preset-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: white;
}

.preset-btn.very-weak {
  background: #ff4d4f;
}

.preset-btn.weak {
  background: #ff7a45;
}

.preset-btn.medium {
  background: #ffa940;
}

.preset-btn.strong {
  background: #52c41a;
}

.preset-btn.very-strong {
  background: linear-gradient(45deg, #52c41a, #13c2c2);
}

.preset-btn.warning {
  background: #faad14;
}

.preset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.history-item {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  color: #666;
  border: 1px solid #e1e1e1;
}
</style> 