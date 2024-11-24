<template>
  <h1 class="text-2xl mb-4">Create Stack</h1>
  <UForm :schema="stackSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Stack Name" name="name" placeholder="To Read...">
      <UInput v-model="state.name" required autocomplete="off"/>
    </UFormGroup>

    <UFormGroup label="Set as default stack" name="default">
      <UToggle v-model="state.default" />
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

const state = reactive({
  id: self.crypto.randomUUID(),
  user_id: currentUser.id,
  name: '',
  default: false,
  items: [],
});

async function onSubmit(event: FormSubmitEvent<Stack>) {
  try {
    await db.stacks.add(toRaw(event.data));
    if (state.default) {
      currentUser.$patch({
        defaultStackId: event.data.id,
      });
    }
    await navigateTo('/');
  } catch (error) {
    console.error(error);
  }
}
</script>