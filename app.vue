<template>
  <NuxtPwaManifest />
  <NuxtLoadingIndicator />
  <UContainer>
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h1>Welcome to Nuxt UI Starter</h1>
          <ColorScheme><USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" /></ColorScheme>
        </div>
      </template>
      <ClientOnly>
        <p>PWA Installed: {{ $pwa?.isPWAInstalled }}</p>
      </ClientOnly>
      <UButton icon="i-heroicons-book-open" to="https://ui.nuxt.com" target="_blank">Open Nuxt UI Documentation</UButton>
    </UCard>
  </UContainer>
</template>
