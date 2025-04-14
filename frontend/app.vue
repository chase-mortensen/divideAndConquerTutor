<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// Set theme on client-side to avoid hydration mismatch
if (process.client) {
  const theme = localStorage.getItem('theme') || 'lofi'
  document.documentElement.setAttribute('data-theme', theme)
}
</script>