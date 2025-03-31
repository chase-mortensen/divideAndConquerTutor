<template>
  <div class="mb-6">
    <ul class="steps steps-vertical md:steps-horizontal w-full">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :class="{ 'step-primary': currentStep >= index }"
      >
        {{ step.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
});
</script>