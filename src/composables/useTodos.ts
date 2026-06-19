import { ref, computed, onMounted } from "vue";
import type { Todo } from "../types/todo";
import * as db from "./useDb";

const todos = ref<Todo[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const addToTop = ref(localStorage.getItem("pwatodo-addToTop") === "true");
function toggleInsertDirection() {
	addToTop.value = !addToTop.value;
	localStorage.setItem("pwatodo-addToTop", String(addToTop.value));
}

export function useTodos() {
	async function loadTodos() {
		loading.value = true;
		error.value = null;
		try {
			todos.value = await db.getAllTodos();
		} catch (e) {
			error.value = (e as Error).message;
		} finally {
			loading.value = false;
		}
	}

	async function add(title: string) {
		const trimmed = title.trim();
		if (!trimmed) return;
		try {
			const todo = await db.addTodo(trimmed);
			if (addToTop.value) {
				todos.value.unshift(todo);
			} else {
				todos.value.push(todo);
			}
		} catch (e) {
			error.value = (e as Error).message;
		}
	}

	async function toggle(id: string) {
		const todo = todos.value.find((t) => t.id === id);
		if (!todo) return;
		try {
			await db.updateTodo(id, { completed: !todo.completed });
			todo.completed = !todo.completed;
			todo.updatedAt = Date.now();
		} catch (e) {
			error.value = (e as Error).message;
		}
	}

	async function remove(id: string) {
		try {
			await db.deleteTodo(id);
			todos.value = todos.value.filter((t) => t.id !== id);
		} catch (e) {
			error.value = (e as Error).message;
		}
	}

	async function clearCompletedTodos() {
		try {
			await db.clearCompleted();
			todos.value = todos.value.filter((t) => !t.completed);
		} catch (e) {
			error.value = (e as Error).message;
		}
	}

	const activeCount = computed(
		() => todos.value.filter((t) => !t.completed).length,
	);
	const completedCount = computed(
		() => todos.value.filter((t) => t.completed).length,
	);

	onMounted(loadTodos);

	return {
		todos,
		loading,
		error,
		add,
		toggle,
		remove,
		clearCompletedTodos,
		activeCount,
		completedCount,
		addToTop,
		toggleInsertDirection,
	};
}
