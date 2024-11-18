<template>
  <span class="h-4 inline-block" v-if="currentUser">Account: {{ currentUser.id }}</span>
  <div v-else>
    <USkeleton class="h-4 w-[75px] mr-4 inline-block" />
    <USkeleton class="h-4 w-[75px] mr-4 inline-block" />
  </div>
</template>

<script lang="ts" setup>
const currentUser = useUsersStore();
</script>
