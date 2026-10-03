<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-4" id="badge_dialog">
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="close"></div>

      <div class="relative w-full max-w-md overflow-hidden rounded border border-white/10 bg-slate-900 shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
              <ShieldCheck class="h-6 w-6" />
            </div>

            <div>
              <h2 class="font-semibold text-white">
                Badge vérifié
              </h2>

              <p class="text-xs text-slate-500">
                Informations du personnel
              </p>
            </div>
          </div>

          <button @click="close" class="rounded p-2 text-slate-400 hover:bg-white/10 hover:text-white" >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center p-12" >
          <LoaderCircle
            class="h-10 w-10 animate-spin text-indigo-500"
          />

          <p class="mt-4 text-sm text-slate-400">
            Vérification du badge...
          </p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="p-6" >
          <div class="rounded border border-red-500/20 bg-red-500/10 p-5 text-center" >
            <AlertCircle class="mx-auto h-10 w-10 text-red-400" />

            <h3 class="mt-3 font-semibold text-white">
              Badge non trouvé
            </h3>

            <p class="mt-2 text-sm text-red-300">
              {{ error }}
            </p>
          </div>

          <button @click="close" class="mt-5 w-full rounded bg-white/5 py-3 text-sm text-slate-300 hover:bg-white/10" >
            Fermer
          </button>
        </div>

        <!-- Personnel -->
        <div v-else-if="person" class="p-6">
          
          <!-- Aperçu écran -->
          <div class="overflow-auto">
            <div class="badge">
              <img src="/badge.jpeg" alt="badge" class="background" />

              <img v-if="person.photo" :src="person.photo" :alt="`${person.prenom} ${person.nom}`" class="iphoto" />

              <div class="ibindi">
                <div class="izina">
                  {{ person.prenom }} {{ person.nom }}
                </div>

                <div class="poste">
                  {{ person.poste }}
                </div>
              </div>

              <div class="qr_img">
                <img v-show="qr_src" :src="qr_src" alt="QR Code" />
              </div>
            </div>
          </div>

          <!-- Bouton -->
          <button
            @click="print"
            class="mt-6 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-purple-500"
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
    <div class="badge printable" id="badge_only" v-if="!!person">
      <img src="/badge.jpeg" alt="badge" class="background" />
    
      <img v-if="person.photo" :src="person.photo" :alt="`${person.prenom} ${person.nom}`" class="iphoto" />
    
      <div class="ibindi">
        <div class="izina">
          {{ person.prenom }} {{ person.nom }}
        </div>
    
        <div class="poste">
          {{ person.poste }}
        </div>
      </div>
    
      <div class="qr_img">
        <img v-show="qr_src" :src="qr_src" alt="QR Code" />
      </div>
    </div>
  </Teleport>
</template>
<script>
import axios from 'axios';
import { X, User, BriefcaseBusiness, LoaderCircle, ShieldCheck, AlertCircle } from 'lucide-vue-next'
import QRCode from 'qrcode'

export default {
  name: 'BadgeDialog',

  components: { X, User, BriefcaseBusiness, LoaderCircle, ShieldCheck, AlertCircle},

  props: {
    show: {
      type: Boolean,
      default: false,
    },

    qrValue: {
      type: String,
      default: '',
    },

    personnel: {
      type: Object,
      default: null,
    },
  },

  emits: ['close'],

  data() {
    return {
      loading: false,
      error: null,
      person: null,
      qr_src: ""
    }
  },

  watch: {
    show(value) {
      if (value) {
        if (this.personnel) {
          this.person = this.personnel
        } else if (this.qrValue) {
          this.loadPersonnel()
        }
      } else {
        this.person = null
        this.error = null
      }
    },

    personnel(value) {
      if (value) {
        this.person = value
      }
    },
    person(value) {
      if (value) {
        this.generateQR(value.id)
      }
    }
  },

  methods: {
    getPersonnelId() {
      const value = this.qrValue?.trim()

      if (!value) return null

      // QR contenant une URL
      try {
        const url = new URL(value)

        const parts = url.pathname.split('/').filter(Boolean)

        return parts.at(-1)
      } catch {
        // QR contenant directement l'UUID
        return value
      }
    },

    async loadPersonnel() {
      const id = this.getPersonnelId()

      if (!id) {
        this.error = 'QR code invalide.'
        return
      }

      this.loading = true
      this.error = null

      let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.$store.state.user.access}`,
      }
      axios.get(`http://127.0.0.1:8000/personnel/personnels/${id}/`, { headers }).then((response) => {
        this.person = response.data
      }).catch((error) => {
        console.error(error)
        this.error = "Impossible de récupérer les informations du personnel."
      }).finally(() => {
        this.loading = false
      })
    },

    close() {
      this.$emit('close')
    },

    generateQR(id){
      let vue = this
      QRCode.toDataURL(id, {
        color: { dark: '#15B', light: '#ddd'},
        align: 'center',

      }).then(src => {
        vue.qr_src = src
      })
    },
    print(){
      let app = document.getElementById('app')
      let dialog = document.getElementById('badge_dialog')
      let badge = document.getElementById('badge_only')

      let app_display = app.style.display
      let dialog_display = dialog.style.display

      app.style.display = 'none'
      dialog.style.display = 'none'
      badge.style.display = 'block'
      window.print()
      window.setTimeout(() => {
        app.style.display = app_display
        dialog.style.display = dialog_display
        badge.style.display = 'none'
      }, 100)
    }
  },
}
</script>

<style scoped>
.badge {
  position: relative;
  height: 60vh;
}

.background {
  position: absolute;
  width: 11cm;
  min-width: 11cm;
}

.iphoto {
  position: absolute;
  top: 3.5cm;
  left: 3.15cm;
  width: 4.7cm;
  height: 4.7cm;
  border-radius: 50%;
}

.ibindi {
  position: absolute;
  top: 8.7cm;
  width: 11cm;
  text-align: center;
  color: white;
}

.izina {
  font-size: 1.2em;
}

.poste {
  font-size: 0.9em;
  margin-top: 0.2em;
}

.qr_img {
  position: absolute;
  top: 10.8cm;
  left: 3.3cm;
  width: 4.4cm;
  height: 4.4cm;
  overflow: hidden;
}

.qr_img img {
  width: 100%;
  object-fit: cover;
}
.printable {
  display: none;
}
</style>
