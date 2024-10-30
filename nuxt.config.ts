// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vite-pwa/nuxt"],
  compatibilityDate: "2024-10-25",
  imports: {
    autoImport: true,
  },
  pwa:{
    strategies: 'generateSW',
    registerType: 'prompt',
    manifest:{
      name:'Stacks Rank',
      short_name:'Stacks Rank',
      description:'Rank your books',
      display: "standalone",
      theme_color: "#000000",
      background_color: "#ffffff",
      lang:'en',
      orientation:'portrait',
      icons: [
        {
          "src": "pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: {
      enabled: false
    },
    client: {
      installPrompt: true,
    },
  },
})