<template>
  <div class="search-filter">
    <a-form layout="inline" :model="formState">
      <a-form-item v-for="filter in filters" :key="filter.field" :label="filter.label">
        <!-- Input 类型 -->
        <a-input
          v-if="filter.type === 'input'"
          v-model:value="formState[filter.field]"
          :placeholder="filter.placeholder || `请输入${filter.label}`"
          allow-clear
          style="width: 200px"
          @press-enter="handleSearch"
        />
        <!-- Select 类型 -->
        <a-select
          v-else-if="filter.type === 'select'"
          v-model:value="formState[filter.field]"
          :placeholder="filter.placeholder || `请选择${filter.label}`"
          :options="filter.options || []"
          allow-clear
          style="width: 180px"
        />
        <!-- Range 类型 -->
        <a-slider
          v-else-if="filter.type === 'range'"
          v-model:value="formState[filter.field]"
          range
          :min="filter.min || 0"
          :max="filter.max || 100"
          style="width: 200px"
        />
        <!-- Date 类型 -->
        <a-range-picker
          v-else-if="filter.type === 'date'"
          v-model:value="formState[filter.field]"
          style="width: 260px"
        />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  filters: {
    type: Array,
    default: () => []
  },
  defaultValues: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['search', 'reset'])

const buildInitialState = () => {
  const state = {}
  props.filters.forEach(filter => {
    if (props.defaultValues[filter.field] !== undefined) {
      state[filter.field] = props.defaultValues[filter.field]
    } else if (filter.type === 'range') {
      state[filter.field] = [filter.min || 0, filter.max || 100]
    } else {
      state[filter.field] = undefined
    }
  })
  return state
}

const formState = reactive(buildInitialState())

watch(() => props.defaultValues, (newVal) => {
  Object.keys(newVal).forEach(key => {
    formState[key] = newVal[key]
  })
}, { deep: true })

const handleSearch = () => {
  const params = { ...formState }
  emit('search', params)
}

const handleReset = () => {
  const initial = buildInitialState()
  Object.keys(formState).forEach(key => {
    if (initial[key] !== undefined) {
      formState[key] = initial[key]
    } else {
      formState[key] = undefined
    }
  })
  emit('reset')
}
</script>

<style scoped lang="less">
.search-filter {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
