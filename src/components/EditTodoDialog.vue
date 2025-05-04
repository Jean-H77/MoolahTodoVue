<script setup>
import { useTodosStore } from '../stores/todosStore.js';
import {computed, ref, useTemplateRef, watch} from "vue";
import { useTodoTitleValidation } from "../composables/useValidation.js";

const props = defineProps({
  isVisible: Boolean,
  todo: Object,
});

const todosStore = useTodosStore();

const emit = defineEmits(['update:isVisible']);

const form = useTemplateRef('form');
const { titleInput, titleRules, formValid } = useTodoTitleValidation();
const dueDateInput = ref({});

const localVisible = computed({
  get: () => props.isVisible,
  set: (newVal) => {
    emit('update:isVisible', newVal);
  }
});

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    titleInput.value = props.todo.title;
    dueDateInput.value = props.todo.dueDate;
  }
});


const editTodo = async () => {
  const validationResponse = await form.value?.validate();
  if (!validationResponse.valid) return;

  await todosStore.updateTodo({
    ...props.todo,
    title: titleInput.value,
    dueDate: dueDateInput.value,
  });

  titleInput.value = '';
  closeDialog();
};

</script>

<template>
  <v-dialog v-model="localVisible" max-width="400" persistent>
    <v-card title="Edit Todo">
      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="editTodo">
          <v-text-field
              v-model="titleInput"
              label="Title*"
              :rules="titleRules"
              required
              clearable
              prepend-inner-icon="mdi-format-title"
              class="mb-4"
          />

          <v-date-input
              v-model="dueDateInput"
              label="New Due Date"
              variant="underlined"
          />
        </v-form>
      </v-card-text>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog" color="grey-darken-4">Close</v-btn>
        <v-btn @click="editTodo" color="blue">Save</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>