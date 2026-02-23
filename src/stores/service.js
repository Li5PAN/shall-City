import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

const mockServices = [
  { id: 1, title: '企业级Web应用开发', description: '提供从需求分析到上线部署的全栈Web开发服务', price: 15000, originalPrice: 20000, rating: 4.8, reviews: 126, provider: '极客工坊', tags: ['Vue', 'Node.js', '全栈'], coverImage: '', category: 'Web开发' },
  { id: 2, title: 'AI智能客服系统搭建', description: '基于大模型的智能客服解决方案，支持多轮对话和知识库管理', price: 28000, rating: 4.9, reviews: 89, provider: 'AI解决方案', tags: ['AI', 'NLP', '大模型'], coverImage: '', category: 'AI服务' },
  { id: 3, title: '移动端App开发', description: 'iOS/Android双端原生或跨平台应用开发', price: 25000, originalPrice: 30000, rating: 4.7, reviews: 203, provider: '移动先锋', tags: ['Flutter', 'React Native'], coverImage: '', category: '移动开发' },
  { id: 4, title: '数据库性能优化', description: '针对MySQL/PostgreSQL的查询优化、索引调优和架构改造', price: 8000, rating: 4.6, reviews: 67, provider: 'DBA专家组', tags: ['MySQL', 'PostgreSQL', '性能优化'], coverImage: '', category: '数据库' },
  { id: 5, title: 'DevOps流水线搭建', description: 'CI/CD自动化部署流水线设计与实施', price: 12000, rating: 4.8, reviews: 45, provider: '运维之道', tags: ['Docker', 'K8s', 'Jenkins'], coverImage: '', category: '运维' },
  { id: 6, title: 'UI/UX设计服务', description: '产品界面设计、交互设计和设计系统搭建', price: 10000, rating: 4.9, reviews: 156, provider: '设计工坊', tags: ['Figma', 'UI设计', '交互'], coverImage: '', category: '设计' },
]

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceList: [...mockServices],
    currentService: null,
    filters: { category: '', priceRange: [0, 50000], sortBy: 'latest', keyword: '' },
    pagination: { current: 1, pageSize: 12, total: mockServices.length },
    loading: false,
  }),

  actions: {
    async fetchServiceList(params) {
      this.loading = true
      setTimeout(() => {
        this.serviceList = [...mockServices]
        this.pagination.total = mockServices.length
        this.loading = false
      }, 300)
    },

    async fetchServiceDetail(id) {
      this.loading = true
      setTimeout(() => {
        this.currentService = mockServices.find(s => s.id === Number(id)) || mockServices[0]
        this.loading = false
      }, 200)
    },

    async createService(data) {
      message.success('服务创建成功')
      return { id: Date.now(), ...data }
    },

    async updateService(id, data) {
      message.success('服务更新成功')
      return { id, ...data }
    },

    async purchaseService(serviceId, paymentData) {
      message.success('购买成功')
      return { orderId: Date.now(), serviceId }
    },
  },
})
