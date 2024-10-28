// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

const sw = process.env.SW === 'true'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vite-pwa/nuxt"],
  compatibilityDate: "2024-10-25",
  imports: {
    autoImport: true,
  },
  pwa:{
    strategies: sw ? 'injectManifest' : 'generateSW',
    srcDir: sw ? 'service-worker' : undefined,
    filename: sw ? 'sw.ts' : undefined,
    registerType: 'autoUpdate',
    manifest:{
      name:'Stacks Rank',
      short_name:'Stacks Rank',
      description:'Rank your books',
      lang:'en',
      orientation:'portrait',
      icons:[
        {
          src:'android-launchericon-48-48.png',
          sizes:'48x48',
          type:'image/png',
        },
        {
          src:'android-launchericon-72-72.png',
          sizes:'72x72',
          type:'image/png',
        },
        {
          src:'android-launchericon-96-96.png',
          sizes:'96x96',
          type:'image/png',
        },
        {
          src:'android-launchericon-144-144.png',
          sizes:'144x144',
          type:'image/png',
        },
        {
          src:'android-launchericon-192-192.png',
          sizes:'192x192',
          type:'image/png',
        },
        {
          src:'android-launchericon-512-512.png',
          sizes:'512x512',
          type:'image/png',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
  },
})