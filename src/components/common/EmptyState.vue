<template>
  <div class="empty-state">
    <a-empty :description="description" :image="image || undefined">
      <template v-if="showAction" #default>
        <slot name="action">
          <a-button type="primary" @click="$emit('action')">立即操作</a-button>
        </slot>
      </template>
    </a-empty>
  </div>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: '暂无数据'
  },
  image: {
    type: String,
    default: ''
  },
  showAction: {
    type: Boolean,
    default: false
  }
})

defineEmits(['action'])
</script>

<style scoped lang="less">
.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
