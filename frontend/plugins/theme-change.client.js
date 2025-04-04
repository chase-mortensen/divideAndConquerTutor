import { themeChange } from 'theme-change'

export default defineNuxtPlugin(() => {
  // Wait for page to be fully loaded to avoid hydration issues
  if (process.client) {
    window.addEventListener('load', () => {
      themeChange(false)
    })
  }
})