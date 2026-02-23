<template>
  <div :class="['user-avatar', `user-avatar--${size}`]">
    <a-avatar :size="avatarSize" :src="user.avatar">
      <template #icon><UserOutlined /></template>
    </a-avatar>
    <span v-if="showName" class="user-avatar__name">{{ user.nickname || '匿名用户' }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ avatar: '', nickname: '' })
  },
  size: {
    type: String,
    default: 'default',
    validator: (val) => ['small', 'default', 'large'].includes(val)
  },
  showName: {
    type: Boolean,
    default: true
  }
})

const sizeMap = { small: 24, default: 32, large: 48 }

const avatarSize = computed(() => sizeMap[props.size] || 32)
</script>

<style scoped lang="less">
.user-avatar {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &__name {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
  }

  &--small &__name {
    font-size: 12px;
  }

  &--large &__name {
    font-size: 16px;
  }
}
</style>
