<script setup lang="ts">
import { usePwaInstall } from '../composables/usePwaInstall'

const { installAvailable, justInstalled, isStandalone, install } = usePwaInstall()
</script>

<template>
  <!-- Don't render anything when already running as standalone, or nothing to show -->
  <div v-if="!isStandalone && (installAvailable || justInstalled)" class="install-button-wrapper">
    <button
      v-if="installAvailable"
      class="install-button"
      @click="install"
      title="Install app"
    >
      <!-- Download icon -->
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Install App
    </button>

    <p v-else class="install-button__installed">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      App installed!
    </p>
  </div>
</template>

<style scoped>
.install-button-wrapper {
  text-align: center;
  margin-bottom: 20px;
}

.install-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 2px 8px var(--primary-glow);
}

.install-button:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px var(--primary-glow);
}

.install-button:active {
  transform: translateY(0);
}

.install-button__installed {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--primary);
  margin: 0;
  padding: 6px 14px;
  border-radius: 8px;
  background: var(--primary-glow);
}
</style>
