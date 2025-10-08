<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ options: Array<{ label: string; value: string }>; modelValue: string }>()
const emit = defineEmits(['update:modelValue'])
const selected = ref(props.modelValue)
const handleChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>
<template>
  <select :value="selected" @change="handleChange" class="border rounded px-2 py-1">
    <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
  </select>
</template>
