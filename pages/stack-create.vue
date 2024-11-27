<template>
  <h1 class="text-2xl mb-4">Create Stack</h1>
  <UForm :schema="stackSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Stack Name" name="name" placeholder="To Read...">
      <UInput v-model="state.name" required autocomplete="off"/>
    </UFormGroup>

    <UFormGroup label="Set as default stack" name="default">
      <UToggle v-model="state.isDefault" />
    </UFormGroup>

    <UButton type="submit" value="Create">
      Create
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { db, type Stack, stackSchema } from '../db';
import { toRaw } from 'vue';

const currentUser = useUsersStore();
const currentStacks = useStacksStore();

const state = reactive({
  id: self.crypto.randomUUID(),
  user_id: currentUser.id,
  name: '',
  isDefault: false,
  items: [],
});

async function onSubmit(event: FormSubmitEvent<Stack>) {
  try {
    await currentStacks.create(event.data.name, currentUser.id, event.data.isDefault);
    await navigateTo('/');
  } catch (error) {
    console.error(error);
  }
}
</script>