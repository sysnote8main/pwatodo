<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  addToTop: boolean
}>()

const emit = defineEmits<{
  add: [title: string]
  toggleInsertDirection: []
}>()

const title = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function handleSubmit() {
  const trimmed = title.value.trim()
  if (!trimmed) return
  emit('add', trimmed)
  title.value = ''
  inputRef.value?.focus()
}
</script>

<template>
  <form class="todo-input" @submit.prevent="handleSubmit">
    <button
      type="button"
      class="todo-input__direction"
      :class="{ 'todo-input__direction--bottom': !addToTop }"
      :aria-label="addToTop ? 'Add to top' : 'Add to bottom'"
      :title="addToTop ? 'Adding to top' : 'Adding to bottom'"
      @click="emit('toggleInsertDirection')"
    >
      <svg
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline v-if="addToTop" points="18 11 12 5 6 11" />
        <polyline v-else points="18 13 12 19 6 13" />
      </svg>
    </button>

    <input
      ref="inputRef"
      v-model="title"
      type="text"
      class="todo-input__field"
      placeholder="What needs to be done?"
      autocomplete="off"
      autofocus
    />
    <button
      class="todo-input__button"
      type="submit"
      :disabled="!title.trim()"
      aria-label="Add todo"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  </form>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.todo-input__field {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 16px;
  background: var(--bg-card);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.todo-input__field:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.todo-input__field::placeholder {
  color: var(--text-muted);
}

.todo-input__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s, opacity 0.2s;
  flex-shrink: 0;
}

.todo-input__button:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: scale(1.05);
}

.todo-input__button:active:not(:disabled) {
  transform: scale(0.95);
}

.todo-input__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.todo-input__direction {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.todo-input__direction:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-glow);
}

.todo-input__direction--bottom {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-glow);
}
</style>
