<template>
<div id="parent" v-if="main_store.user != null">
  <header>
    <img alt="Vue logo" class="logo" src="/logo.jpeg" width="125" height="125" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
  </header>
  <RouterView />
</div>

<Login v-else></Login>
</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import Login from './views/Login.vue'
  import { useMainStore } from './stores/main.js'

  const main_store = useMainStore()
</script>

<style src="@/style.css">
</style>
