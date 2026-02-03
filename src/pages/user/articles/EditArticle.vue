<template>
  <div class="edit-article-page">
    <!-- 复用创建文章组件 -->
    <CreateArticle />
  </div>
</template>

<script setup>
import CreateArticle from './CreateArticle.vue'
</script>

<style scoped lang="less">
.edit-article-page {
  // 编辑页面的特殊样式可以在这里添加
}
</style>