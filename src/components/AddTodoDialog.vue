<script setup>
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useTodosStore } from '../stores/todosStore.js';
import { useTodoTitleValidation } from '../composables/useValidation';

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['update:isVisible']);

const todosStore = useTodosStore();

const form = useTemplateRef('form');
const dueDateInput = ref({});
const { titleInput, titleRules, formValid } = useTodoTitleValidation();

const localVisible = computed({
  get: () => props.isVisible,
  set: (newVal) => {
    emit('update:isVisible', newVal);
  }
});

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    titleInput.value = '';
    dueDateInput.value = '';
  }
});

const addTodo = async () => {
  const validationResponse = await form.value?.validate();
  if (!validationResponse.valid) return;

  const date = dueDateInput.value ? new Date(dueDateInput.value) : null;
  await todosStore.addTodo(titleInput.value, date);

  titleInput.value = '';
  localVisible.value = false;
};

</script>

<template>
  <v-dialog v-model="localVisible" max-width='600'>
    <v-card>
      <v-card-title class='d-flex align-center'>
        <v-icon class='me-2' color='grey-darken-3'>mdi-playlist-plus</v-icon>
        <span class='text-h6'>Todo Registration</span>
      </v-card-title>

      <v-card-text>
        <v-form ref='form' v-model='formValid' @submit.prevent='addTodo'>
          <v-text-field
              v-model='titleInput'
              label='Title*'
              :rules='titleRules'
              required
              clearable
              prepend-inner-icon='mdi-format-title'
              class='mb-4'
          />

          <v-date-input
              v-model='dueDateInput'
              label='Due Date input'
              variant='underlined'
          />

          <small class='text-caption text-medium-emphasis'>*indicates required field</small>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant='text' text='Close' @click="localVisible = false;" />
        <v-btn type='submit' color='primary' variant='tonal' text='Add' @click="addTodo" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

