import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

// 模拟用户数据
const mockUsers = {
  admin: { id: 1, username: 'admin', nickname: '管理员', role: 'admin', avatar: '', email: 'admin@example.com' },
  provider: { id: 2, username: 'provider', nickname: '服务商小王', role: 'provider', avatar: '', email: 'provider@example.com' },
  user: { id: 3, username: 'user', nickname: 'chant_96', role: 'user', avatar: '', email: 'user@example.com' },
}

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
      // 模拟登录：根据用户名匹配角色，密码任意
      const username = credentials.username || credentials.account || ''
      const mockUser = mockUsers[username] || mockUsers.user
      const token = 'mock-token-' + Date.now()

      this.token = token
      this.userInfo = { ...mockUser, username: username || 'user' }
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      message.success('登录成功')
      return { token, userInfo: this.userInfo }
    },

    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    },

    async refreshUserInfo() {
      // 模拟刷新用户信息
      if (this.userInfo) {
        message.success('用户信息已刷新')
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
