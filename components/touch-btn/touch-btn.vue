<template>
  <view 
    class="touch-btn" 
    :class="{ disabled: disabled, active: isActive }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @click="onClick"
  >
    <slot></slot>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const isActive = ref(false)

function onTouchStart() {
  if (!props.disabled) {
    isActive.value = true
  }
}

function onTouchEnd() {
  isActive.value = false
}

function onClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
.touch-btn {
  min-width: 88rpx;
  min-height: 88rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.touch-btn:active,
.touch-btn.active {
  transform: scale(0.95);
  opacity: 0.8;
}

.touch-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
