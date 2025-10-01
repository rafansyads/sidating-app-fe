import { describe, it, expect } from 'vitest'
import router from '../../router/index'
import HomeView from '../../views/HomeView.vue'
import ProfileView from '../../views/profile/ProfileView.vue'
import PostView from '../../views/post/PostView.vue'

describe('Router', () => {
  it('should have correct route configuration (profiles & posts)', () => {
    const routes = router.getRoutes()
    expect(routes).toHaveLength(9)

    // Helper to get component from route (Vue Router stores it on components.default)
    const getComponent = (path: string) => routes.find((r) => r.path === path)?.components?.default

    // Home
    expect(getComponent('/')).toBe(HomeView)
    expect(routes.find((r) => r.path === '/')?.name).toBe('home')

    // Profiles core routes
    expect(getComponent('/profiles')).toBe(ProfileView)
    expect(routes.find((r) => r.path === '/profiles')?.name).toBe('profile')
    expect(routes.find((r) => r.path === '/profiles/add')?.name).toBe('create-profile')
    expect(routes.find((r) => r.path === '/profiles/:id/edit')?.name).toBe('edit-profile')
    expect(routes.find((r) => r.path === '/profiles/:id')?.name).toBe('detail-profile')

    // Posts routes
    expect(getComponent('/posts')).toBe(PostView)
    expect(routes.find((r) => r.path === '/posts')?.name).toBe('posts')
    expect(routes.find((r) => r.path === '/posts/create')?.name).toBe('create-post')
    expect(routes.find((r) => r.path === '/posts/:id/edit')?.name).toBe('edit-post')
    expect(routes.find((r) => r.path === '/posts/:id')?.name).toBe('detail-post')
  })

  it('should navigate to home route', async () => {
    router.push('/')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('should navigate to profiles route', async () => {
    await router.push('/profiles')
    await router.isReady()

    expect(router.currentRoute.value.path).toBe('/profiles')
    expect(router.currentRoute.value.name).toBe('profile')
  })

  it('should use web history mode', () => {
    expect(router.options.history).toBeDefined()
  })

  it('should use correct base URL from environment', () => {
    // This depends on the test environment setup
    expect(router.options.history.base).toBe('')
  })

  it('should handle route navigation programmatically', async () => {
    // Start at home
    await router.push('/')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('home')

    // Navigate to profiles
    await router.push('/profiles')
    expect(router.currentRoute.value.name).toBe('profile')

    // Navigate back to home
    await router.push({ name: 'home' })
    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('should handle route navigation by name', async () => {
    await router.push({ name: 'profile' })
    expect(router.currentRoute.value.name).toBe('profile')
    expect(router.currentRoute.value.path).toBe('/profiles')
  })

  it('should maintain route state during navigation', async () => {
    await router.push('/')
    const homeRoute = router.currentRoute.value

    await router.push('/profiles')
    const profilesRoute = router.currentRoute.value

    expect(homeRoute.path).not.toBe(profilesRoute.path)
    expect(homeRoute.name).not.toBe(profilesRoute.name)
  })
})
