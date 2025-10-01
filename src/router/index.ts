import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Profile Views
import ProfileView from '../views/profile/ProfileView.vue'
import DetailProfileView from '../views/profile/DetailProfileView.vue'
import CreateProfileView from '../views/profile/CreateProfileView.vue'
import EditProfileView from '../views/profile/EditProfileView.vue'

// Post Views
import PostView from '../views/post/PostView.vue'
import CreatePostView from '../views/post/CreatePostView.vue' // <-- Tambahkan ini jika belum ada
import DetailPostView from '../views/post/DetailPostView.vue'
import EditPostView from '../views/post/EditPostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // General Route
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    
    // Profile Routes
    {
      path: '/profiles',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/profiles/add', // <-- Spesifik sebelum dinamis
      name: 'create-profile',
      component: CreateProfileView,
    },
    {
      path: '/profiles/:id/edit', // <-- Spesifik sebelum dinamis
      name: 'edit-profile',
      component: EditProfileView,
    },
    {
      path: '/profiles/:id', // <-- Dinamis diletakkan paling akhir
      name: 'detail-profile',
      component: DetailProfileView,
    },

    // Post Routes
    {
      path: '/posts',
      name: 'posts',
      component: PostView,
    },
    {
      path: '/posts/create', // <-- Tambahkan rute untuk membuat post
      name: 'create-post',
      component: CreatePostView,
    },
    {
      path: '/posts/:id/edit', // <-- Spesifik sebelum dinamis
      name: 'edit-post',
      component: EditPostView,
    },
    {
      path: '/posts/:id', // <-- Dinamis diletakkan paling akhir
      name: 'detail-post',
      component: DetailPostView,
    },
  ],
})

export default router