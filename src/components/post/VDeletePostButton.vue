<script setup lang="ts">
import { postService } from '@/services/post.service';
import { toast } from 'vue-sonner';
import VButton from '../common/VButton.vue';

const props = defineProps<{
  postId: string;
}>();

const emit = defineEmits(['deleted']);

const handleDelete = () => {
  // Minta konfirmasi sebelum menghapus
  if (confirm('Apakah Anda yakin ingin menghapus post ini?')) {
    const success = postService.deletePost(props.postId);
    if (success) {
      toast.success('Post berhasil dihapus.');
      // Kirim event ke parent bahwa post ini telah dihapus
      emit('deleted', props.postId); 
    } else {
      toast.error('Gagal menghapus post.');
    }
  }
};
</script>

<template>
  <VButton @click="handleDelete" class="bg-red-600 hover:bg-red-800 text-white">
    Hapus
  </VButton>
</template>