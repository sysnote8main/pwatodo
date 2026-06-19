<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTodos } from './composables/useTodos'
import TodoInput from './components/TodoInput.vue'
import TodoItem from './components/TodoItem.vue'
import TodoFooter from './components/TodoFooter.vue'
import InstallButton from './components/InstallButton.vue'

const {
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
} = useTodos()

const online = ref(navigator.onLine)
function updateOnline() {
  online.value = navigator.onLine
}
onMounted(() => {
  window.addEventListener('online', updateOnline)
  window.addEventListener('offline', updateOnline)
})
onUnmounted(() => {
  window.removeEventListener('online', updateOnline)
  window.removeEventListener('offline', updateOnline)
})
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">PwaTodo</h1>
      <p class="app__subtitle">Offline-ready task manager</p>
      <InstallButton />
    </header>

    <main class="app__main">
      <TodoInput
        :add-to-top="addToTop"
        @add="add"
        @toggle-insert-direction="toggleInsertDirection"
      />

      <div v-if="loading" class="app__loading">
        <div class="spinner" />
      </div>

      <p v-else-if="error" class="app__error">{{ error }}</p>

      <TransitionGroup v-else-if="todos.length" tag="ul" class="todo-list" name="list">
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @toggle="toggle"
          @remove="remove"
        />
      </TransitionGroup>

      <p v-else class="app__empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span>No todos yet — add one above!</span>
      </p>

      <TodoFooter
        v-if="todos.length > 0"
        :active-count="activeCount"
        :completed-count="completedCount"
        @clear-completed="clearCompletedTodos"
      />
    </main>

    <footer class="app__footer">
      <p class="app__online-status">
        {{ online ? '🟢 Online' : '🔴 Offline' }}
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 20px;
}

.app__header {
  text-align: center;
  margin-bottom: 32px;
}

.app__title {
  font-size: 36px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  letter-spacing: -0.5px;
}

.app__subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.app__main {
  flex: 1;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app__loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.app__error {
  text-align: center;
  padding: 24px;
  color: var(--danger);
  background: var(--danger-bg);
  border-radius: 12px;
  font-size: 14px;
}

.app__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  color: var(--text-muted);
  font-size: 14px;
}

.app__footer {
  text-align: center;
  padding-top: 32px;
}

.app__online-status {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
