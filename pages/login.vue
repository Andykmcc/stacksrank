<template>
  <ul>
    <li v-for="user in users">
      <UCard class="mb-4">
        <template #header>
          <h2>{{ user.firstName }} {{ user.lastName }}</h2>
        </template>
        <StackPreview :stack-id="user.defaultStackId" />
        <template #footer>
          <div class="flex">
            <UButton class="ml-auto" @click="onClick(user)">Login as {{ user.firstName }} {{ user.lastName }}</UButton>
          </div>
          
        </template>
      </UCard>
    </li>
    <li v-if="!users.length">
      <p>No users yet.</p>
      <UButton to="/register">Create Account</UButton>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { db, type User } from '../db';

const currentUser = useUsersStore();

const users = ref(<User[]>[]);
users.value = await db.users.where('id').notEqual(currentUser.unregisteredId).toArray();

async function onClick(user:User) {
  currentUser.login(user);
  await navigateTo('/');
}
</script>