import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore('main_store', () => {
  const user = ref(null)
  return { user }
})

window.axios = axios