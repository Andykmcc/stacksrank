<template>
  <ol v-draggable="[
      stackStore.items,
      {
        onUpdate,
      }
    ]">
    <li class="flex items-center text-nowrap cursor-grab active:cursor-grabbing py-2" v-if="stackStore" v-for="(work, index) in stackStore.items" :key="work.key">
      <span class="font-semibold truncate">{{ work.title }}</span><span class="truncate text-sm italic">&nbsp{{ work.author_name[0] }}</span>
      <UButton class="align-middle ml-auto" icon="i-heroicons-x-circle-16-solid" size="2xs" square @click="remove(index)"/>
    </li>
  </ol>
</template>

<script setup lang="ts">
  import { vDraggable, type SortableEvent } from 'vue-draggable-plus';
  
  const userStore = useUsersStore();
  const stackStore = useStacksStore();
  
  try {
    await stackStore.updateStackFromStorage(userStore.id);
  } catch (error) {
    console.error(`could not update stackstore from storage ${error}`);
  }

  userStore.$onAction(({name}) => {
    switch (name) {
      case 'logout':
        stackStore.$reset();
        break;
      default:
        return;
    }
  });

  async function onUpdate(e:SortableEvent) {
    // handles re-ranking of existing items
    if (e.oldIndex !== undefined && e.newIndex !== undefined) {
      await stackStore.updateRank(e.oldIndex, e.newIndex);
    }
  }

  async function remove(index:number) {
    stackStore.items.splice(index, 1);
    await stackStore.removeItem(index);
  }
</script>
