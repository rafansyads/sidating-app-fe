<script setup lang="ts">
import { type PropType, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import type { PostRequest } from '@/interfaces/post.interface';
import type { UserProfile } from '@/interfaces/profile.interface';
import VInput from '@/components/common/VInput.vue';
import VTextArea from '@/components/common/VTextArea.vue';
import VButton from '@/components/common/VButton.vue';

const router = useRouter();

const props = defineProps({
  action: {
    type: Function as PropType<(data: PostRequest) => Promise<void>>,
    required: true
  },
  postModel: {
    type: Object as PropType<PostRequest>,
    required: true,
  },
  profiles: {
    type: Array as PropType<UserProfile[]>,
    required: false,
    default: () => []
  }
});

const model = toRefs(props).postModel;

const handleSubmit = async () => {
  await props.action(model.value);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 py-4">
    <div class="flex flex-col gap-2">
      <label for="userId" class="text-sm font-medium text-gray-700">Author (User Profile)</label>
      <select
        id="userId"
        name="userId"
        v-model="(model.userId as string)"
        class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <option disabled value="">-- Pilih User Profile --</option>
        <option
          v-for="p in profiles"
          :key="p.id"
          :value="p.id"
        >{{ p.name || p.id }}</option>
      </select>
    </div>
  <VInput v-model="(model.imageUrl as string)" :value="model.imageUrl ?? ''" id="imageUrl" name="imageUrl" label="Image URL" />
  <VTextArea v-model="(model.caption as string)" :value="model.caption ?? ''" id="caption" name="caption" label="Caption" />

    <div class="flex justify-end gap-2 pt-4">
      <VButton @click="router.back()" type="button" class="bg-slate-600 hover:bg-slate-800 text-white">
        Batal
      </VButton>
      <VButton type="submit" class="bg-pink-600 hover:bg-pink-800 text-white">
        Simpan
      </VButton>
    </div>
  </form>
</template>
