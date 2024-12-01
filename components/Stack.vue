<template>
  <div v-for="stack in stacksStore.list.toSorted(sortDefaultStackToHead)" :key="stack.id">
    <h2 class="text-xl font-semibold mb-2">{{ stack.name }}</h2>
    <ol v-draggable="[
      stack.items,
      {
        onUpdate: (e) => onUpdate(stack.id, e),
        onAdd: () =>  onAddOrRemove(stack.id),
        onRemove: () =>  onAddOrRemove(stack.id),
        group: 'work'
      }
    ]">
      <li class="flex items-center text-nowrap cursor-grab active:cursor-grabbing py-1" v-for="(work, index) in stack.items" :key="work.key">
        <span class="font-semibold truncate">{{ work.title }}</span><span class="truncate text-md italic">&nbsp{{ work.author_name[0] }}</span>
        <UButton class="align-middle ml-auto" icon="i-heroicons-x-circle-16-solid" color="scarlet" variant="ghost" size="2xs" @click="remove(stack.id, index)"/>
      </li>
    </ol>
    <div v-if="stack.items.length === 0">
      <p>Nothing in your <span class="font-bold">{{ stack.name }}</span> stack yet.</p>
    </div>
    <UDivider class="my-6" />
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
      const list = stacksStore.list.find(({id}) => id === stackId);
      if (list) {
        await stacksStore.setStackList(stackId, list.items);
      }
    }
  }

  async function onAddOrRemove(stackId:Stack['id']) {
    const list = stacksStore.list.find(({id}) => id === stackId);
    if (list) {
      await stacksStore.setStackList(stackId, list.items);
    }
  }

  async function remove(stackId:Stack['id'], index:number) {
    await stacksStore.removeItem(stackId, index);
  }

  function sortDefaultStackToHead(s0:Stack, s1:Stack) {
    return s0.isDefault ? -1 : s1.isDefault ? 1 : 0;
  }
</script>
