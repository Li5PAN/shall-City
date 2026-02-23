import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import {
  getOrderList,
  getOrderDetail,
  createOrder as createOrderApi,
  deliverOrder as deliverOrderApi,
  acceptOrder as acceptOrderApi,
  rejectOrder as rejectOrderApi,
  appealOrder as appealOrderApi,
  arbitrateOrder as arbitrateOrderApi,
  getTransactions,
  exportTransactions as exportTransactionsApi,
} from '@/api/order'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderList: [],
    currentOrder: null,
    statusFilter: 'all',
    pagination: { current: 1, pageSize: 10, total: 0 },
    loading: false,
  }),

  actions: {
    async fetchOrderList(params) {
      this.loading = true
      try {
        const res = await getOrderList({ status: this.statusFilter, ...this.pagination, ...params })
        this.orderList = res.list || res.data || []
        this.pagination.total = res.total || 0
      } catch (e) {
        message.error(e.message || '获取订单列表失败')
      } finally {
        this.loading = false
      }
    },

    async fetchOrderDetail(id) {
      this.loading = true
      try {
        this.currentOrder = await getOrderDetail(id)
      } catch (e) {
        message.error(e.message || '获取订单详情失败')
      } finally {
        this.loading = false
      }
    },

    async createOrder(data) {
      try {
        const res = await createOrderApi(data)
        message.success('订单创建成功')
        return res
      } catch (e) {
        message.error(e.message || '创建订单失败')
        throw e
      }
    },

    async deliverOrder(id, deliveryData) {
      try {
        const res = await deliverOrderApi(id, deliveryData)
        message.success('交付物提交成功')
        return res
      } catch (e) {
        message.error(e.message || '提交交付物失败')
        throw e
      }
    },

    async acceptOrder(id, acceptData) {
      try {
        const res = await acceptOrderApi(id, acceptData)
        message.success('验收通过')
        return res
      } catch (e) {
        message.error(e.message || '验收操作失败')
        throw e
      }
    },

    async rejectOrder(id, reason) {
      try {
        const res = await rejectOrderApi(id, reason)
        message.success('已拒绝验收')
        return res
      } catch (e) {
        message.error(e.message || '拒绝验收失败')
        throw e
      }
    },

    async appealOrder(id, appealData) {
      try {
        const res = await appealOrderApi(id, appealData)
        message.success('申诉提交成功')
        return res
      } catch (e) {
        message.error(e.message || '提交申诉失败')
        throw e
      }
    },

    async arbitrateOrder(id, arbitrationData) {
      try {
        const res = await arbitrateOrderApi(id, arbitrationData)
        message.success('仲裁结果已提交')
        return res
      } catch (e) {
        message.error(e.message || '提交仲裁失败')
        throw e
      }
    },

    async fetchTransactions(params) {
      this.loading = true
      try {
        const res = await getTransactions(params)
        return res
      } catch (e) {
        message.error(e.message || '获取交易记录失败')
      } finally {
        this.loading = false
      }
    },

    async exportTransactions(params) {
      try {
        const res = await exportTransactionsApi(params)
        return res
      } catch (e) {
        message.error(e.message || '导出交易记录失败')
        throw e
      }
    },
  },
})
