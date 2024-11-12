<template>
  <UInputMenu
    leading-icon="i-heroicons:book-open-solid"
    trailing-icon="i-heroicons:magnifying-glass-solid"
    loading-icon="i-heroicons:arrow-path"
    v-model=selected
    v-model:query=query
    :search="search"
    :loading="loading"
    placeholder="Search for a book..."
    option-attribute="title"
    trailing
    :debounce=400
    searchLazy
    name="search"
    by="key"
  >
    <template #option="{ option: book }">
      <span class="font-semibold truncate">{{ book.title }}</span>
      <span class="truncate">{{ book.author_name[0] }}</span>
    </template>
    <template #option-empty="{ query }">
      Searching...
    </template>
    <template #empty>
      No books found.
    </template>
  </UInputMenu>
</template>

<script setup lang="ts">
  import { type Work, } from "../db";
  import { watch } from 'vue';

  export type OpenLibrarySearchResult = {
    numFound:      number;
    start:         number;
    numFoundExact: boolean;
    docs:          Work[];
    num_found:     number;
    q:             string;
    offset:        number;
  }

  const loading = ref(false);
  const selected = ref<Work>();
  const query = ref('')
  const defaultParams = {
    lang: 'en',
    limit: 5,
    offset: 0,
    page: 0,
    fields: 'title,author_name,key,publish_year',
  };
  const {data: currentUser} = await useUser();

  async function search(q: string) {
    if (query.value !== '') {
      try {
        loading.value = true
        const books: OpenLibrarySearchResult = await $fetch('https://openlibrary.org/search.json', { 
          params: {
            q,
            ...defaultParams
          },
        });
        books.docs.forEach(d => d.publish_year.sort((a, b) => a - b));
        return books.docs;
      } finally {
        loading.value = false
      }
    }
    return [];
  }

  watch(selected, (selectedWork) => {
    if (selectedWork && currentUser.value) {
      console.log(`Add ${selectedWork.title} to ${currentUser.value.id} stack.`);
    }
  });
</script>