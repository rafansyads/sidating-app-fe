import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TheWelcome from '../TheWelcome.vue'

describe('TheWelcome', () => {
  it('renders the main title and subtitle', () => {
    const wrapper = mount(TheWelcome)
    expect(wrapper.find('h1').text()).toContain('Sidating App')
    expect(wrapper.find('h1').text()).toContain('Vue')
    expect(wrapper.find('h1').classes()).toContain('text-pink-400')
    expect(wrapper.find('span').classes()).toContain('text-green-700')
  })

  it('has correct layout classes', () => {
    const wrapper = mount(TheWelcome)
    expect(wrapper.classes()).toContain('flex')
    expect(wrapper.classes()).toContain('flex-col')
    expect(wrapper.classes()).toContain('items-center')
    expect(wrapper.classes()).toContain('justify-center')
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.classes()).toContain('h-screen')
  })

  it('calls openReadmeInEditor when invoked', async () => {
    const wrapper = mount(TheWelcome)
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({})
    // @ts-ignore
    await wrapper.vm.openReadmeInEditor()
    expect(global.fetch).toHaveBeenCalledWith('/__open-in-editor?file=README.md')
  })
})
