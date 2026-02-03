<template>
  <div class="placeholder-page">
    <a-result
      status="info"
      :title="title"
      :sub-title="description"
    >
      <template #extra>
        <a-button type="primary" @click="$router.go(-1)">返回</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '页面开发中'
  },
  description: {
    type: String,
    default: '该页面正在开发中，敬请期待...'
  }
})
</script>

<style scoped lang="less">
.placeholder-page {
  padding: 50px 20px;
}
</style>