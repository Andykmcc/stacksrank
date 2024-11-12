<template>
  <ClientOnly>
  <!-- <VueDraggable v-model="stack?.items"> -->
    <p>Stack.User_ID: {{ stack?.user_id }}</p>
    <div v-if="stack" v-for="work in stack.items" :key="work.key">
      {{ work.title }} {{ work.author_name[0] }}
    </div>
    <span>(Stack) Current User ID: {{ currentUser?.id }}</span>
  <!-- </VueDraggable> -->
  </ClientOnly>
</template>

<script setup lang="ts">
  // import { VueDraggable } from 'vue-draggable-plus'
  import { db, type Stack} from "../db";
  import { watch } from 'vue';
  import { liveQuery, type Subscription} from "dexie";
  
  const {data: currentUser} = await useUser();
  const stack = ref();

  watch(currentUser, async (newCurrentUser) => {
    if (newCurrentUser !== null) {
      const { data } = await useStack(newCurrentUser);
      stack.value = data.value;
    }
  }, {once: true})
  
</script>
