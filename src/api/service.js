import request from '@/utils/request'

/**
 * 服务交易相关API
 */

// 获取服务列表
export const getServiceList = (params) => {
  return request.get('/services', { params })
}

// 获取服务详情
export const getServiceDetail = (id) => {
  return request.get(`/services/${id}`)
}

// 创建服务
export const createService = (data) => {
  return request.post('/services', data)
}

// 更新服务
export const updateService = (id, data) => {
  return request.put(`/services/${id}`, data)
}

// 删除服务
export const deleteService = (id) => {
  return request.delete(`/services/${id}`)
}

// 购买服务
export const purchaseService = (id, data) => {
  return request.post(`/services/${id}/purchase`, data)
}
