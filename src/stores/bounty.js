import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import {
  getBountyList,
  getBountyDetail,
  createBounty as createBountyApi,
  saveBountyDraft,
  getBountyDrafts,
  deleteBountyDraft,
  bidBounty as bidBountyApi,
} from '@/api/bounty'

export const useBountyStore = defineStore('bounty', {
  state: () => ({
    bountyList: [],
    currentBounty: null,
    drafts: [],
    filters: { category: '', status: '', budgetRange: [0, 50000], keyword: '' },
    pagination: { current: 1, pageSize: 10, total: 0 },
    loading: false,
  }),

  actions: {
    async fetchBountyList(params) {
      this.loading = true
      try {
        const res = await getBountyList({ ...this.filters, ...this.pagination, ...params })
        this.bountyList = res.list || res.data || []
        this.pagination.total = res.total || 0
      } catch (e) {
        message.error(e.message || '获取悬赏列表失败')
      } finally {
        this.loading = false
      }
    },

    async fetchBountyDetail(id) {
      this.loading = true
      try {
        this.currentBounty = await getBountyDetail(id)
      } catch (e) {
        message.error(e.message || '获取悬赏详情失败')
      } finally {
        this.loading = false
      }
    },

    async createBounty(data) {
      try {
        const res = await createBountyApi(data)
        message.success('悬赏发布成功')
        return res
      } catch (e) {
        message.error(e.message || '发布悬赏失败')
        throw e
      }
    },

    async saveDraft(data) {
      try {
        const res = await saveBountyDraft(data)
        message.success('草稿保存成功')
        return res
      } catch (e) {
        message.error(e.message || '保存草稿失败')
        throw e
      }
    },

    async fetchDrafts(params) {
      this.loading = true
      try {
        const res = await getBountyDrafts(params)
        this.drafts = res.list || res.data || []
      } catch (e) {
        message.error(e.message || '获取草稿列表失败')
      } finally {
        this.loading = false
      }
    },

    async deleteDraft(id) {
      try {
        await deleteBountyDraft(id)
        this.drafts = this.drafts.filter((d) => d.id !== id)
        message.success('草稿已删除')
      } catch (e) {
        message.error(e.message || '删除草稿失败')
        throw e
      }
    },

    async bidBounty(bountyId, data) {
      try {
        const res = await bidBountyApi(bountyId, data)
        message.success('投标成功')
        return res
      } catch (e) {
        message.error(e.message || '投标失败')
        throw e
      }
    },
  },
})
