<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postService } from '@/services/post.service'
import type { Post } from '@/interfaces/post.interface'
import { toast } from 'vue-sonner'
import { format } from 'date-fns'
import { id as indonesia } from 'date-fns/locale'
import VButton from '@/components/common/VButton.vue'
import VLikeButton from '@/components/post/VLikeButton.vue'
import VDeletePostButton from '@/components/post/VDeletePostButton.vue'

const route = useRoute()
const router = useRouter()
const postId = route.params.id as string

const post = ref<Post | undefined>(undefined)
const loading = ref<boolean>(false)

const fetchPost = async () => {
  loading.value = true
  try {
    const p = await postService.getPost(postId)
    if (!p) {
      toast.error('Post tidak ditemukan.')
      router.replace('/posts')
    } else {
      post.value = p
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchPost())

// Jika post dihapus dari halaman ini, kembali ke daftar post
const onPostDeleted = () => {
  router.replace('/posts')
}
</script>

<template>
  <main v-if="loading" class="w-full min-h-screen bg-gray-100 pt-24 flex items-center justify-center">
    <div class="text-gray-500">Memuat detail post...</div>
  </main>
  <main v-else-if="post" class="w-full min-h-screen bg-gray-100 pt-24 py-10 px-4">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <img :src="post.imageUrl" :alt="post.caption" class="w-full rounded-t-lg">
      <div class="p-6">
        <p class="text-gray-800 text-lg mb-4">{{ post.caption }}</p>
        <div class="border-t pt-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            <p class="font-semibold">Posted by: {{ post.userProfileName || post.userId }}</p>
            <p>{{ format(post.createdAt, 'EEEE, dd MMMM yyyy', { locale: indonesia }) }}</p>
          </div>
          <VLikeButton :post-id="post.id" :initial-likes="post.likes" />
        </div>
        <div class="mt-8 flex gap-4 border-t pt-6">
          <VButton @click="router.back()" class="bg-slate-500 hover:bg-slate-700 text-white">
            Kembali
          </VButton>
          <RouterLink :to="`/posts/${post.id}/edit`">
            <VButton class="bg-blue-600 hover:bg-blue-800 text-white">
              Edit
            </VButton>
          </RouterLink>
          <VDeletePostButton :post-id="post.id" @deleted="onPostDeleted" />
        </div>
      </div>
    </div>
  </main>
  <main v-else class="w-full min-h-screen bg-gray-100 pt-24 flex items-center justify-center">
    <div class="text-gray-500">Post tidak ditemukan.</div>
  </main>
</template>
