import axios from 'axios'
import { useTodosStore} from '../stores/todosStore.js';

const baseURL = 'https://localhost:7117/todos'

// https://www.npmjs.com/package/axios#creating-an-instance
const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// https://www.npmjs.com/package/axios#interceptors
api.interceptors.request.use(config => {
    const store = useTodosStore();
    if (!config.params) {
        config.params = {};
    }

    config.params = {
        ...config.params,
        provider: store.selectedTodosProvider,
        page: store.page
    };
    return config;
});

export default api;