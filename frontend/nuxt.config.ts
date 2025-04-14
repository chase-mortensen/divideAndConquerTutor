// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: [
    '~/assets/css/main.css',
  ],

  app: {
    head: {
      title: 'Divide-and-Conquer Tutor',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'An educational web application designed to help computer science students learn and practice divide-and-conquer problem-solving techniques.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      htmlAttrs: {
        'data-theme': 'nord'
      }
    }
  },

  compatibilityDate: '2025-03-27'
})