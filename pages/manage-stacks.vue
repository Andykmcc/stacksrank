<template>
  <h1 class="text-2xl mb-4">Manage Stacks</h1>

  <UCard class="mb-4" v-for="stack in stacksStore.list" :key="stack.id">
    <template #header>
      <div class="flex">
        <h2 class="text-xl font-semibold">{{ stack.name }}</h2>
        <UTooltip class="ml-auto" :text="(stack.isDefault) ? 'Current Default' : 'Make default'" :popper="{ placement: 'top' }">
          <UButton
            icon="i-heroicons-star-solid"
            size="sm"
            color="primary"
            :variant="(stack.isDefault) ? 'solid' : 'outline'"
            :trailing="false"
            @click=makeDefault(stack.id)
            :disabled=stack.isDefault
          />
        </UTooltip>
      </div>

    </template>

    <ol>
      <li class="flex items-center text-nowrap py-1" v-for="work in stack.items.slice(0,3)" :key="work.key">
        <span class="font-semibold truncate">{{ work.title }}</span><span class="truncate text-md italic">&nbsp{{ work.author_name[0] }}</span>
      </li>
      <div v-if="stack.items.length === 0">
        <p>Nothing in your <span class="font-bold">{{ stack.name }}</span> stack yet.</p>
      </div>
    </ol>

    <template #footer>
      <div class="flex flex-end">
        <UTooltip class="ml-auto" text="Delete stack" :popper="{ placement: 'top' }">
          <UButton
            icon="i-heroicons-x-circle-16-solid"
            size="sm"
            color="scarlet"
            variant="outline"
            :trailing="false"
            @click=remove(stack.id)
            :disabled=stack.isDefault
          />
        </UTooltip>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { type Stack } from '../db';

const userStore = useUsersStore();
const stacksStore = useStacksStore();

userStore.$subscribe(async (mutate, userState) => {
  await stacksStore.getByUser(userState.id);
});

async function remove(stackId:Stack['id']) {
  await stacksStore.remove(stackId);
}

async function makeDefault(stackId:Stack['id']) {
  await stacksStore.setDefaultStack(userStore.id, stackId);
}
</script>