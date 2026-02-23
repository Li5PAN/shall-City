import request from '@/utils/request'

/**
 * 论坛相关API
 */

// 获取板块列表
export const getSections = () => {
  return request.get('/forum/sections')
}

// 获取帖子列表
export const getPostList = (params) => {
  return request.get('/forum/posts', { params })
}

// 获取帖子详情
export const getPostDetail = (id) => {
  return request.get(`/forum/posts/${id}`)
}

// 发布帖子
export const createPost = (data) => {
  return request.post('/forum/posts', data)
}

// 点赞帖子
export const likePost = (id) => {
  return request.post(`/forum/posts/${id}/like`)
}

// 收藏帖子
export const favoritePost = (id) => {
  return request.post(`/forum/posts/${id}/favorite`)
}

// 获取我的帖子
export const getMyPosts = (params) => {
  return request.get('/forum/posts/mine', { params })
}

// 获取我的点赞
export const getMyLikes = (params) => {
  return request.get('/forum/posts/liked', { params })
}
