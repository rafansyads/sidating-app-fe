<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { postService } from '@/services/post.service';
import type { PostRequest } from '@/interfaces/post.interface';
import { toast } from 'vue-sonner';
import VPostForm from '@/components/post/VPostForm.vue';

const route = useRoute();
const router = useRouter();
const postId = route.params.id as string;

// Ambil data post yang ada untuk mengisi form
const existingPost = postService.getPost(postId);

if (!existingPost) {
  toast.error('Post tidak ditemukan.');
  router.replace('/posts');
}

// Pre-populate form dengan data yang sudah ada
const postModel = reactive<PostRequest>({
  userId: existingPost?.userId || '',
  imageUrl: existingPost?.imageUrl || '',
  caption: existingPost?.caption || ''
});

// Fungsi untuk update post yang akan di-pass ke VPostForm
const updatePost = async (data: PostRequest) => {
  const updated = postService.updatePost(postId, data);
  if (updated) {
    toast.success('Post berhasil di-update!');
    router.push('/posts');
  } else {
    toast.error('Gagal meng-update post.');
  }
};
</script>

<template>
  <main class="w-full min-h-screen bg-pink-500/20 pt-24 py-10 px-4">
    <div class="mx-auto w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col gap-4">
      <h1 class="text-pink-600 font-bold text-xl">Edit Post</h1>
      <VPostForm :postModel="postModel" :action="updatePost" />
    </div>
  </main>
</template>