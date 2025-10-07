<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { postService } from '@/services/post.service'
import { profileService } from '@/services/profile.service'
import type { Post } from '@/interfaces/post.interface'
import type { UserProfile } from '@/interfaces/profile.interface'
import VPostCard from '@/components/post/VPostCard.vue'
import VButton from '@/components/common/VButton.vue'
import VPostFilter from '@/components/post/VPostFilter.vue'
import { toast } from 'vue-sonner'

const allPosts = ref<Post[]>([])
const uniqueUsers = ref<string[]>([])
const profiles = ref<UserProfile[]>([])
const loadingProfiles = ref<boolean>(false)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const activeFilters = ref({
  user: 'all',
  sort: 'newest'
})

const filteredAndSortedPosts = computed(() => {
  let postsToDisplay = [...allPosts.value]
  if (activeFilters.value.user !== 'all') {
    postsToDisplay = postsToDisplay.filter(post => post.userId === activeFilters.value.user)
  }
  postsToDisplay.sort((a, b) => {
    const dateA = a.createdAt.getTime()
    const dateB = b.createdAt.getTime()
    return activeFilters.value.sort === 'newest' ? dateB - dateA : dateA - dateB
  })
  return postsToDisplay
})

const handleFilterChange = (filters: { user: string, sort: string }) => {
  activeFilters.value = filters
}

// Fungsi untuk menghapus post dari daftar lokal setelah event diterima
const handlePostDeleted = (deletedPostId: string) => {
  allPosts.value = allPosts.value.filter(post => post.id !== deletedPostId)
}

const fetchPosts = async () => {
  loading.value = true
  error.value = null
  try {
    const fetched = await postService.getAllPosts()
    allPosts.value = fetched
    const userIds = fetched.map(p => p.userId)
    uniqueUsers.value = [...new Set(userIds)]
  } catch {
    error.value = 'Gagal memuat posts dari server.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const fetchProfiles = async () => {
  loadingProfiles.value = true
  try {
    profiles.value = await profileService.getAllProfiles()
  } catch {
    // silent fail; dropdowns just won't appear
  } finally {
    loadingProfiles.value = false
  }
}

onMounted(() => {
  fetchPosts()
  fetchProfiles()
})
</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Semua Post</h1>
        <RouterLink to="/posts/create">
          <VButton class="bg-pink-600 hover:bg-pink-800 text-white">
            Buat Post Baru
          </VButton>
        </RouterLink>
      </div>

      <VPostFilter :users="uniqueUsers" @filter-change="handleFilterChange" />

      <div v-if="loading" class="text-center text-gray-500 mt-10 bg-white p-10 rounded-lg shadow">
        Memuat data post...
      </div>
      <div v-else-if="error" class="text-center text-red-500 mt-10 bg-white p-10 rounded-lg shadow">
        {{ error }}
      </div>
      <div v-else-if="filteredAndSortedPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VPostCard
          v-for="post in filteredAndSortedPosts"
          :key="post.id"
          :post="post"
          :profiles="profiles"
          :loading-profiles="loadingProfiles"
          @post-deleted="handlePostDeleted" />
      </div>
      <div v-else class="text-center text-gray-500 mt-10 bg-white p-10 rounded-lg shadow">
        <p class="text-xl font-semibold">
          {{ allPosts.length === 0 ? 'Belum ada post.' : 'Tidak ada post yang cocok.' }}
        </p>
        <p v-if="allPosts.length === 0">Jadilah yang pertama membuat post!</p>
        <p v-else>Coba ubah filter Anda atau buat post baru!</p>
      </div>
    </div>
  </main>
</template>
