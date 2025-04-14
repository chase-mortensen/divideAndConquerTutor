import { themeChange } from 'theme-change'

export default defineNuxtPlugin(nuxtApp => {
  if (process.client) {
    nuxtApp.hook('app:mounted', () => {
      themeChange(false) // false = no auto-detect dark mode
      
      // Set default theme if none is selected
      if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'lofi')
      }
      
      // Apply theme from localStorage
      const currentTheme = localStorage.getItem('theme') || 'lofi'
      document.documentElement.setAttribute('data-theme', currentTheme)
      
      // Manual theme toggle handler for more reliability
      const themeToggle = document.getElementById('theme-toggle')
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const newTheme = currentTheme === 'lofi' ? 'forest' : 'lofi'
          localStorage.setItem('theme', newTheme)
          document.documentElement.setAttribute('data-theme', newTheme)
        })
      }
    })
  }
})