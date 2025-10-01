<script setup lang="ts">
import type { Post } from '@/interfaces/post.interface';
import { format } from 'date-fns';
import { id as indonesia } from 'date-fns/locale';
import VDeletePostButton from './VDeletePostButton.vue';
import VLikeButton from './VLikeButton.vue';

defineProps<{
  post: Post;
}>();

const emit = defineEmits(['post-deleted']);

// Fungsi untuk meneruskan event dari VDeletePostButton ke parent (PostView)
const handlePostDeleted = (postId: string) => {
  emit('post-deleted', postId);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
    <RouterLink :to="`/posts/${post.id}`" class="block">
      <img :src="post.imageUrl" :alt="post.caption" class="w-full h-56 object-cover">
    </RouterLink>
    <div class="p-4 flex flex-col flex-grow">
      <p class="text-gray-700 mb-4 flex-grow">{{ post.caption }}</p>
      <div class="text-xs text-gray-500 mb-3">
        <p>by {{ post.userId }}</p>
        <p>{{ format(post.createdAt, 'dd MMMM yyyy', { locale: indonesia }) }}</p>
      </div>
      <div class="border-t pt-3 flex items-center justify-between">
        <VLikeButton :post-id="post.id" :initial-likes="post.likes" />
        <div class="flex items-center gap-3">
          <RouterLink :to="`/posts/${post.id}/edit`" class="text-blue-600 hover:underline text-sm">Edit</RouterLink>
          <VDeletePostButton :post-id="post.id" @deleted="handlePostDeleted" />
        </div>
      </div>
    </div>
  </div>
</template>