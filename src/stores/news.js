import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import {
  getNewsList,
  getNewsDetail,
  getLatestNews,
} from '@/api/news'

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [],
    currentNews: null,
    categories: [],
    filters: { category: '', keyword: '' },
    pagination: { current: 1, pageSize: 10, total: 0 },
    loading: false,
  }),

  actions: {
    async fetchNewsList(params) {
      this.loading = true
      try {
        const res = await getNewsList({ ...this.filters, ...this.pagination, ...params })
        this.newsList = res.list || res.data || []
        this.pagination.total = res.total || 0
      } catch (e) {
        message.error(e.message || '获取资讯列表失败')
      } finally {
        this.loading = false
      }
    },

    async fetchNewsDetail(id) {
      this.loading = true
      try {
        this.currentNews = await getNewsDetail(id)
      } catch (e) {
        message.error(e.message || '获取资讯详情失败')
      } finally {
        this.loading = false
      }
    },

    async fetchLatestNews(params) {
      try {
        const res = await getLatestNews(params)
        return res
      } catch (e) {
        message.error(e.message || '获取最新资讯失败')
      }
    },
  },
})
