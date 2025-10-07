<script setup lang="ts">
import type { Post } from '@/interfaces/post.interface';
import type { UserProfile } from '@/interfaces/profile.interface';
import { format } from 'date-fns';
import { id as indonesia } from 'date-fns/locale';
import VDeletePostButton from './VDeletePostButton.vue';
import { postService } from '@/services/post.service';
import { ref, reactive } from 'vue';
import { toast } from 'vue-sonner';

const props = defineProps<{
  post: Post;
  profiles?: UserProfile[];
  loadingProfiles?: boolean;
}>();

const emit = defineEmits(['post-deleted']);

// Fungsi untuk meneruskan event dari VDeletePostButton ke parent (PostView)
const handlePostDeleted = (postId: string) => {
  emit('post-deleted', postId);
};

// Like handling with user selection
const selectedUserId = ref<string>('');
const isLiking = ref<boolean>(false);
const localState = reactive({
  likes: [...props.post.likes],
  likeCount: props.post.likeCount ?? props.post.likes.length
});

const canLike = () => selectedUserId.value !== '' && !isLiking.value;

const handleLike = async () => {
  if (!canLike()) return;
  isLiking.value = true;
  const updated = await postService.likePost(props.post.id, selectedUserId.value);
  if (updated) {
    localState.likes = [...updated.likes];
    localState.likeCount = updated.likeCount ?? updated.likes.length;
    const stillLiked = updated.likes.includes(selectedUserId.value);
    toast.success(stillLiked ? 'Like berhasil.' : 'Berhasil batal like.');
  } else {
    toast.error('Gagal memproses like.');
  }
  isLiking.value = false;
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
          <p>by {{ post.userProfileName || post.userId }}</p>
        <p>{{ format(post.createdAt, 'dd MMMM yyyy', { locale: indonesia }) }}</p>
      </div>
      <div class="border-t pt-3 flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Likes: {{ localState.likeCount }}</span>
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="selectedUserId"
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
            :disabled="loadingProfiles || isLiking"
          >
            <option value="">Pilih User</option>
            <option v-for="p in profiles" :key="p.id" :value="p.id">{{ p.name || p.id }}</option>
          </select>
          <button
            @click="handleLike"
            :disabled="!selectedUserId || isLiking"
            class="text-xs px-3 py-1 rounded-md text-white bg-pink-600 disabled:opacity-50 hover:bg-pink-700 transition"
          >
            {{ isLiking ? '...' : 'Like' }}
          </button>
          <div class="ml-auto flex items-center gap-3">
            <RouterLink :to="`/posts/${post.id}/edit`" class="text-blue-600 hover:underline text-sm">Edit</RouterLink>
            <VDeletePostButton :post-id="post.id" @deleted="handlePostDeleted" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
