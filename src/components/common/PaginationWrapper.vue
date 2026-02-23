<template>
  <div class="pagination-wrapper">
    <a-pagination
      :current="current"
      :page-size="pageSize"
      :total="total"
      show-size-changer
      show-quick-jumper
      :show-total="total => `共 ${total} 条`"
      @change="handleChange"
      @show-size-change="handleChange"
    />
  </div>
</template>

<script setup>
defineProps({
  total: {
    type: Number,
    default: 0
  },
  current: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['change'])

const handleChange = (page, pageSize) => {
  emit('change', page, pageSize)
}
</script>

<style scoped lang="less">
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
