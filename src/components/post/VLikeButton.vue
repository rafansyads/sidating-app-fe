<script setup lang="ts">
import { ref, computed } from 'vue';
import { postService } from '@/services/post.service';

const props = defineProps<{
  postId: string;
  initialLikes: string[];
  currentUserId?: string; // optional prop to inject logged-in user profile id
}>();

// State lokal untuk update UI secara instan
const likes = ref([...props.initialLikes]);

// Gunakan prop atau fallback demo user id
const currentUserId = props.currentUserId || 'currentUser';

const isLiked = computed(() => likes.value.includes(currentUserId));

// src/components/post/VLikeButton.vue

const toggleLike = async () => {
  const updated = await postService.likePost(props.postId, currentUserId)
  if (updated) {
    // authoritative refresh from backend
    likes.value = [...updated.likes]
  }
}
</script>

<template>
  <button
    @click="toggleLike"
    class="flex items-center gap-2 text-gray-600 transition-colors duration-200"
    :class="{ 'text-red-500': isLiked }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      :fill="isLiked ? 'currentColor' : 'none'"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
      />
    </svg>
    <span class="font-medium">{{ likes.length }}</span>
  </button>
</template>
