import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 根据后端配置调整
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 注册相关接口
export interface RegisterBasicForm {
  username: string
  password: string
  confirmPassword: string
  realName?: string
  agreeTerms: boolean
}

export interface PhoneBindingForm {
  phone: string
  code: string
}

export interface EmailBindingForm {
  email: string
  code: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: any
}

// 基础信息注册
export const registerBasicInfo = async (data: RegisterBasicForm): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/register/basic', data)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '注册失败'
    }
  }
}

// 发送手机验证码
export const sendPhoneCode = async (phone: string): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/send-phone-code', { phone })
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '发送验证码失败'
    }
  }
}

// 发送邮箱验证码
export const sendEmailCode = async (email: string): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/send-email-code', { email })
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '发送验证码失败'
    }
  }
}

// 验证手机号并绑定
export const bindPhone = async (data: PhoneBindingForm): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/register/bind-phone', data)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '手机号绑定失败'
    }
  }
}

// 验证邮箱并绑定
export const bindEmail = async (data: EmailBindingForm): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/register/bind-email', data)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '邮箱绑定失败'
    }
  }
}

// 完成注册（跳过绑定）
export const completeRegistration = async (): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/register/complete')
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '注册完成失败'
    }
  }
}

// 登录接口
export interface LoginForm {
  username: string
  password: string
  remember: boolean
}

export const login = async (data: LoginForm): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/login', data)
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token)
    }
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '登录失败'
    }
  }
}

export default api 