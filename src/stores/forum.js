import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import {
  getSections,
  getPostList,
  getPostDetail,
  createPost as createPostApi,
  likePost as likePostApi,
  favoritePost as favoritePostApi,
  getMyPosts,
  getMyLikes,
} from '@/api/forum'

export const useForumStore = defineStore('forum', {
  state: () => ({
    sections: [],
    postList: [],
    currentPost: null,
    myPosts: [],
    myLikes: [],
    hotPosts: [],
    pagination: { current: 1, pageSize: 20, total: 0 },
    loading: false,
  }),

  actions: {
    async fetchSections() {
      try {
        const res = await getSections()
        this.sections = res || []
      } catch (e) {
        message.error(e.message || '获取板块列表失败')
      }
    },

    async fetchPostList(params) {
      this.loading = true
      try {
        const res = await getPostList({ ...this.pagination, ...params })
        this.postList = res.list || res.data || []
        this.pagination.total = res.total || 0
      } catch (e) {
        message.error(e.message || '获取帖子列表失败')
      } finally {
        this.loading = false
      }
    },

    async fetchPostDetail(id) {
      this.loading = true
      try {
        this.currentPost = await getPostDetail(id)
      } catch (e) {
        message.error(e.message || '获取帖子详情失败')
      } finally {
        this.loading = false
      }
    },

    async createPost(data) {
      try {
        const res = await createPostApi(data)
        message.success('帖子发布成功')
        return res
      } catch (e) {
        message.error(e.message || '发布帖子失败')
        throw e
      }
    },

    async likePost(id) {
      try {
        const res = await likePostApi(id)
        return res
      } catch (e) {
        message.error(e.message || '点赞失败')
        throw e
      }
    },

    async favoritePost(id) {
      try {
        const res = await favoritePostApi(id)
        return res
      } catch (e) {
        message.error(e.message || '收藏失败')
        throw e
      }
    },

    async fetchMyPosts(params) {
      this.loading = true
      try {
        const res = await getMyPosts(params)
        this.myPosts = res.list || res.data || []
      } catch (e) {
        message.error(e.message || '获取我的帖子失败')
      } finally {
        this.loading = false
      }
    },

    async fetchMyLikes(params) {
      this.loading = true
      try {
        const res = await getMyLikes(params)
        this.myLikes = res.list || res.data || []
      } catch (e) {
        message.error(e.message || '获取我的点赞失败')
      } finally {
        this.loading = false
      }
    },
  },
})
