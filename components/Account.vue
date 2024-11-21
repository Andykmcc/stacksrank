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
    
    <div class="flex flex-end items-baseline grow" v-if="currentUser.registered">
      <UAvatar class="ml-auto self-center" icon="i-heroicons-photo" size="sm" />
      <p class="ml-2 h-5">Not <span class="h-5 italic">{{ currentUser?.firstName }} {{ currentUser?.lastName }}?</span></p>
      <UButton @click="logout" variant="link">Log out</UButton>
    </div>
    <div class="flex flex-end items-baseline grow" v-else>
      <UButton class="ml-auto" to="/register">Create Account</UButton>
      <UButton class="ml-2" to="/login">Login</UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
const currentUser = useUsersStore();

if (currentUser.registered) {
  await currentUser.updateFromStore();
}
function logout() {
  useLogout();
}
</script>
