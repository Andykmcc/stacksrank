<template>
  <h2 class="text-lg mb-4">{{ stack.name }}</h2>
  <ol v-if="stack.items.length">
    <li v-for="work in stack.items.slice(0,3)">
      <span class="font-semibold truncate">{{ work.title }}</span><span class="truncate text-sm italic">&nbsp{{ work.author_name[0] }}</span>
    </li>
  </ol>
  <span v-else>No items in this stack yet.</span>
</template>

<script setup lang="ts">
import { db, type User, type Stack } from '../db';
import { type PropType } from "vue";

const props = defineProps({
  userId: {
    type: String as PropType<User['id']>,
  },
});

const stack = ref(<Stack>{});

if (props.userId) {
  const usersDefaultStack = await db.stacks.where('user_id').equals(props.userId).filter(s => s.isDefault).first();
  if (usersDefaultStack) {
    stack.value = usersDefaultStack;
  }
  stack.value = usersDefaultStack ? usersDefaultStack : <Stack>{};
}

</script>