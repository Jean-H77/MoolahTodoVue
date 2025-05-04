<script setup>
import {onMounted, ref, watch} from 'vue'
import { useTodosStore } from './stores/todosStore.js';

import TodoEntry from './components/TodoEntry.vue'
import DeleteTodoDialog from './components/DeleteTodoDialog.vue';
import AddTodoDialog from './components/AddTodoDialog.vue';
import EditTodoDialog from "./components/EditTodoDialog.vue";
import SearchTodo from "./components/SearchTodo.vue";

const todosStore = useTodosStore();

const isAddDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const showDeleteDialog = ref(false);

const deleteDialogData = ref({ title: '', guid: '' });
const editDialogData = ref({});

const handleShowDeleteDialog = ({ title, guid }) => {
  deleteDialogData.value = { title, guid };
  showDeleteDialog.value = true;
};

const handleShowAddDialog = () => {
  isAddDialogVisible.value = true;
};

const handleShowEditDialog = (todo) => {
  editDialogData.value = todo;
  isEditDialogVisible.value = true;
}

const setProvider = (provider) => {
  todosStore.setProvider(provider)
  todosStore.fetchPageTodos();
}

onMounted(() => {
  setProvider('SqlServer')
});

watch(() => todosStore.page, () => {
  todosStore.fetchPageTodos();
});

watch(() => todosStore.totalPages, () => {
  console.log(`Total Pages: ${todosStore.totalPages}`);
});

</script>

<template>
  <v-app>
    <v-container class='pa-4' style='max-width: 900px' fill-height>
      <v-card elevation='2' rounded='lg' class='d-flex flex-column' style='height: 900px;'>

        <v-card-title>
          <v-tabs
              bg-color='white'
              fixed-tabs
              center-active
              color='grey-darken-4'
              class='mb-4'
          >
            <v-tab @click="setProvider('SqlServer')">SQL Server</v-tab>
            <v-tab @click="setProvider('MongoDb')">MongoDb</v-tab>
          </v-tabs>

        </v-card-title>

        <v-divider v-if='todosStore.todos.length > 1' class='mx-4'></v-divider>

        <v-list class='pa-2 border-thin border-double' height='750px'>
          <v-slide-y-transition group>
            <div
                v-for='(todo, idx) in todosStore.todos'
                :key='todo.guid'
                class="mb-3"
            >
              <TodoEntry :todo='todo'
                         @showDeleteDialog='handleShowDeleteDialog'
                         @showEditDialog='handleShowEditDialog'/>

              <v-divider v-if="idx !== todosStore.todos.length-1"></v-divider>
            </div>
          </v-slide-y-transition>
        </v-list>


        <v-card-actions class='d-flex flex-column' style='margin-top: auto;'>
          <div class='d-flex align-center flex-wrap justify-space-between w-100'>
            <v-btn
                class='ma-2'
                elevation='2'
                @click="handleShowAddDialog"
                style='height: 56px; display: flex; align-items: center;'
            >
              <v-icon left>mdi-plus</v-icon>
              Add New Todo
            </v-btn>

            <SearchTodo/>

            <v-pagination
                v-model="todosStore.page"
                :length='todosStore.totalPages'
                :total-visible='3'
                class='ma-2'
            ></v-pagination>
          </div>
        </v-card-actions>

      </v-card>

      <AddTodoDialog v-model:isVisible='isAddDialogVisible' />

      <DeleteTodoDialog
          v-model:isVisible='showDeleteDialog'
          :title='deleteDialogData.title'
          :guid='deleteDialogData.guid'
      />

      <EditTodoDialog
          v-model:is-visible='isEditDialogVisible'
          :todo='editDialogData'/>

    </v-container>
  </v-app>
</template>