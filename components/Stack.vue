<template>
  <div class="mt-6" v-for="stack in stacksStore.list" :key="stack.id">
    <h2 class="text-lg font-semibold mb-2">{{ stack.name }}</h2>
    <ol v-draggable="[
      stack.items,
      {
        onUpdate: (e) => onUpdate(stack.id, e),
      }
    ]">
      <li class="flex items-center text-nowrap cursor-grab active:cursor-grabbing py-1" v-for="(work, index) in stack.items" :key="work.key">
        <span class="font-semibold truncate">{{ work.title }}</span><span class="truncate text-sm italic">&nbsp{{ work.author_name[0] }}</span>
        <UButton class="align-middle ml-auto" icon="i-heroicons-x-circle-16-solid" size="2xs" square @click="remove(stack.id, index)"/>
      </li>
    </ol>
    <div v-if="stack.items.length === 0">
      <p>Nothing in your <span class="font-bold">{{ stack.name }}</span> stack yet.</p>
    </div>
  </div>
  <div v-if="stacksStore.list.length === 0">
    <p>No stacks yet.</p>
  </div>
</template>

<script setup lang="ts">
  import { vDraggable, type SortableEvent } from 'vue-draggable-plus';
  import { type Stack } from '../db';
  
  const userStore = useUsersStore();
  const stacksStore = useStacksStore();

  userStore.$subscribe(async (mutate, userState) => {
    await stacksStore.getByUser(userState.id);
  });

  await stacksStore.getByUser(userStore.id);

  async function onUpdate(stackId:Stack['id'], e:SortableEvent) {
    // handles re-ranking of existing items
    if (e.oldIndex !== undefined && e.newIndex !== undefined) {
      await stacksStore.updateRank(stackId, e.oldIndex, e.newIndex);
    }
  }

  async function remove(stackId:Stack['id'], index:number) {
    await stacksStore.removeItem(stackId, index);
  }
</script>
