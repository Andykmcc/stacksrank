<template>
  <ul>
    <li v-for="user in users">
      <UCard class="mb-4">
        <template #header>
          <h2>{{ user.firstName }} {{ user.lastName }}</h2>
        </template>
<!-- 
        <ul>
          <li v-for="stack in stacks">{{ stack.name }} - {{ stack.items.length }} items</li>
        </ul> -->

        <template #footer>
          <UButton @click="onClick(user)">Login as {{ user.firstName }} {{ user.lastName }}</UButton>
        </template>
      </UCard>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { db, type User, type Stack } from '../db';
const currentUser = useUsersStore();

const users = ref(<User[]>[]);
users.value = await db.users.toArray();

async function onClick(user:User) {
  currentUser.login(user);
  await navigateTo('/');
}
</script>