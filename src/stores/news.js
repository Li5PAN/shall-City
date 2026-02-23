import { defineStore } from 'pinia'

const mockNewsList = [
  { id: 1, title: '2025年前端技术趋势展望', summary: '从React Server Components到AI辅助开发，前端领域正在经历深刻变革...', author: '技术前沿', category: '前端', coverImage: '', views: 2340, createdAt: '2025-02-20' },
  { id: 2, title: 'Rust在系统编程中的崛起', summary: 'Rust语言凭借内存安全和高性能特性，正在逐步替代C++在系统编程中的地位...', author: '编程语言', category: '后端', coverImage: '', views: 1890, createdAt: '2025-02-19' },
  { id: 3, title: 'AI大模型应用开发实战指南', summary: '本文介绍如何利用主流大模型API构建智能应用，包括提示工程和RAG技术...', author: 'AI研究院', category: 'AI', coverImage: '', views: 3210, createdAt: '2025-02-18' },
  { id: 4, title: '微服务架构最佳实践2025', summary: '从服务拆分到可观测性，全面解析微服务架构在生产环境中的最佳实践...', author: '架构师之路', category: '架构', coverImage: '', views: 1560, createdAt: '2025-02-17' },
  { id: 5, title: 'Kubernetes 1.30新特性解读', summary: 'K8s最新版本带来了多项重要更新，包括Sidecar容器原生支持和调度增强...', author: '云原生社区', category: '云原生', coverImage: '', views: 2100, createdAt: '2025-02-16' },
  { id: 6, title: 'WebAssembly在边缘计算中的应用', summary: 'Wasm正在成为边缘计算的重要运行时，本文探讨其在IoT和CDN场景中的实践...', author: '边缘计算', category: '前沿', coverImage: '', views: 980, createdAt: '2025-02-15' },
]

export const useNewsStore = defineStore('news', {
  state: () => ({
    newsList: [...mockNewsList],
    currentNews: null,
    categories: ['前端', '后端', 'AI', '架构', '云原生', '前沿'],
    filters: { category: '', keyword: '' },
    pagination: { current: 1, pageSize: 10, total: mockNewsList.length },
    loading: false,
  }),

  actions: {
    async fetchNewsList(params) {
      this.loading = true
      setTimeout(() => {
        this.newsList = [...mockNewsList]
        this.pagination.total = mockNewsList.length
        this.loading = false
      }, 300)
    },

    async fetchNewsDetail(id) {
      this.loading = true
      setTimeout(() => {
        this.currentNews = mockNewsList.find(n => n.id === Number(id)) || mockNewsList[0]
        this.loading = false
      }, 200)
    },

    async fetchLatestNews(params) {
      return { list: mockNewsList.slice(0, params?.pageSize || 6), total: mockNewsList.length }
    },
  },
})
