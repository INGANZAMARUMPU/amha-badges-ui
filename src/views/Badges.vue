<template>
  <div class="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mx-auto max-w-7xl">

      <div class="relative overflow-hidden rounded border border-white/10 bg-slate-900 p-6 sm:p-8" >
        <!-- Decoration -->
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" ></div>

        <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between" >
          <div>
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded bg-indigo-500/10 text-indigo-400" >
                <Users class="h-6 w-6" />
              </div>

              <div>
                <p class="text-sm font-medium text-indigo-400">
                  Gestion du personnel
                </p>

                <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl" >
                  Badges & Membres
                </h1>
              </div>
            </div>

            <p class="mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Consultez les membres du personnel et scannez rapidement
              leur badge QR pour vérifier leur identité.
            </p>
          </div>

          <!-- Scan button -->
          <button @click="openScanner" class="group flex items-center justify-center gap-3 rounded bg-indigo-500 px-6 py-2 font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-[0.98]" >
            <QrCode class="h-5 w-5 transition group-hover:rotate-6" />
            Scan
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="mt-6 flex flex-col gap-4 sm:flex-row">

        <!-- Search -->
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

          <input
            v-model="search"
            type="search"
            placeholder="Rechercher un membre..."
            class="w-full rounded border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50"
          />
        </div>

        <!-- Refresh -->
        <button
          @click="loadPersonnels" :disabled="loading"
          class="flex items-center justify-center gap-2 rounded border border-white/10 bg-white/4 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white disabled:opacity-50"
        >
          <RefreshCw :class="[ 'h-4 w-4', loading && 'animate-spin', ]"/>
          Actualiser
        </button>
      </div>

      <!-- Stats -->
      <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div class="rounded border border-white/10 bg-white/[0.03] p-5" >
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-500">
              Total
            </span>

            <Users class="h-5 w-5 text-indigo-400" />
          </div>

          <p class="mt-2 text-3xl font-bold text-white">
            {{ personnels.length }}
          </p>

          <p class="mt-1 text-xs text-slate-600">
            membres enregistrés
          </p>
        </div>

        <div class="rounded border border-white/10 bg-white/[0.03] p-5" >
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-500">
              Résultats
            </span>

            <Search class="h-5 w-5 text-purple-400" />
          </div>

          <p class="mt-2 text-3xl font-bold text-white">
            {{ filteredPersonnels.length }}
          </p>

          <p class="mt-1 text-xs text-slate-600">
            correspondances
          </p>
        </div>

        <div class="hidden rounded border border-white/10 bg-white/[0.03] p-5 sm:block" >
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-500">
              Scanner
            </span>

            <QrCode class="h-5 w-5 text-emerald-400" />
          </div>

          <p class="mt-2 text-3xl font-bold text-white">
            QR
          </p>

          <p class="mt-1 text-xs text-slate-600">
            badges numériques
          </p>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mt-6 rounded border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300" >
        {{ error }}
      </div>

      <!-- Loading -->
      <div v-if="loading && personnels.length === 0" class="flex min-h-[300px] items-center justify-center" >
        <div class="text-center">
          <LoaderCircle class="mx-auto h-10 w-10 animate-spin text-indigo-500" />
          <p class="mt-4 text-sm text-slate-500">
            Chargement des membres...
          </p>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!loading && filteredPersonnels.length === 0"
        class="mt-6 rounded border border-white/10 bg-white/[0.03] p-12 text-center"
      >
        <Search class="mx-auto h-12 w-12 text-slate-700" />

        <h3 class="mt-4 font-semibold text-white">
          Aucun membre trouvé
        </h3>

        <p class="mt-2 text-sm text-slate-500">
          Essayez avec un autre nom, email ou numéro.
        </p>
      </div>

      <!-- Members -->
      <div v-else class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" >
        <PersonnelCard
          v-for="person in filteredPersonnels"
          :key="person.id"
          :person="person"
          @open="openPersonnel"
        />
      </div>
    </div>

    <!-- Scanner -->
    <ScanDialog
      :show="showScanner"
      @close="showScanner = false"
      @scanned="handleScanned"
    />

    <!-- Badge -->
    <BadgeDialog
      :show="showBadge"
      :qr-value="scannedValue"
      :personnel="selectedPersonnel"
      @close="closeBadge"
    />
  </div>
</template>
<script>
import { Search, QrCode, Users, RefreshCw, Mail, Phone, BriefcaseBusiness, User, LoaderCircle, Plus } from 'lucide-vue-next'

import ScanDialog from '@/components/scan_dialog.vue'
import BadgeDialog from '@/components/badge_dialog.vue'
import PersonnelCard from '@/components/PersonnelCard.vue'

export default {
  name: 'Badges',

  components: {
    Search,
    QrCode,
    Users,
    RefreshCw,
    Mail,
    Phone,
    BriefcaseBusiness,
    User,
    LoaderCircle,
    Plus,
    ScanDialog,
    BadgeDialog,
    PersonnelCard,
  },

  data() {
    return {
      personnels: [],
      search: '',
      loading: false,
      error: null,

      showScanner: false,
      showBadge: false,

      scannedValue: '',
      selectedPersonnel: null,
    }
  },
  computed: {
    filteredPersonnels() {
      const value = this.search.toLowerCase().trim()

      if (!value) {
        return this.personnels
      }

      return this.personnels.filter((person) => {
        return (
          person.nom?.toLowerCase().includes(value) ||
          person.prenom?.toLowerCase().includes(value) ||
          person.email?.toLowerCase().includes(value) ||
          person.telephone?.includes(value)
        )
      })
    },
  },
  methods: {
    headers() {
      
      let data = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.$store.state.user.access}`,
        },
      }
      console.log('Headers:', data)
      return data
    },
    loadPersonnels() {
      this.loading = true
      this.error = null
      axios.get('http://127.0.0.1:8000/personnel/personnels/', this.headers())
        .then((response) => {
          this.personnels = response.data.results
        })
        .catch((error) => {
          console.error(error)
          this.error = 'Impossible de charger les membres. Veuillez réessayer.'
          if (error.response && error.response.data.code === "token_not_valid") {
            localStorage.removeItem('user')
            this.$store.state.user = null
          }
        }).finally(() => {
          this.loading = false
        })
    },

    openScanner() {
      this.showScanner = true
    },

    handleScanned(value) {
      this.scannedValue = value
      this.selectedPersonnel = null

      this.showBadge = true
    },

    openPersonnel(person) {
      this.selectedPersonnel = person
      this.scannedValue = ''

      this.showBadge = true
    },

    closeBadge() {
      this.showBadge = false
      this.selectedPersonnel = null
      this.scannedValue = ''
    },
  },
  mounted() {
    this.loadPersonnels()
  },
}
</script>
