<script setup>
import { watch } from 'vue';
import { debounce } from 'lodash';
import { useTodosStore } from '../stores/todosStore.js';

const todosStore = useTodosStore();

const debouncedSearch = debounce(() => {
   todosStore.fetchPageTodos();
}, 600);


watch(() => todosStore.search, () => {
  debouncedSearch();
});

</script>

<template>
  <v-text-field
      v-model="todosStore.search"
      prepend-inner-icon='mdi-magnify'
      label='Search todos'
      class='ma-2'
      style='height: 56px; min-width: 275px; flex-grow: 1;'
      outlined
      dense
  />
</template>
