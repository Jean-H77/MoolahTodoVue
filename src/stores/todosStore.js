import {defineStore} from 'pinia';
import api from '../api/axios.js';

const pageSize = 10;

export const useTodosStore = defineStore('todosStore', {
    state: () => ({
        todos: [],
        page: 1,
        totalTodos: 0,
        totalPages: 0,
        search: '',
        selectedTodosProvider: ""
    }),
    actions: {
        async fetchTodos() {
            try {
                return await api.get('/').then(r => {
                    this.todos = r.data.todos;
                    this.totalTodos = r.data.totalCount
                    this.totalPages = Math.max(1, Math.ceil(this.totalTodos / pageSize));
                });
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        },
        async fetchTodosBySearchQuery(searchQuery) {
            console.log(searchQuery);
            try {
               await api.get('/search', {
                    params: {
                        search: searchQuery
                    }
                }).then(r => {
                    if(r.status === 200) {
                        this.todos = r.data.todos;
                        this.totalTodos = r.data.totalCount;
                        this.totalPages = Math.max(1, Math.ceil(this.totalTodos / pageSize));
                    }
                });
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        },
        async addTodo(title, dueDate) {
            try {
                const payload = { title };
                if (dueDate !== null && dueDate !== undefined) {
                    payload.dueDate = dueDate;
                }

                await api.post(`/`, payload)
                    .then(r => {
                        if(r.status === 200) {
                            this.todos.push(r.data);
                            this.totalTodos++;
                        }
                    });
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        },
        async deleteTodo(guid) {
            try {
                await api.delete(`/${guid}`)
                    .then(r => {
                        if(r.status === 200) {
                            this.totalTodos--;
                            this.todos = this.todos.filter(todo => todo.guid !== guid);
                        }
                    });
            } catch (error) {
                console.error('Error deleting todo:', error);
            }
        },
        async updateTodo(todo) {
            try {
                console.log(todo);
                await api.put(`/`, todo)
                    .then(r => {
                        if(r.status === 200) {
                            const index = this.todos.findIndex(t => t.guid === todo.guid);
                            if (index !== -1) {
                                this.todos[index] = todo;
                            }
                        }
                    });
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        },
        setProvider(provider) {
            this.selectedTodosProvider = provider;

        },
        async fetchPageTodos() {
            if(this.search !== '') {
                await this.fetchTodosBySearchQuery(this.search);
            } else {
                await this.fetchTodos();
            }

            this.page = Math.min(this.page, this.totalPages);
        }
    }
});