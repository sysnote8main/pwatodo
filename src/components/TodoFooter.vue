<script setup lang="ts">
defineProps<{
  activeCount: number
  completedCount: number
}>()

const emit = defineEmits<{
  clearCompleted: []
}>()
</script>

<template>
  <footer class="todo-footer">
    <span class="todo-footer__count">
      <strong>{{ activeCount }}</strong> {{ activeCount === 1 ? 'item' : 'items' }} left
    </span>
    <button
      v-if="completedCount > 0"
      class="todo-footer__clear"
      @click="emit('clearCompleted')"
    >
      Clear completed ({{ completedCount }})
    </button>
  </footer>
</template>

<style scoped>
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 4px 0;
  font-size: 14px;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  margin-top: 24px;
}

.todo-footer__count strong {
  color: var(--text);
}

.todo-footer__clear {
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.todo-footer__clear:hover {
  color: var(--danger);
  background: var(--danger-bg);
}
</style>
