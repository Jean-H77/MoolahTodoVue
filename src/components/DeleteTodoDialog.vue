<script setup>
import {useTodosStore} from '../stores/todosStore.js';

const props = defineProps({
  isVisible: Boolean,
  title: String,
  guid: String,
});

const todosStore = useTodosStore();

const emit = defineEmits(['update:isVisible']);

const closeDialog = () => emit('update:isVisible', false);

const deleteTodo = () => {
  todosStore.deleteTodo(props.guid);
  closeDialog();
};

</script>

<template>
  <v-dialog v-model='props.isVisible' max-width='400' persistent>
    <v-card title="Delete Confirmation">
      <v-card-text>
        Are you sure you want to delete "{{ props.title }}"?
      </v-card-text>

      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click='closeDialog' color='grey-darken-4'>Keep</v-btn>
        <v-btn @click='deleteTodo' color='red'>Delete</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>