<template>
  <div class="loading-spinner">
    <a-spin :spinning="loading" :tip="tip" :size="size">
      <slot />
    </a-spin>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  tip: {
    type: String,
    default: '加载中...'
  },
  size: {
    type: String,
    default: 'default',
    validator: v => ['small', 'default', 'large'].includes(v)
  }
})
</script>

<style scoped lang="less">
.loading-spinner {
  width: 100%;
}
</style>
