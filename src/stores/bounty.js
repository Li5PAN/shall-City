import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

const mockBounties = [
  { id: 1, title: '企业内部知识库系统开发', description: '需要开发一个支持全文检索的企业知识库管理系统', budget: 20000, status: 'open', category: '全栈开发', createdAt: '2025-02-20', deadline: '2025-03-20', bids: 5 },
  { id: 2, title: '电商小程序UI重构', description: '现有电商小程序界面需要全面重新设计和开发', budget: 15000, status: 'open', category: 'UI设计', createdAt: '2025-02-19', deadline: '2025-03-15', bids: 8 },
  { id: 3, title: 'Python数据分析自动化脚本', description: '需要编写自动化数据采集和分析报告生成脚本', budget: 5000, status: 'in_progress', category: 'Python', createdAt: '2025-02-18', deadline: '2025-03-10', bids: 12 },
  { id: 4, title: '微信公众号后台管理系统', description: '开发一个微信公众号内容管理和数据分析后台', budget: 18000, status: 'open', category: 'Web开发', createdAt: '2025-02-17', deadline: '2025-03-25', bids: 3 },
  { id: 5, title: 'IoT设备监控大屏开发', description: '基于ECharts的物联网设备实时监控数据可视化大屏', budget: 12000, status: 'open', category: '数据可视化', createdAt: '2025-02-16', deadline: '2025-03-18', bids: 6 },
]

const mockDrafts = [
  { id: 101, title: '移动端适配方案咨询', description: '需要专业的移动端适配建议', budget: 3000, category: '前端', updatedAt: '2025-02-20' },
]

export const useBountyStore = defineStore('bounty', {
  state: () => ({
    bountyList: [...mockBounties],
    currentBounty: null,
    drafts: [...mockDrafts],
    filters: { category: '', status: '', budgetRange: [0, 50000], keyword: '' },
    pagination: { current: 1, pageSize: 10, total: mockBounties.length },
    loading: false,
  }),

  actions: {
    async fetchBountyList(params) {
      this.loading = true
      setTimeout(() => {
        this.bountyList = [...mockBounties]
        this.pagination.total = mockBounties.length
        this.loading = false
      }, 300)
    },

    async fetchBountyDetail(id) {
      this.loading = true
      setTimeout(() => {
        this.currentBounty = mockBounties.find(b => b.id === Number(id)) || mockBounties[0]
        this.loading = false
      }, 200)
    },

    async createBounty(data) {
      message.success('悬赏发布成功')
      return { id: Date.now(), ...data }
    },

    async saveDraft(data) {
      const draft = { id: Date.now(), ...data, updatedAt: new Date().toISOString() }
      this.drafts.unshift(draft)
      message.success('草稿保存成功')
      return draft
    },

    async fetchDrafts() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 200)
    },

    async deleteDraft(id) {
      this.drafts = this.drafts.filter(d => d.id !== id)
      message.success('草稿已删除')
    },

    async bidBounty(bountyId, data) {
      message.success('投标成功')
      return { id: Date.now(), bountyId, ...data }
    },
  },
})
