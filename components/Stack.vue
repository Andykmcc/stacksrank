<template>
  <VueDraggable v-model="stack.items">
    <div v-if="stack" v-for=" work in stack.items" :key="work.key">
      {{ work.title }} {{ work.author_name[0] }}
    </div>
  </VueDraggable>
</template>

<script setup lang="ts">
  import { VueDraggable } from 'vue-draggable-plus'
  import { db, type Stack} from "../db";
  import { watch } from 'vue';
  import { liveQuery, type Subscription} from "dexie";
  
  const stack = useStacksStore();
</script>
