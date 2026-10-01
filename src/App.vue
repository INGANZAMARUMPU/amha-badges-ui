<template>
<div id="parent" v-if="$store.state.user != null">
  <RouterView />
</div>

<Login v-else></Login>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import Login from './views/Login.vue'

export default {
  components: {
    RouterLink,
    RouterView,
    Login,
  },
  mounted() {
    this.$store.state.user = JSON.parse(localStorage.getItem('user')) || null
  },
}
</script>

<style src="@/style.css">
</style>
