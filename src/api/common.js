import request from '@/utils/request'

/**
 * 公共API
 */

// 文件上传
export const uploadFile = (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  })
}

// 全局搜索
export const globalSearch = (params) => {
  return request.get('/search', { params })
}
