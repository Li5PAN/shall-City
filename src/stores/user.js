import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'

const mockProfile = {
  id: 3, username: 'chant_96', nickname: 'chant_96', email: 'user@example.com',
  phone: '138****8888', avatar: '', bio: '热爱技术，专注前端开发',
  followers: 141, following: 56, articles: 23, likes: 890,
}

const mockFavorites = [
  { id: 1, type: 'article', title: 'Vue 3.5 新特性深度解析', createdAt: '2025-02-20' },
  { id: 2, type: 'service', title: '企业级Web应用开发', createdAt: '2025-02-18' },
  { id: 3, type: 'bounty', title: '企业内部知识库系统开发', createdAt: '2025-02-15' },
]

const mockFollowers = [
  { id: 10, nickname: '技术小白', avatar: '', bio: '学习中...' },
  { id: 11, nickname: '全栈工程师', avatar: '', bio: '5年全栈经验' },
]

const mockFollowing = [
  { id: 20, nickname: '前端大神', avatar: '', bio: 'Vue核心贡献者' },
  { id: 21, nickname: 'AI研究员', avatar: '', bio: '专注NLP方向' },
]

const mockMessages = [
  { id: 1, type: 'system', title: '系统通知', content: '您的文章已通过审核', read: false, createdAt: '2025-02-20' },
  { id: 2, type: 'comment', title: '评论通知', content: '有人评论了您的文章', read: false, createdAt: '2025-02-19' },
  { id: 3, type: 'like', title: '点赞通知', content: '有人赞了您的帖子', read: true, createdAt: '2025-02-18' },
]

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: { ...mockProfile },
    favorites: [...mockFavorites],
    followers: [...mockFollowers],
    following: [...mockFollowing],
    messages: [...mockMessages],
    loading: false,
  }),

  getters: {
    unreadCount: (state) => state.messages.filter(m => !m.read).length,
  },

  actions: {
    async fetchProfile() {
      this.profile = { ...mockProfile }
    },

    async updateProfile(data) {
      this.profile = { ...this.profile, ...data }
      message.success('个人信息更新成功')
    },

    async fetchFavorites() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 200)
    },

    async fetchFollowers() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 200)
    },

    async fetchFollowing() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 200)
    },

    async fetchMessages() {
      this.loading = true
      setTimeout(() => { this.loading = false }, 200)
    },

    async markMessageRead(id) {
      const msg = this.messages.find(m => m.id === id)
      if (msg) msg.read = true
    },

    async changePassword(data) {
      message.success('密码修改成功')
    },
  },
})
