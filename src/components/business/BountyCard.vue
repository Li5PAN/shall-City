<template>
  <div class="bounty-card" @click="handleClick">
    <div class="bounty-card__header">
      <h3 class="bounty-card__title">{{ bounty.title }}</h3>
      <StatusTag :status="bounty.status" type="bounty" />
    </div>
    <p class="bounty-card__desc">{{ bounty.description }}</p>
    <div class="bounty-card__skills">
      <a-tag v-for="skill in displaySkills" :key="skill" color="blue" size="small">{{ skill }}</a-tag>
    </div>
    <div class="bounty-card__meta">
      <div class="bounty-card__budget">
        <span class="bounty-card__budget-label">预算：</span>
        <span class="bounty-card__budget-value">
          ¥{{ bounty.budget }}
          <span v-if="bounty.budgetType">({{ bounty.budgetType }})</span>
        </span>
      </div>
      <div class="bounty-card__info">
        <span v-if="bounty.deadline" class="bounty-card__deadline">
          <ClockCircleOutlined /> 截止：{{ formatTime(bounty.deadline) }}
        </span>
        <span class="bounty-card__responses">
          <TeamOutlined /> {{ bounty.responseCount || 0 }}人响应
        </span>
      </div>
    </div>
    <div v-if="bounty.category" class="bounty-card__category">
      <a-tag>{{ bounty.category }}</a-tag>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { ClockCircleOutlined, TeamOutlined } from '@ant-design/icons-vue'
import StatusTag from './StatusTag.vue'

const props = defineProps({
  bounty: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const displaySkills = computed(() => {
  return (props.bounty.skills || []).slice(0, 5)
})

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD') : ''
}

const handleClick = () => {
  emit('click', props.bounty.id)
}
</script>

<style scoped lang="less">
.bounty-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  border: 1px solid #f0f0f0;
  margin-bottom: 12px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin: 0;
    flex: 1;
    margin-right: 8px;
  }

  &__desc {
    font-size: 13px;
    color: #666;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__skills {
    margin-bottom: 12px;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__budget-label {
    font-size: 13px;
    color: #666;
  }

  &__budget-value {
    font-size: 16px;
    font-weight: 600;
    color: #ff4d4f;
  }

  &__info {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #999;
  }

  &__deadline,
  &__responses {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__category {
    margin-top: 8px;
  }
}
</style>
