import request from '@/utils/request'

/**
 * 管理员相关API
 */

// 获取仪表盘数据
export const getDashboardData = () => {
  return request.get('/admin/dashboard')
}

// 审核内容
export const reviewContent = (type, id, data) => {
  return request.post(`/admin/review/${type}/${id}`, data)
}

// 获取统计数据
export const getStatistics = (params) => {
  return request.get('/admin/statistics', { params })
}

// 获取系统日志
export const getLogs = (params) => {
  return request.get('/admin/logs', { params })
}

// 管理公告
export const manageAnnouncement = (data) => {
  return request.post('/admin/announcements', data)
}

// 管理论坛板块
export const manageForumSection = (data) => {
  return request.post('/admin/forum-sections', data)
}

// 获取用户列表
export const getUserList = (params) => {
  return request.get('/admin/users', { params })
}

// 获取用户详情
export const getUserDetail = (id) => {
  return request.get(`/admin/users/${id}`)
}

// 切换用户状态（启用/禁用）
export const toggleUserStatus = (id, data) => {
  return request.post(`/admin/users/${id}/toggle-status`, data)
}

// 获取角色列表
export const getRoleList = () => {
  return request.get('/admin/roles')
}

// 更新角色权限
export const updateRolePermissions = (id, data) => {
  return request.put(`/admin/roles/${id}/permissions`, data)
}
