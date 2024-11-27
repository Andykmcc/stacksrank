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

    <div class="flex flex-end items-baseline grow" v-if="!currentUser.isRegistered">
      <UButton class="ml-auto" to="/register">Create Account</UButton>
      <UButton class="ml-2" to="/login">Login</UButton>
    </div>
    <UDropdown v-else class="ml-auto" :items="menuItems" :popper="{ placement: 'bottom-start' }">
      <template #account="{ item }">
        <div class="text-left">
          <p>
            Signed in as
          </p>
          <p class="truncate font-medium text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
        </div>
      </template>
      <UButton color="white" :ui="{ item: { disabled: 'cursor-text select-text' } }" trailing-icon="i-heroicons:bars-3-20-solid" />
    </UDropdown>
  </div>
</template>

<script lang="ts" setup>
const currentUser = useUsersStore();
const menuItems = ref([
  [{
    label: `${currentUser.firstName} ${currentUser.lastName}`,
    slot: 'account',
    disabled: true,
  }],
  [{
    label: 'Create Stack',
    icon: 'i-heroicons-book-open',
    click: () => navigateTo('/stack-create')
  }],
  [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: useLogout,
  }],
]);

currentUser.$subscribe((mutation, state) => {
  // update name in menu when user changes
  menuItems.value[0][0].label = `${state.firstName} ${state.lastName}`;
});

await currentUser.fetchStoredUser();
</script>
