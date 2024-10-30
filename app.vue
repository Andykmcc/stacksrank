<script setup lang="ts">
  const loading = ref(false);
  const selected = ref();
  const query = ref()
  const lang = 'en';
  const limit = 5;
  const offset = 0;
  const page = 0;
  const fields = 'title,author_name,key,publish_year';

  const formState = reactive({
    search: undefined,
  })

  export interface OpenLibrarySearchResult {
    numFound:      number;
    start:         number;
    numFoundExact: boolean;
    docs:          Doc[];
    num_found:     number;
    q:             string;
    offset:        number;
  }

  export interface Doc {
      title: string;
  }

  async function search(q: string) {
    if (query.value !== "") {
      loading.value = true
      const books: OpenLibrarySearchResult = await $fetch('https://openlibrary.org/search.json', { 
        params: { 
          q,
          lang,
          limit,
          offset,
          page,
          fields,
        } 
      })

      loading.value = false

      return books.docs;
    }
    return [];
  }
</script>

<template>
  <NuxtPwaManifest />
  <NuxtLoadingIndicator />
  <UContainer>
    <UInputMenu
      trailing-icon="i-heroicons:magnifying-glass-solid"
      v-model="selected"
      v-model:query="query"
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
      <template #empty>
        No books found
      </template>
    </UInputMenu>
  </UContainer>
</template>
