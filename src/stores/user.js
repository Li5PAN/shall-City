import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import {
  getProfile,
  updateProfile as updateProfileApi,
  changePassword as changePasswordApi,
  bindPhone as bindPhoneApi,
  bindEmail as bindEmailApi,
  applyRole as applyRoleApi,
  getMessages,
  markAsRead as markAsReadApi,
  getSubscriptions,
  updatePrivacySettings as updatePrivacySettingsApi,
} from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    messages: [],
    unreadCount: 0,
    subscriptions: { categories: [], providers: [] },
    privacySettings: {},
    roleApplication: null,
  }),

  actions: {
    async fetchProfile() {
      try {
        this.profile = await getProfile()
      } catch (e) {
        message.error(e.message || '获取个人信息失败')
      }
    },

    async updateProfile(data) {
      try {
        const res = await updateProfileApi(data)
        this.profile = { ...this.profile, ...data }
        message.success('个人信息更新成功')
        return res
      } catch (e) {
        message.error(e.message || '更新个人信息失败')
        throw e
      }
    },

    async changePassword(data) {
      try {
        const res = await changePasswordApi(data)
        message.success('密码修改成功')
        return res
      } catch (e) {
        message.error(e.message || '修改密码失败')
        throw e
      }
    },

    async bindPhone(data) {
      try {
        const res = await bindPhoneApi(data)
        message.success('手机号绑定成功')
        return res
      } catch (e) {
        message.error(e.message || '绑定手机号失败')
        throw e
      }
    },

    async bindEmail(data) {
      try {
        const res = await bindEmailApi(data)
        message.success('邮箱绑定成功')
        return res
      } catch (e) {
        message.error(e.message || '绑定邮箱失败')
        throw e
      }
    },

    async applyRole(data) {
      try {
        const res = await applyRoleApi(data)
        this.roleApplication = res
        message.success('角色申请已提交')
        return res
      } catch (e) {
        message.error(e.message || '提交角色申请失败')
        throw e
      }
    },

    async fetchMessages(params) {
      try {
        const res = await getMessages(params)
        this.messages = res.list || res.data || []
        this.unreadCount = res.unreadCount || 0
      } catch (e) {
        message.error(e.message || '获取消息列表失败')
      }
    },

    async markAsRead(ids) {
      try {
        await markAsReadApi(ids)
        this.messages = this.messages.map((msg) =>
          ids.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
        this.unreadCount = this.messages.filter((m) => !m.isRead).length
      } catch (e) {
        message.error(e.message || '标记已读失败')
        throw e
      }
    },

    async fetchSubscriptions() {
      try {
        const res = await getSubscriptions()
        this.subscriptions = res || { categories: [], providers: [] }
      } catch (e) {
        message.error(e.message || '获取订阅列表失败')
      }
    },

    async updatePrivacySettings(data) {
      try {
        const res = await updatePrivacySettingsApi(data)
        this.privacySettings = { ...this.privacySettings, ...data }
        message.success('隐私设置更新成功')
        return res
      } catch (e) {
        message.error(e.message || '更新隐私设置失败')
        throw e
      }
    },
  },
})
