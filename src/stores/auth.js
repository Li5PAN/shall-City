import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import request from '@/utils/request'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.userInfo?.role || 'user',
    userId: (state) => state.userInfo?.id,
  },

  actions: {
    async login(credentials) {
      try {
        const res = await request.post('/auth/login', credentials)
        this.token = res.token
        this.userInfo = res.userInfo
        localStorage.setItem('token', res.token)
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        return res
      } catch (e) {
        message.error(e.message || '登录失败')
        throw e
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },

    async refreshUserInfo() {
      try {
        const res = await request.get('/auth/user-info')
        this.userInfo = res
        localStorage.setItem('userInfo', JSON.stringify(res))
      } catch (e) {
        message.error(e.message || '获取用户信息失败')
        throw e
      }
    },

    updateRole(newRole) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, role: newRole }
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      }
    },
  },
})
