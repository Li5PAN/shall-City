import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import {
  getServiceList,
  getServiceDetail,
  createService as createServiceApi,
  updateService as updateServiceApi,
  purchaseService as purchaseServiceApi,
} from '@/api/service'

export const useServiceStore = defineStore('service', {
  state: () => ({
    serviceList: [],
    currentService: null,
    filters: { category: '', priceRange: [0, 50000], sortBy: 'latest', keyword: '' },
    pagination: { current: 1, pageSize: 12, total: 0 },
    loading: false,
  }),

  actions: {
    async fetchServiceList(params) {
      this.loading = true
      try {
        const res = await getServiceList({ ...this.filters, ...this.pagination, ...params })
        this.serviceList = res.list || res.data || []
        this.pagination.total = res.total || 0
      } catch (e) {
        message.error(e.message || '获取服务列表失败')
      } finally {
        this.loading = false
      }
    },

    async fetchServiceDetail(id) {
      this.loading = true
      try {
        this.currentService = await getServiceDetail(id)
      } catch (e) {
        message.error(e.message || '获取服务详情失败')
      } finally {
        this.loading = false
      }
    },

    async createService(data) {
      try {
        const res = await createServiceApi(data)
        message.success('服务创建成功')
        return res
      } catch (e) {
        message.error(e.message || '创建服务失败')
        throw e
      }
    },

    async updateService(id, data) {
      try {
        const res = await updateServiceApi(id, data)
        message.success('服务更新成功')
        return res
      } catch (e) {
        message.error(e.message || '更新服务失败')
        throw e
      }
    },

    async purchaseService(serviceId, paymentData) {
      try {
        const res = await purchaseServiceApi(serviceId, paymentData)
        message.success('购买成功')
        return res
      } catch (e) {
        message.error(e.message || '购买服务失败')
        throw e
      }
    },
  },
})
