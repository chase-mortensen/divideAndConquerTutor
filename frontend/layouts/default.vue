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
              <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost m-1">
                  Theme
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="ml-1" viewBox="0 0 16 16">
                    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
                  </svg>
                </div>
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button data-set-theme="lofi" class="active:bg-primary">Light (Lofi)</button></li>
                  <li><button data-set-theme="forest" class="active:bg-primary">Dark (Forest)</button></li>
                </ul>
              </div>
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