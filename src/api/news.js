import request from '@/utils/request'

/**
 * 资讯相关API
 */

// 获取资讯列表
export const getNewsList = (params) => {
  return request.get('/news', { params })
}

// 获取资讯详情
export const getNewsDetail = (id) => {
  return request.get(`/news/${id}`)
}

// 获取最新资讯
export const getLatestNews = (params) => {
  return request.get('/news/latest', { params })
}
