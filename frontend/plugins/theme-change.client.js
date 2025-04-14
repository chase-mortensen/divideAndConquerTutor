import { themeChange } from 'theme-change'

export default defineNuxtPlugin(nuxtApp => {
  // Only run on client-side and only in production mode
  if (process.client) {
    nuxtApp.hook('app:mounted', () => {
      themeChange(false)
    })
  }
})