<template>
  <div class="profile-view">
    <div class="page-header">
      <h1 class="page-title">
        <font-awesome-icon icon="user" />
        个人中心
      </h1>
      <p class="page-subtitle">管理个人信息和账户设置</p>
    </div>
    
    <div class="placeholder">
      <font-awesome-icon icon="user" class="placeholder-icon" />
      <h2>个人中心</h2>
      <p>此页面正在开发中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面逻辑待实现
</script>

<style scoped>
.profile-view {
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

.placeholder {
  text-align: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.6);
}

.placeholder-icon {
  font-size: 64px;
  color: #00eeff;
  margin-bottom: 24px;
  opacity: 0.7;
}

.placeholder h2 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #fff;
}

.placeholder p {
  font-size: 16px;
  margin: 0;
}
</style> 