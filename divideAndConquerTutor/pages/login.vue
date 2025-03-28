<template>
  <NuxtLayout name="default">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">{{ isLogin ? 'Login' : 'Sign Up' }}</h1>
        <p class="text-gray-600 mt-2">
          {{ isLogin ? 'Welcome back! Please login to continue.' : 'Create an account to start your learning journey.' }}
        </p>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="tabs tabs-boxed mb-4">
            <a 
              class="tab" 
              :class="{ 'tab-active': isLogin }"
              @click="isLogin = true"
            >Login</a>
            <a 
              class="tab" 
              :class="{ 'tab-active': !isLogin }"
              @click="isLogin = false"
            >Sign Up</a>
          </div>

          <form @submit.prevent="handleSubmit">
            <div v-if="!isLogin" class="form-control mb-4">
              <label class="label">
                <span class="label-text">Full Name</span>
              </label>
              <input 
                type="text" 
                v-model="form.name" 
                placeholder="Enter your full name" 
                class="input input-bordered" 
                required
              />
            </div>
            
            <div class="form-control mb-4">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input 
                type="email" 
                v-model="form.email" 
                placeholder="Enter your email" 
                class="input input-bordered" 
                required
              />
            </div>
            
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input 
                type="password" 
                v-model="form.password" 
                placeholder="Enter your password" 
                class="input input-bordered" 
                required
              />
              <label v-if="isLogin" class="label">
                <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            <div v-if="errorMessage" class="alert alert-error mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ errorMessage }}</span>
              </div>
            </div>
            
            <div class="form-control">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="loading"
              >
                <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
                {{ isLogin ? 'Login' : 'Sign Up' }}
              </button>
            </div>
          </form>

          <div class="divider">OR</div>
          
          <div class="flex flex-col gap-2">
            <button class="btn btn-outline gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
              </svg>
              Continue with Google
            </button>
            <button class="btn btn-outline gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogin = ref(true);
const loading = ref(false);
const errorMessage = ref('');

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    // In a real application, this would make an API call to authenticate
    // For this prototype, we'll simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isLogin.value) {
      // Simulate login
      if (form.email === 'demo@example.com' && form.password === 'password') {
        // Successful login
        router.push('/');
      } else {
        errorMessage.value = 'Invalid email or password.';
      }
    } else {
      // Simulate signup
      // In a real app, we'd validate the form and make an API call
      router.push('/');
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>