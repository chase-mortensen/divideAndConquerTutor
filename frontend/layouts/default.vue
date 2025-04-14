<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <header class="bg-primary text-primary-content shadow-md">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold">Divide-and-Conquer Tutor</NuxtLink>
        <nav>
          <ul class="flex space-x-4 items-center">
            <li><NuxtLink to="/" class="hover:underline">Home</NuxtLink></li>
            <li><NuxtLink to="/problems" class="hover:underline">Problems</NuxtLink></li>
            <li><NuxtLink to="/progress" class="hover:underline">My Progress</NuxtLink></li>
            <li><NuxtLink to="/login" class="hover:underline">Login</NuxtLink></li>
            <li>
              <button id="theme-toggle" data-toggle-theme="lofi,forest" data-act-class="active" class="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-6">
      <slot />
    </main>

    <footer class="bg-neutral text-neutral-content">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between">
          <div>
            <h3 class="font-bold text-lg">Divide-and-Conquer Tutor</h3>
            <p>An educational platform for learning algorithm design.</p>
          </div>
          <div>
            <h3 class="font-bold mb-2">Quick Links</h3>
            <ul>
              <li><NuxtLink to="/about" class="hover:underline">About</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:underline">Contact</NuxtLink></li>
              <li><NuxtLink to="/terms" class="hover:underline">Terms of Use</NuxtLink></li>
            </ul>
          </div>
        </div>
        <div class="mt-4 text-center">
          <p>&copy; {{ new Date().getFullYear() }} Divide-and-Conquer Tutor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>