<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <font-awesome-icon icon="user-astronaut" class="logo-icon" />
          <span class="logo-text">未来科技管理平台</span>
        </div>
        
        <!-- 主导航菜单 -->
        <nav class="main-nav">
          <router-link 
            v-for="item in mainNavItems" 
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: $route.path.startsWith(item.path) }"
          >
            <font-awesome-icon :icon="item.icon" />
            <span>{{ item.title }}</span>
          </router-link>
        </nav>
      </div>
      
      <div class="header-right">
        <!-- 消息通知 -->
        <div class="notification" @click="showNotifications">
          <font-awesome-icon icon="bell" />
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </div>
        
        <!-- 用户信息 -->
        <div 
          class="user-info" 
          @mouseenter="showUserMenu = true"
          @mouseleave="showUserMenu = false"
        >
          <img :src="userInfo.avatar" :alt="userInfo.name" class="user-avatar" />
          <span class="user-name">{{ userInfo.name }}</span>
          <font-awesome-icon icon="chevron-down" class="dropdown-icon" />
          
          <!-- 用户下拉菜单 -->
          <div class="user-dropdown" :class="{ show: showUserMenu }">
            <a href="#" class="dropdown-item" @click="goToProfile">
              <font-awesome-icon icon="user" />
              个人中心
            </a>
            <a href="#" class="dropdown-item" @click="changePassword">
              <font-awesome-icon icon="lock" />
              修改密码
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item logout" @click="logout">
              <font-awesome-icon icon="sign-out-alt" />
              退出登录
            </a>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 主体内容区 -->
    <div class="main-content">
      <!-- 侧边栏 (仅在权限管理模块显示) -->
      <aside 
        v-if="showSidebar" 
        class="sidebar" 
        :class="{ collapsed: sidebarCollapsed }"
      >
        <div class="sidebar-header">
          <button class="collapse-btn" @click="toggleSidebar">
            <font-awesome-icon :icon="sidebarCollapsed ? 'chevron-right' : 'chevron-left'" />
          </button>
        </div>
        
        <div class="sidebar-content">
          <div class="menu-tree">
            <div 
              v-for="menu in sidebarMenus" 
              :key="menu.key"
              class="menu-item"
              :class="{ expanded: menu.expanded }"
            >
              <div class="menu-title" @click="toggleMenu(menu)">
                <font-awesome-icon :icon="menu.icon" />
                <span v-if="!sidebarCollapsed">{{ menu.title }}</span>
                <font-awesome-icon 
                  v-if="!sidebarCollapsed && menu.children" 
                  :icon="menu.expanded ? 'chevron-down' : 'chevron-right'"
                  class="expand-icon"
                />
              </div>
              
              <div v-if="menu.children && menu.expanded && !sidebarCollapsed" class="menu-children">
                <router-link
                  v-for="child in menu.children"
                  :key="child.path"
                  :to="child.path"
                  class="menu-child"
                  :class="{ active: $route.path === child.path }"
                >
                  <font-awesome-icon :icon="child.icon" />
                  <span>{{ child.title }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- 内容区域 -->
      <main class="content" :class="{ 'with-sidebar': showSidebar }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 响应式数据
const showUserMenu = ref(false)
const sidebarCollapsed = ref(false)
const unreadCount = ref(5)

// 用户信息
const userInfo = ref({
  name: '管理员',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
})

// 主导航菜单
const mainNavItems = [
  { path: '/dashboard', title: '首页', icon: 'home' },
  { path: '/permission', title: '权限管理', icon: 'users-cog' },
  { path: '/system', title: '系统管理', icon: 'cog' }
]

// 侧边栏菜单 (权限管理模块)
const sidebarMenus = ref([
  {
    key: 'user',
    title: '用户管理',
    icon: 'users',
    expanded: true,
    children: [
      { path: '/permission/user', title: '用户管理', icon: 'user' },
      { path: '/permission/user-group', title: '用户组管理', icon: 'users' }
    ]
  },
  {
    key: 'role',
    title: '角色管理',
    icon: 'user-tag',
    expanded: false,
    children: [
      { path: '/permission/role', title: '角色管理', icon: 'user-tag' }
    ]
  },
  {
    key: 'permission',
    title: '权限管理',
    icon: 'shield-alt',
    expanded: false,
    children: [
      { path: '/permission/api', title: '接口权限管理', icon: 'link' },
      { path: '/permission/data', title: '数据权限管理', icon: 'database' }
    ]
  }
])

// 计算属性
const showSidebar = computed(() => {
  return route.path.startsWith('/permission')
})

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleMenu = (menu: any) => {
  menu.expanded = !menu.expanded
}

const showNotifications = () => {
  console.log('显示通知')
}

const goToProfile = () => {
  router.push('/profile')
  showUserMenu.value = false
}

const changePassword = () => {
  router.push('/change-password')
  showUserMenu.value = false
}

const logout = () => {
  // TODO: 实现退出登录逻辑
  router.push('/login')
  showUserMenu.value = false
}

onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: #fff;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

/* 顶部导航栏 */
.header {
  height: 70px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 238, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
  color: #00eeff;
  text-shadow: 0 0 10px rgba(0, 238, 255, 0.7);
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.main-nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  color: #00eeff;
  background: rgba(0, 238, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
}

.nav-item.active {
  color: #00eeff;
  background: rgba(0, 238, 255, 0.15);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: #00eeff;
  border-radius: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.notification {
  position: relative;
  padding: 8px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  border-radius: 6px;
}

.notification:hover {
  color: #00eeff;
  background: rgba(0, 238, 255, 0.1);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4757;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.user-info:hover {
  background: rgba(0, 238, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(0, 238, 255, 0.3);
}

.user-name {
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.3s ease;
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 238, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  min-width: 180px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
}

.user-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
}

.dropdown-item.logout {
  color: #ff6b6b;
}

.dropdown-item.logout:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff4757;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
}

/* 主体内容区 */
.main-content {
  display: flex;
  margin-top: 70px;
  min-height: calc(100vh - 70px);
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(0, 238, 255, 0.2);
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  color: #00eeff;
  background: rgba(0, 238, 255, 0.1);
}

.sidebar-content {
  padding: 16px 0;
}

.menu-item {
  margin-bottom: 8px;
}

.menu-title {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 0 8px;
}

.menu-title:hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
}

.expand-icon {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.menu-item.expanded .expand-icon {
  transform: rotate(90deg);
}

.menu-children {
  padding-left: 20px;
  margin-top: 4px;
}

.menu-child {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-radius: 6px;
  margin: 2px 8px;
  transition: all 0.3s ease;
  position: relative;
}

.menu-child:hover {
  background: rgba(0, 238, 255, 0.1);
  color: #00eeff;
}

.menu-child.active {
  background: rgba(0, 238, 255, 0.2);
  color: #00eeff;
}

.menu-child.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #00eeff;
  border-radius: 0 2px 2px 0;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;
}

.content.with-sidebar {
  margin-left: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }
  
  .header-left {
    gap: 20px;
  }
  
  .logo-text {
    display: none;
  }
  
  .main-nav {
    display: none;
  }
  
  .sidebar {
    position: fixed;
    left: -240px;
    top: 70px;
    height: calc(100vh - 70px);
    z-index: 999;
  }
  
  .sidebar.show {
    left: 0;
  }
  
  .content {
    padding: 16px;
  }
}
</style> 