<script setup>
import { computed } from 'vue'
import { useTodosStore } from '../stores/todosStore.js'

const props = defineProps({
  todo: {
    title: String,
    isComplete: Boolean,
    dueDate: String,
    guid: String
  }
});

const emit = defineEmits(['showDeleteDialog', 'showEditDialog']);

const openDeleteDialog = () => {
  emit('showDeleteDialog', {
    title: props.todo.title,
    guid: props.todo.guid
  })
};

const openEditDialog = () => {
  emit('showEditDialog', {
    ...props.todo
  })
};

const todosStore = useTodosStore()

const onCompletedBtnClick = () => {
  todosStore.updateTodo({
    ...props.todo,
    isComplete: !props.todo.isComplete
  })
};

const formattedDate = computed(() => {
  if(!props.todo.dueDate)
    return 'No due date';

    console.log(props.todo.dueDate);

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(props.todo.dueDate))
});

</script>

<template>
  <v-card
      class='pa-3 ma-2'
      elevation='0'
      rounded
      outlined
  >
    <v-row
        align='center'
        no-gutters
        class='px-2'
    >
      <v-col class='d-flex align-center' cols='6'>
        <v-checkbox
            :model-value='props.todo.isComplete'
            class='mr-2'
            color='green-accent-4'
            hide-details
            density='compact'
            @change='onCompletedBtnClick'
        />
        <span
            :class='{ completed: props.todo.isComplete }'
            class='task-text text-truncate'
        >
          {{ props.todo.title }}
        </span>
      </v-col>

      <v-col class='d-flex align-center justify-end' cols='4'>
        <v-icon size='20' class='mr-1' color='grey darken-1'>mdi-clock</v-icon>
        <span
            :class='{ completed: props.todo.isComplete }'
            class='task-text'
        >
          {{ formattedDate }}
        </span>
      </v-col>

      <v-col class='d-flex align-center justify-end' cols='2'>
        <v-icon
            v-if='!props.todo.isComplete'
            class='mr-2'
            color='grey-darken-3'
            size='20'
            style='cursor: pointer;'
            @click='openEditDialog'
        >
          mdi-pencil
        </v-icon>
        <v-icon
            color='red-accent-4'
            size='20'
            style='cursor: pointer;'
            @click='openDeleteDialog'
        >
          mdi-trash-can
        </v-icon>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.task-text {
  font-size: 16px;
  transition: all 0.3s ease;
}

.task-text.completed {
  text-decoration: line-through;
  color: #9e9e9e;
  filter: blur(1px);
  opacity: 0.6;
}
</style>