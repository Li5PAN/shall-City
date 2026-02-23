import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

const mockOrders = [
  { id: 1, orderNo: 'ORD20250220001', serviceTitle: '企业级Web应用开发', amount: 15000, status: 'paid', provider: '极客工坊', createdAt: '2025-02-20', deliveryDate: '2025-03-20' },
  { id: 2, orderNo: 'ORD20250219002', serviceTitle: 'AI智能客服系统搭建', amount: 28000, status: 'in_progress', provider: 'AI解决方案', createdAt: '2025-02-19', deliveryDate: '2025-03-25' },
  { id: 3, orderNo: 'ORD20250218003', serviceTitle: '数据库性能优化', amount: 8000, status: 'completed', provider: 'DBA专家组', createdAt: '2025-02-18', deliveryDate: '2025-03-05' },
  { id: 4, orderNo: 'ORD20250215004', serviceTitle: 'UI/UX设计服务', amount: 10000, status: 'completed', provider: '设计工坊', createdAt: '2025-02-15', deliveryDate: '2025-03-01' },
  { id: 5, orderNo: 'ORD20250210005', serviceTitle: 'DevOps流水线搭建', amount: 12000, status: 'cancelled', provider: '运维之道', createdAt: '2025-02-10', deliveryDate: '' },
]

const mockTransactions = [
  { id: 1, type: 'payment', amount: -15000, description: '支付订单 ORD20250220001', createdAt: '2025-02-20', balance: 85000 },
  { id: 2, type: 'payment', amount: -28000, description: '支付订单 ORD20250219002', createdAt: '2025-02-19', balance: 100000 },
  { id: 3, type: 'refund', amount: 12000, description: '退款订单 ORD20250210005', createdAt: '2025-02-12', balance: 128000 },
  { id: 4, type: 'recharge', amount: 50000, description: '账户充值', createdAt: '2025-02-10', balance: 116000 },
]

export const useOrderStore = defineStore('order', {
  state: () => ({
    orderList: [...mockOrders],
    currentOrder: null,
    transactions: [...mockTransactions],
    filters: { status: '', keyword: '' },
    pagination: { current: 1, pageSize: 10, total: mockOrders.length },
    loading: false,
  }),

  actions: {
    async fetchOrderList(params) {
      this.loading = true
      setTimeout(() => {
        this.orderList = [...mockOrders]
        this.pagination.total = mockOrders.length
        this.loading = false
      }, 300)
    },

    async fetchOrderDetail(id) {
      this.loading = true
      setTimeout(() => {
        this.currentOrder = mockOrders.find(o => o.id === Number(id)) || mockOrders[0]
        this.loading = false
      }, 200)
    },

    async fetchTransactions(params) {
      this.loading = true
      setTimeout(() => {
        this.transactions = [...mockTransactions]
        this.loading = false
      }, 200)
    },

    async cancelOrder(id) {
      const order = this.orderList.find(o => o.id === Number(id))
      if (order) order.status = 'cancelled'
      message.success('订单已取消')
    },

    async confirmDelivery(id) {
      const order = this.orderList.find(o => o.id === Number(id))
      if (order) order.status = 'completed'
      message.success('已确认收货')
    },

    async submitAppeal(id, data) {
      message.success('申诉已提交')
      return { id: Date.now(), orderId: id, ...data }
    },
  },
})
