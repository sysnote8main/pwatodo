<script setup lang="ts">
import type { Todo } from '../types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
}>()
</script>

<template>
  <li class="todo-item" :class="{ 'todo-item--completed': todo.completed }">
    <button
      class="todo-item__toggle"
      :class="{ 'todo-item__toggle--checked': todo.completed }"
      :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'"
      @click="emit('toggle', todo.id)"
    >
      <svg
        v-if="todo.completed"
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>

    <span class="todo-item__title">
      {{ todo.title }}
    </span>

    <button
      class="todo-item__delete"
      aria-label="Delete todo"
      @click="emit('remove', todo.id)"
    >
      <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: border-color 0.2s, box-shadow 0.2s, opacity 0.3s;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.todo-item:hover {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary-glow);
}

.todo-item--completed {
  opacity: 0.6;
}

.todo-item--completed .todo-item__title {
  text-decoration: line-through;
  color: var(--text-muted);
}

.todo-item__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: transparent;
  cursor: pointer;
  color: transparent;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.todo-item__toggle:hover {
  border-color: var(--primary);
}

.todo-item__toggle--checked {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.todo-item__title {
  flex: 1;
  font-size: 16px;
  line-height: 1.4;
  color: var(--text);
  word-break: break-word;
}

.todo-item__delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.todo-item:hover .todo-item__delete {
  opacity: 1;
}

.todo-item__delete:hover {
  background: var(--danger-bg);
  color: var(--danger);
}
</style>
