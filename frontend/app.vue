<template>
  <div class="min-h-screen flex flex-col">
    <NuxtPage />
  </div>
</template>

<script setup>
// Use client-side only to avoid hydration mismatch
if (process.client) {
  // Initialize theme from localStorage if available
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
}
</script>