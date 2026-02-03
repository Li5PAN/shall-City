import request from '@/utils/request'

/**
 * 悬赏相关API
 */

// 获取悬赏列表
export const getBountyList = (params) => {
  return request.get('/bounties', { params })
}

// 获取悬赏详情
export const getBountyDetail = (id) => {
  return request.get(`/bounties/${id}`)
}

// 发布悬赏
export const createBounty = (data) => {
  return request.post('/bounties', data)
}

// 更新悬赏
export const updateBounty = (id, data) => {
  return request.put(`/bounties/${id}`, data)
}

// 删除悬赏
export const deleteBounty = (id) => {
  return request.delete(`/bounties/${id}`)
}

// 投标悬赏
export const bidBounty = (id, data) => {
  return request.post(`/bounties/${id}/bids`, data)
}

// 获取投标列表
export const getBidList = (bountyId, params) => {
  return request.get(`/bounties/${bountyId}/bids`, { params })
}

// 选择中标者
export const selectBidder = (bountyId, bidId) => {
  return request.post(`/bounties/${bountyId}/bids/${bidId}/select`)
}

// 获取悬赏分类
export const getBountyCategories = () => {
  return request.get('/bounties/categories')
}

// 获取热门技能标签
export const getPopularSkills = () => {
  return request.get('/bounties/popular-skills')
}

// 上传附件
export const uploadAttachment = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/attachment', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 保存草稿
export const saveBountyDraft = (data) => {
  return request.post('/bounties/draft', data)
}

// 获取草稿列表
export const getBountyDrafts = (params) => {
  return request.get('/bounties/drafts', { params })
}

// 删除草稿
export const deleteBountyDraft = (id) => {
  return request.delete(`/bounties/drafts/${id}`)
}