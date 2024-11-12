<template>
  <ClientOnly>
    <span class="h-4 inline-block" v-if="currentUser">Account current user id: {{ currentUser.id }}</span>
    <div v-else>
      <USkeleton class="h-4 w-[75px] mr-4 inline-block" />
      <USkeleton class="h-4 w-[75px] mr-4 inline-block" />
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { type User } from "../db";

const {data: currentUser} = await useUser();

</script>
