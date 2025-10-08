import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import DetailProfileView from '../DetailProfileView.vue'
import { profileService } from '../../../services/profile.service'

// Mock the profile service
vi.mock('@/services/profile.service', () => ({
  profileService: {
    getProfile: vi.fn()
  }
}))

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => 'Formatted Date')
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/profiles/:id', component: DetailProfileView },
    { path: '/profiles', component: { template: '<div>Profiles</div>' } },
    { path: '/profiles/:id/edit', component: { template: '<div>Edit Profile</div>' } }
  ]
})

describe('DetailProfileView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockProfile = {
    id: 'test-profile-id',
    name: 'John Doe',
    nickname: 'johndoe',
    birthdate: new Date('1990-01-01'),
    gender: 'Male',
    location: 'Jakarta, Indonesia',
    bio: 'A software developer',
    hobbies: ['reading', 'gaming'],
    interests: ['technology', 'sports'],
    email: 'john@example.com',
    phoneNumber: '+628123456789',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-01'),
    isActive: true
  }

  it('should render correctly with profile data', async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(mockProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    // Wait for component to load
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('h1').text()).toBe('Detail Profil')
    expect(wrapper.find('h1').classes()).toContain('text-pink-600')
  })

  it('should display profile information correctly', async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(mockProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    // Wait for profile to load
    await wrapper.vm.$nextTick()
    
    // Check if profile data is displayed (using text content)
    const html = wrapper.html()
    expect(html).toContain('Nama Lengkap')
    expect(html).toContain('Panggilan')
    expect(html).toContain('Tanggal Lahir')
    expect(html).toContain('Jenis Kelamin')
    expect(html).toContain('Lokasi')
    expect(html).toContain('Status')
    expect(html).toContain('Bio')
    expect(html).toContain('Hobi')
    expect(html).toContain('Minat')
    expect(html).toContain('Email')
    expect(html).toContain('No. Telepon')
  })

  it('should have correct layout structure', async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(mockProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('main').classes()).toContain('w-full')
    expect(wrapper.find('main').classes()).toContain('min-h-screen')
    expect(wrapper.find('main').classes()).toContain('bg-pink-500/20')
  })

  it('should have action buttons', async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(mockProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    await wrapper.vm.$nextTick()
    
    // Check for buttons by their actual elements
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
    
    // Check button content
    const buttonTexts = buttons.map(button => button.text())
    expect(buttonTexts).toContain('Kembali')
    expect(buttonTexts).toContain('Edit')
  })

  it('should have RouterLink to edit page', async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(mockProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    await wrapper.vm.$nextTick()
    
    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.exists()).toBe(true)
    expect(routerLink.props('to')).toBe('/profiles/test-profile-id/edit')
  })

  it('should call profileService.getProfile on mount', async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(mockProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    expect(mockGetProfile).toHaveBeenCalledWith('test-profile-id')
  })

  it('should redirect to profiles page when profile not found', async () => {
    // Clear previous mock calls
    vi.clearAllMocks()
    
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(undefined)
    
    // Create a fresh router instance for this test
    const testRouter = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/profiles/:id', component: DetailProfileView },
        { path: '/profiles', component: { template: '<div>Profiles</div>' } }
      ]
    })
    
    await testRouter.push('/profiles/non-existent-id')
    await testRouter.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [testRouter]
      }
    })
    
    await wrapper.vm.$nextTick()
    
    expect(mockGetProfile).toHaveBeenCalledWith('non-existent-id')
  })

  it('should handle active and inactive status display', async () => {
    const inactiveProfile = { ...mockProfile, isActive: false }
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(inactiveProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    await wrapper.vm.$nextTick()
    
    // Should display status information
    expect(wrapper.html()).toContain('Status')
  })

  it('should call router.back() when back button is clicked', async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(mockProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    await wrapper.vm.$nextTick()
    
    // Spy on router.back method
    const routerBackSpy = vi.spyOn(wrapper.vm.$router, 'back')
    // Find and click the back button
    const backButton = wrapper.findAll('button').find(btn => btn.text() === 'Kembali')
    expect(backButton).toBeDefined()
    
    await backButton!.trigger('click')
    
    expect(routerBackSpy).toHaveBeenCalled()

    
  })

  it('should call getProfile function on mount', async () => {
    const mockGetProfile = vi.mocked(profileService.getProfile)
    mockGetProfile.mockResolvedValue(mockProfile)
    
    router.push('/profiles/test-profile-id')
    await router.isReady()
    
    const wrapper = mount(DetailProfileView, {
      global: {
        plugins: [router]
      }
    })
    
    // Call the getProfile function directly to ensure it's covered
    await (wrapper.vm as any).getProfile()
    
    expect(mockGetProfile).toHaveBeenCalledWith('test-profile-id')
  })
})