import request from '@/utils/request'

/**
 * 用户/个人中心相关API
 */

// 获取个人信息
export const getProfile = () => {
  return request.get('/user/profile')
}

// 更新个人信息
export const updateProfile = (data) => {
  return request.put('/user/profile', data)
}

// 修改密码
export const changePassword = (data) => {
  return request.post('/user/change-password', data)
}

// 绑定手机号
export const bindPhone = (data) => {
  return request.post('/user/bind-phone', data)
}

// 绑定邮箱
export const bindEmail = (data) => {
  return request.post('/user/bind-email', data)
}

// 申请角色升级
export const applyRole = (data) => {
  return request.post('/user/apply-role', data)
}

// 获取消息列表
export const getMessages = (params) => {
  return request.get('/user/messages', { params })
}

// 标记消息已读
export const markAsRead = (ids) => {
  return request.post('/user/messages/read', { ids })
}

// 获取订阅列表
export const getSubscriptions = () => {
  return request.get('/user/subscriptions')
}

// 更新隐私设置
export const updatePrivacySettings = (data) => {
  return request.put('/user/privacy-settings', data)
}
