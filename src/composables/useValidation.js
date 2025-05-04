import { ref } from 'vue';

// https://vuejs.org/guide/reusability/composables

export function useTodoTitleValidation() {
    const titleInput = ref('');
    const titleRules = [
        v => !!v || 'Title is required',
    ];

    const formValid = ref(false);

    return {
        titleInput,
        titleRules,
        formValid,
    };
}