<template>
  <VueDraggable v-model="stackStore.items" @update="onUpdate">
    <ol class="" v-if="stackStore" v-for="(work, index) in stackStore.items" :key="work.key">
      <li class="flex items-center text-nowrap mt-1">
        <span class="font-semibold truncate">{{ work.title }}</span><span class="truncate text-sm italic">&nbsp{{ work.author_name[0] }}</span>
        <UButton class="align-middle ml-auto" icon="i-heroicons-x-circle-16-solid" size="2xs" square @click="remove(index)"/>
      </li>
    </ol>
  </VueDraggable>
</template>

<script setup lang="ts">
  import { VueDraggable, type SortableEvent} from 'vue-draggable-plus'
  
  const userStore = useUsersStore();
  const stackStore = useStacksStore();
  
  await stackStore.updateStackFromStorage(userStore.id);

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
