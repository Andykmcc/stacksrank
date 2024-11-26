<template>
  <UForm :schema="userSchema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="First Name" name="firstName">
      <UInput v-model="state.firstName" required autocomplete="off"/>
    </UFormGroup>

    <UFormGroup label="Last Name" name="lastName">
      <UInput v-model="state.lastName" required autocomplete="off"/>
    </UFormGroup>
    
    <UFormGroup label="Save" name="save" description="Select this to prevent your device from ereasing your stacks.">
      <UToggle v-model="persistRef" :disabled="persistRef"/>
    </UFormGroup>

    <UButton type="submit" value="Create">
      Create
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { type User, userSchema } from '../db';
import { watch } from 'vue';

const currentUser = useUsersStore();
const currentStacks = useStacksStore();

const state = reactive({
  id: currentUser.id,
  firstName: undefined,
  lastName: undefined,
});

const persistRef = ref(false);
const persisted = await navigator.storage.persisted();
persistRef.value = persisted;

watch(persistRef, async (newState, oldState) => {
  if (newState && !oldState) {
    await navigator.storage.persist();
  }
}, {once: true});

async function onSubmit(event: FormSubmitEvent<User>) {
  try {
    await currentUser.createUser(event.data);
    await currentStacks.moveGeneralStackToUser('To Read', currentUser.id, currentStacks.list[0].items);
    await navigateTo('/');
  } catch (error) {
    console.log(`error creating new user. ${error}`);
  }
}
</script>