import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

const mockUsers = [
  { id: 1, username: 'admin', nickname: '管理员', role: 'admin', status: 'active', createdAt: '2024-01-01' },
  { id: 2, username: 'provider1', nickname: '服务商小王', role: 'provider', status: 'active', createdAt: '2024-03-15' },
  { id: 3, username: 'user1', nickname: '普通用户', role: 'user', status: 'active', createdAt: '2024-06-20' },
  { id: 4, username: 'user2', nickname: '测试用户', role: 'user', status: 'banned', createdAt: '2024-08-10' },
]

const mockPendingArticles = [
  { id: 1, title: '深入理解JavaScript闭包', author: 'user1', status: 'pending', createdAt: '2025-02-20' },
  { id: 2, title: 'Docker容器化部署指南', author: 'provider1', status: 'pending', createdAt: '2025-02-19' },
]

const mockPendingServices = [
  { id: 1, title: '小程序开发服务', provider: 'provider1', status: 'pending', price: 8000, createdAt: '2025-02-20' },
]

const mockPendingBounties = [
  { id: 1, title: '需要一个CRM系统', user: 'user1', status: 'pending', budget: 30000, createdAt: '2025-02-20' },
]

const mockLogs = [
  { id: 1, action: '用户登录', operator: 'admin', ip: '192.168.1.1', createdAt: '2025-02-20 10:30:00' },
  { id: 2, action: '审核文章通过', operator: 'admin', target: '深入理解JavaScript闭包', createdAt: '2025-02-20 11:00:00' },
  { id: 3, action: '封禁用户', operator: 'admin', target: 'user2', createdAt: '2025-02-19 15:20:00' },
]

const mockStats = {
  totalUsers: 50234, totalServices: 1023, totalOrders: 8765, totalRevenue: 2345678,
  dailyActiveUsers: 3456, newUsersToday: 128, ordersToday: 45, revenueToday: 89000,
}

const mockAnnouncements = [
  { id: 1, title: '平台升级公告', content: '平台将于本周末进行系统升级...', status: 'published', createdAt: '2025-02-20' },
  { id: 2, title: '春节放假通知', content: '春节期间客服服务时间调整...', status: 'draft', createdAt: '2025-02-15' },
]

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [...mockUsers],
    pendingArticles: [...mockPendingArticles],
    pendingServices: [...mockPendingServices],
    pendingBounties: [...mockPendingBounties],
    logs: [...mockLogs],
    stats: { ...mockStats },
    announcements: [...mockAnnouncements],
    appeals: [],
    loading: false,
    pagination: { current: 1, pageSize: 10, total: 0 },
  }),

  actions: {
    async fetchUsers(params) {
      this.loading = true
      setTimeout(() => {
        this.users = [...mockUsers]
        this.pagination.total = mockUsers.length
        this.loading = false
      }, 300)
    },

    async fetchPendingArticles() {
      this.pendingArticles = [...mockPendingArticles]
    },

    async fetchPendingServices() {
      this.pendingServices = [...mockPendingServices]
    },

    async fetchPendingBounties() {
      this.pendingBounties = [...mockPendingBounties]
    },

    async approveArticle(id) {
      this.pendingArticles = this.pendingArticles.filter(a => a.id !== id)
      message.success('文章审核通过')
    },

    async rejectArticle(id, reason) {
      this.pendingArticles = this.pendingArticles.filter(a => a.id !== id)
      message.success('文章已驳回')
    },

    async approveService(id) {
      this.pendingServices = this.pendingServices.filter(s => s.id !== id)
      message.success('服务审核通过')
    },

    async approveBounty(id) {
      this.pendingBounties = this.pendingBounties.filter(b => b.id !== id)
      message.success('需求审核通过')
    },

    async banUser(id) {
      const user = this.users.find(u => u.id === id)
      if (user) user.status = 'banned'
      message.success('用户已封禁')
    },

    async unbanUser(id) {
      const user = this.users.find(u => u.id === id)
      if (user) user.status = 'active'
      message.success('用户已解封')
    },

    async fetchStats() {
      this.stats = { ...mockStats }
    },

    async fetchLogs() {
      this.logs = [...mockLogs]
    },

    async fetchAnnouncements() {
      this.announcements = [...mockAnnouncements]
    },

    async createAnnouncement(data) {
      this.announcements.unshift({ id: Date.now(), ...data, createdAt: new Date().toISOString() })
      message.success('公告发布成功')
    },
  },
})
