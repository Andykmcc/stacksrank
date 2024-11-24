<template>
  <div class="flex items-center my-2">
    <ULink to="/">
      <NuxtImg 
        src="pwa-512x512.png" 
        alt="Stacks Rank logo"
        loading="lazy"
        height="50"
        width="50"
        densities="x1 x2"
      />
    </ULink>
    
    <div class="flex flex-end items-baseline grow" v-if="currentUser.isRegistered">
      <UAvatar class="ml-auto self-center" icon="i-heroicons-photo" size="sm" />
      <p class="ml-2 h-5">Not <span class="h-5 italic">{{ currentUser?.firstName }} {{ currentUser?.lastName }}?</span></p>
      <UButton @click="useLogout" variant="link">Log out</UButton>
    </div>
    <div class="flex flex-end items-baseline grow" v-if="!currentUser.isRegistered && showButtons">
      <UButton class="ml-auto" to="/register">Create Account</UButton>
      <UButton class="ml-2" to="/login">Login</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const hideOnPages = ['register', 'login'];
const showButtons = ref(false);

const route = useRoute();
showButtons.value = hideOnPages.includes(route.name as string) ? false : true;

watch(route, (newRoute) => {
  showButtons.value = hideOnPages.includes(newRoute.name as string) ? false : true;
});

const currentUser = useUsersStore();
await currentUser.fetchStoredUser();
</script>
