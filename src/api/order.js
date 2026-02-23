import request from '@/utils/request'

/**
 * 订单管理相关API
 */

// 获取订单列表
export const getOrderList = (params) => {
  return request.get('/orders', { params })
}

// 获取订单详情
export const getOrderDetail = (id) => {
  return request.get(`/orders/${id}`)
}

// 创建订单
export const createOrder = (data) => {
  return request.post('/orders', data)
}

// 提交交付物
export const deliverOrder = (id, data) => {
  return request.post(`/orders/${id}/deliver`, data)
}

// 验收订单
export const acceptOrder = (id, data) => {
  return request.post(`/orders/${id}/accept`, data)
}

// 拒绝验收
export const rejectOrder = (id, data) => {
  return request.post(`/orders/${id}/reject`, data)
}

// 发起申诉
export const appealOrder = (id, data) => {
  return request.post(`/orders/${id}/appeal`, data)
}

// 仲裁订单
export const arbitrateOrder = (id, data) => {
  return request.post(`/orders/${id}/arbitrate`, data)
}

// 获取交易记录
export const getTransactions = (params) => {
  return request.get('/transactions', { params })
}

// 导出交易记录
export const exportTransactions = (params) => {
  return request.get('/transactions/export', { params, responseType: 'blob' })
}
