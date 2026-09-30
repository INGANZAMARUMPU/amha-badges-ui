<template>
  <div
    class="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden"
  >
    <!-- Background decorations -->
    <div
      class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"
    ></div>

    <div
      class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
    ></div>

    <div
      class="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
    ></div>

    <!-- Login card -->
    <div class="relative z-10 w-full max-w-md">
      <div
        class="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10"
      >
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
          >
            <Lock class="w-5 h-5 text-white" />
          </div>
        </div>

        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white tracking-tight">
            Welcome back
          </h1>

          <p class="text-slate-400 mt-2 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent class="space-y-5">
          <!-- Email -->
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-slate-300 mb-2"
            >
              Email address
            </label>

            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <Mail class="w-5 h-5 text-slate-500" />
              </div>

              <input
                id="username"
                v-model="username"
                type="text"
                required
                placeholder="you@example.com"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-white/20"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label
                for="password"
                class="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
            </div>

            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              >
                <Lock class="w-5 h-5 text-slate-500" />
              </div>

              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-white/20"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition"
              >
                <Eye v-if="showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Login button -->
          <button
            type="submit"
            @click="handleLogin"
            class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-400 hover:to-purple-500 active:scale-[0.98] transition-all duration-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const showPassword = ref(false)
const username = ref('')
const password = ref('')

const handleLogin = () => {
  let data = {
    username: username.value,
    password: password.value,
  }
  alert(JSON.stringify(data))
}
</script>
