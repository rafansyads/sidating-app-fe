<script setup lang="ts">
import { ref, watch } from 'vue';

// Komponen ini akan menerima daftar user unik sebagai props dari parent (PostView)
const props = defineProps<{
  users: string[];
  profiles?: { id: string; name?: string }[];
}>();

const emit = defineEmits(['filter-change']);

const selectedUser = ref('all'); // Nilai default: tampilkan semua user
const sortBy = ref('newest'); // Nilai default: urutkan dari yang terbaru

// Setiap kali salah satu filter berubah, kirimkan nilainya ke parent
watch([selectedUser, sortBy], ([user, sort]) => {
  emit('filter-change', { user, sort });
});
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
    <div class="flex-1">
      <label for="user-filter" class="block text-sm font-medium text-gray-700">Filter by User</label>
      <select
        id="user-filter"
        v-model="selectedUser"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
      >
        <option value="all">Semua User</option>
        <option v-for="user in users" :key="user" :value="user">
          {{ props.profiles?.find(p => p.id === user)?.name || user }}
        </option>
      </select>
    </div>

    <div class="flex-1">
      <label for="sort-by" class="block text-sm font-medium text-gray-700">Sort by</label>
      <select
        id="sort-by"
        v-model="sortBy"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
    </div>
  </div>
</template>
