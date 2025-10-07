<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postService } from '@/services/post.service'
import type { PostRequest } from '@/interfaces/post.interface'
import { toast } from 'vue-sonner'
import VPostForm from '@/components/post/VPostForm.vue'
import { profileService } from '@/services/profile.service'
import type { UserProfile } from '@/interfaces/profile.interface'

const route = useRoute()
const router = useRouter()
const postId = route.params.id as string

const loading = ref<boolean>(true)
const profiles = ref<UserProfile[]>([])
const loadingProfiles = ref<boolean>(false)
const postModel = reactive<PostRequest>({
  userId: '',
  imageUrl: '',
  caption: ''
})

const load = async () => {
  loading.value = true
  loadingProfiles.value = true
  const [existingPost, allProfiles] = await Promise.all([
    postService.getPost(postId),
    profileService.getAllProfiles()
  ])
  profiles.value = allProfiles
  loadingProfiles.value = false
  if (!existingPost) {
    toast.error('Post tidak ditemukan.')
    router.replace('/posts')
    return
  }
  postModel.userId = existingPost.userId
  postModel.imageUrl = existingPost.imageUrl
  postModel.caption = existingPost.caption
  loading.value = false
}

// Fungsi untuk update post yang akan di-pass ke VPostForm
const updatePost = async (data: PostRequest) => {
  const updated = await postService.updatePost(postId, data)
  if (updated) {
    toast.success('Post berhasil di-update!')
    router.push('/posts')
  } else {
    toast.error('Gagal meng-update post.')
  }
}

onMounted(() => load())
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4">
    <div v-if="loading" class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 flex justify-center text-gray-500">
      Memuat data post...
    </div>
    <div v-else class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4">
      <h1 class="text-pink-600 font-bold text-xl">Edit Post</h1>
      <div v-if="loadingProfiles" class="text-sm text-gray-500">Memuat daftar user profile...</div>
      <VPostForm v-else :postModel="postModel" :action="updatePost" :profiles="profiles" />
    </div>
  </main>
</template>
