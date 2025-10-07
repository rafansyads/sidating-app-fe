<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { postService } from '@/services/post.service';
import type { PostRequest } from '@/interfaces/post.interface';
import { toast } from 'vue-sonner';
import VPostForm from '@/components/post/VPostForm.vue';
import { profileService } from '@/services/profile.service';
import type { UserProfile } from '@/interfaces/profile.interface';

const router = useRouter();

// Siapkan model reaktif dengan nilai awal kosong
const postModel = reactive<PostRequest>({
  userId: '',
  imageUrl: '',
  caption: ''
});

const profiles = ref<UserProfile[]>([])
const loadingProfiles = ref<boolean>(false)

const loadProfiles = async () => {
  loadingProfiles.value = true
  profiles.value = await profileService.getAllProfiles()
  loadingProfiles.value = false
}

onMounted(() => loadProfiles())

// Fungsi yang akan dijalankan saat form disubmit
const createPost = async (data: PostRequest) => {
  const newPost = await postService.createPost(data);
  if (newPost) {
    toast.success('Post berhasil dibuat!');
    router.push('/posts'); // Redirect ke halaman daftar post
  } else {
    toast.error('Gagal membuat post.');
  }
};
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4">
    <div class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4">
      <h1 class="text-pink-600 font-bold text-xl">Buat Post Baru</h1>
      <div v-if="loadingProfiles" class="text-sm text-gray-500">Memuat daftar user profile...</div>
      <VPostForm v-else :postModel="postModel" :action="createPost" :profiles="profiles" />
    </div>
  </main>
</template>
