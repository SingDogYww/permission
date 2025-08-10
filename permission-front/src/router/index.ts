import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/password-test',
      name: 'password-test',
      component: () => import('../views/PasswordTestView.vue'),
    },
    {
      path: '/dashboard',
      component: () => import('../components/Layout/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        }
      ]
    },
    {
      path: '/permission',
      component: () => import('../components/Layout/MainLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/permission/user'
        },
        {
          path: 'user',
          name: 'permission-user',
          component: () => import('../views/Permission/UserView.vue'),
        },
        {
          path: 'user/:id',
          name: 'permission-user-detail',
          component: () => import('../views/Permission/UserDetailView.vue'),
        },
        {
          path: 'user-group',
          name: 'permission-user-group',
          component: () => import('../views/Permission/UserGroupView.vue'),
        },
        {
          path: 'role',
          name: 'permission-role',
          component: () => import('../views/Permission/RoleView.vue'),
        },
        {
          path: 'api',
          name: 'permission-api',
          component: () => import('../views/Permission/ApiPermissionView.vue'),
        },
        {
          path: 'data',
          name: 'permission-data',
          component: () => import('../views/Permission/DataPermissionView.vue'),
        }
      ]
    },
    {
      path: '/system',
      component: () => import('../components/Layout/MainLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/system/config'
        },
        {
          path: 'config',
          name: 'system-config',
          component: () => import('../views/System/ConfigView.vue'),
        },
        {
          path: 'logs',
          name: 'system-logs',
          component: () => import('../views/System/LogsView.vue'),
        }
      ]
    },
    {
      path: '/profile',
      component: () => import('../components/Layout/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
        }
      ]
    },
    {
      path: '/change-password',
      component: () => import('../components/Layout/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'change-password',
          component: () => import('../views/ChangePasswordView.vue'),
        }
      ]
    }
  ],
})

export default router
