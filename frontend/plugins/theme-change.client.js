import { themeChange } from 'theme-change'

export default defineNuxtPlugin(nuxtApp => {
  if (process.client) {
    // Initialize after app is mounted
    nuxtApp.hook('app:mounted', () => {
      // Initialize theme change
      themeChange(false)
      console.log('Theme change initialized')
      
      // Set default theme if none exists
      if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'lofi')
      }
      
      // Apply theme from localStorage
      const currentTheme = localStorage.getItem('theme') || 'lofi'
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', currentTheme)
        console.log('Theme set to:', currentTheme)
      }, 100)
    })
  }
})