import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import {
  getDashboardData,
  reviewContent as reviewContentApi,
  getStatistics,
  getLogs,
  manageAnnouncement as manageAnnouncementApi,
  manageForumSection as manageForumSectionApi,
} from '@/api/admin'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    pendingReviews: { bounties: 0, services: 0, articles: 0, posts: 0 },
    statistics: { users: 0, orders: 0, revenue: 0, services: 0 },
    logs: [],
    announcements: [],
    forumSections: [],
  }),

  actions: {
    async fetchDashboardData() {
      try {
        const res = await getDashboardData()
        this.pendingReviews = res.pendingReviews || this.pendingReviews
        this.statistics = res.statistics || this.statistics
      } catch (e) {
        message.error(e.message || '获取仪表盘数据失败')
      }
    },

    async reviewContent(type, id, action, reason) {
      try {
        const res = await reviewContentApi(type, id, { action, reason })
        message.success('审核操作成功')
        return res
      } catch (e) {
        message.error(e.message || '审核操作失败')
        throw e
      }
    },

    async fetchStatistics(params) {
      try {
        const res = await getStatistics(params)
        this.statistics = res || this.statistics
        return res
      } catch (e) {
        message.error(e.message || '获取统计数据失败')
      }
    },

    async fetchLogs(params) {
      try {
        const res = await getLogs(params)
        this.logs = res.list || res.data || []
        return res
      } catch (e) {
        message.error(e.message || '获取日志失败')
      }
    },

    async manageAnnouncement(action, data) {
      try {
        const res = await manageAnnouncementApi({ action, ...data })
        message.success('公告操作成功')
        return res
      } catch (e) {
        message.error(e.message || '公告操作失败')
        throw e
      }
    },

    async manageForumSection(action, data) {
      try {
        const res = await manageForumSectionApi({ action, ...data })
        message.success('板块操作成功')
        return res
      } catch (e) {
        message.error(e.message || '板块操作失败')
        throw e
      }
    },
  },
})
