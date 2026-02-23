<template>
  <div
    :class="['service-card', `service-card--${mode}`]"
    @click="handleClick"
  >
    <div class="service-card__cover">
      <img
        :src="service.coverImage || defaultCover"
        :alt="service.title"
        class="service-card__image"
      />
      <div v-if="service.originalPrice && service.originalPrice > service.price" class="service-card__badge">
        优惠
      </div>
    </div>
    <div class="service-card__body">
      <h3 class="service-card__title">{{ service.title }}</h3>
      <p v-if="mode === 'list'" class="service-card__desc">{{ service.description }}</p>
      <div class="service-card__tags">
        <a-tag v-for="tag in displayTags" :key="tag" size="small">{{ tag }}</a-tag>
      </div>
      <div class="service-card__meta">
        <div class="service-card__price">
          <span class="service-card__price-current">¥{{ service.price }}</span>
          <span v-if="service.originalPrice && service.originalPrice > service.price" class="service-card__price-original">
            ¥{{ service.originalPrice }}
          </span>
        </div>
        <div class="service-card__rating">
          <a-rate :value="service.rating" disabled allow-half :style="{ fontSize: '12px' }" />
          <span class="service-card__reviews">{{ service.reviews || 0 }}评价</span>
        </div>
      </div>
      <div v-if="service.provider" class="service-card__provider">
        <span>{{ service.provider }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'grid',
    validator: (val) => ['grid', 'list'].includes(val)
  }
})

const emit = defineEmits(['click'])

const defaultCover = 'https://via.placeholder.com/300x200?text=Service'

const displayTags = computed(() => {
  return (props.service.tags || []).slice(0, 3)
})

const handleClick = () => {
  emit('click', props.service.id)
}
</script>

<style scoped lang="less">
.service-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s;
  border: 1px solid #f0f0f0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &--grid {
    .service-card__cover {
      position: relative;
      height: 180px;
      overflow: hidden;
    }

    .service-card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &--list {
    display: flex;

    .service-card__cover {
      position: relative;
      width: 200px;
      min-height: 140px;
      flex-shrink: 0;
    }

    .service-card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .service-card__body {
      flex: 1;
    }
  }

  &__badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #ff4d4f;
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  &__body {
    padding: 12px;
  }

  &__title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__desc {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    margin-bottom: 8px;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__price-current {
    font-size: 18px;
    font-weight: 600;
    color: #ff4d4f;
  }

  &__price-original {
    font-size: 12px;
    color: #999;
    text-decoration: line-through;
    margin-left: 4px;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__reviews {
    font-size: 12px;
    color: #999;
  }

  &__provider {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
}
</style>
