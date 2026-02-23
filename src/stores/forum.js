import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

const mockSections = [
  { id: 1, name: '前端开发', icon: '💻', postCount: 1234 },
  { id: 2, name: '后端技术', icon: '⚙️', postCount: 987 },
  { id: 3, name: 'AI与机器学习', icon: '🤖', postCount: 2345 },
  { id: 4, name: '移动开发', icon: '📱', postCount: 567 },
  { id: 5, name: '运维与DevOps', icon: '🔧', postCount: 432 },
]

const mockPosts = [
  { id: 1, title: 'Vue 3.5 新特性深度解析', content: 'Vue 3.5带来了响应式性能优化和新的编译器特性...', author: '前端达人', authorAvatar: '', section: '前端开发', likes: 234, comments: 56, views: 3400, createdAt: '2025-02-20', isLiked: false, isFavorited: false },
  { id: 2, title: 'Go语言并发编程最佳实践', content: '本文总结了Go语言在高并发场景下的编程模式和注意事项...', author: 'Gopher', authorAvatar: '', section: '后端技术', likes: 189, comments: 34, views: 2100, createdAt: '2025-02-19', isLiked: false, isFavorited: false },
  { id: 3, title: 'Transformer架构原理详解', content: '从Attention机制到完整的Transformer架构，一步步理解...', author: 'AI研究员', authorAvatar: '', section: 'AI与机器学习', likes: 456, comments: 89, views: 5600, createdAt: '2025-02-18', isLiked: true, isFavorited: true },
  { id: 4, title: 'Flutter 3.x跨平台开发实战', content: '使用Flutter构建高性能跨平台应用的完整指南...', author: '移动开发者', authorAvatar: '', section: '移动开发', likes: 123, comments: 28, views: 1800, createdAt: '2025-02-17', isLiked: false, isFavorited: false },
  { id: 5, title: 'Kubernetes故障排查手册', content: '生产环境中K8s常见问题的排查思路和解决方案...', author: 'SRE工程师', authorAvatar: '', section: '运维与DevOps', likes: 345, comments: 67, views: 4200, createdAt: '2025-02-16', isLiked: false, isFavorited: true },
]

export const useForumStore = defineStore('forum', {
  state: () => ({
    sections: [...mockSections],
    postList: [...mockPosts],
    currentPost: null,
    myPosts: mockPosts.slice(0, 2),
    myLikes: mockPosts.filter(p => p.isLiked),
    hotPosts: [...mockPosts].sort((a, b) => b.likes - a.likes),
    pagination: { current: 1, pageSize: 20, total: mockPosts.length },
    loading: false,
  }),

  actions: {
    async fetchSections() {
      this.sections = [...mockSections]
    },

    async fetchPostList(params) {
      this.loading = true
      setTimeout(() => {
        this.postList = [...mockPosts]
        this.pagination.total = mockPosts.length
        this.loading = false
      }, 300)
    },

    async fetchPostDetail(id) {
      this.loading = true
      setTimeout(() => {
        this.currentPost = mockPosts.find(p => p.id === Number(id)) || mockPosts[0]
        this.loading = false
      }, 200)
    },

    async createPost(data) {
      message.success('帖子发布成功')
      return { id: Date.now(), ...data }
    },

    async likePost(id) {
      const post = mockPosts.find(p => p.id === Number(id))
      if (post) {
        post.isLiked = !post.isLiked
        post.likes += post.isLiked ? 1 : -1
      }
      return { liked: post?.isLiked }
    },

    async favoritePost(id) {
      const post = mockPosts.find(p => p.id === Number(id))
      if (post) {
        post.isFavorited = !post.isFavorited
      }
      return { favorited: post?.isFavorited }
    },

    async fetchMyPosts() {
      this.loading = true
      setTimeout(() => {
        this.myPosts = mockPosts.slice(0, 2)
        this.loading = false
      }, 200)
    },

    async fetchMyLikes() {
      this.loading = true
      setTimeout(() => {
        this.myLikes = mockPosts.filter(p => p.isLiked)
        this.loading = false
      }, 200)
    },
  },
})
