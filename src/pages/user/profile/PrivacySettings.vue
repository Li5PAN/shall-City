<template>
  <div class="privacy-settings-page">
    <a-card title="隐私设置">
      <a-spin :spinning="loading">
        <a-form :model="formData" layout="vertical" style="max-width: 600px;">
          <!-- 个人信息可见性 -->
          <a-form-item label="个人信息可见性">
            <a-radio-group v-model:value="formData.profileVisibility">
              <a-radio value="public">公开 - 所有人可见</a-radio>
              <a-radio value="followers">仅关注者可见</a-radio>
              <a-radio value="private">仅自己可见</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- 消息接收偏好 -->
          <a-form-item label="消息接收偏好">
            <a-checkbox-group v-model:value="formData.messagePreferences" :options="messageOptions" />
          </a-form-item>

          <!-- 是否允许被搜索 -->
          <a-form-item label="允许被搜索">
            <a-switch v-model:checked="formData.allowSearch" checked-children="开" un-checked-children="关" />
            <span class="switch-desc">开启后，其他用户可通过搜索找到你</span>
          </a-form-item>

          <!-- 是否显示在线状态 -->
          <a-form-item label="显示在线状态">
            <a-switch v-model:checked="formData.showOnlineStatus" checked-children="开" un-checked-children="关" />
            <span class="switch-desc">开启后，其他用户可看到你的在线状态</span>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" :loading="submitting" @click="handleSave">保存设置</a-button>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const loading = ref(false)
const submitting = ref(false)

const messageOptions = [
  { label: '系统通知', value: 'system' },
  { label: '订单通知', value: 'order' },
  { label: '互动通知', value: 'interaction' },
]

const formData = reactive({
  profileVisibility: 'public',
  messagePreferences: ['system', 'order', 'interaction'],
  allowSearch: true,
  showOnlineStatus: true,
})

const loadSettings = () => {
  const settings = userStore.privacySettings
  if (settings && Object.keys(settings).length > 0) {
    Object.assign(formData, settings)
  }
}

const handleSave = async () => {
  submitting.value = true
  try {
    await userStore.updatePrivacySettings({ ...formData })
  } catch { /* handled in store */ } finally { submitting.value = false }
}

onMounted(() => {
  loading.value = true
  loadSettings()
  loading.value = false
})
</script>

<style scoped lang="less">
.privacy-settings-page {
  .switch-desc {
    margin-left: 12px;
    color: #999;
    font-size: 13px;
  }

  :deep(.ant-radio-group) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  :deep(.ant-checkbox-group) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
