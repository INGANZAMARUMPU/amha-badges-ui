<template>
  <div class="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mx-auto max-w-7xl">

      <div
        class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-purple-600/10 p-6 sm:p-8"
      >
        <!-- Decoration -->
        <div
          class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
        ></div>

        <div
          class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400"
              >
                <Users class="h-6 w-6" />
              </div>

              <div>
                <p class="text-sm font-medium text-indigo-400">
                  Gestion du personnel
                </p>

                <h1
                  class="text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
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
          <button
            @click="openScanner"
            class="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 font-semibold text-white shadow-xl shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-[0.98]"
          >
            <QrCode
              class="h-5 w-5 transition group-hover:rotate-6"
            />

            Scanner un badge
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="mt-6 flex flex-col gap-4 sm:flex-row">

        <!-- Search -->
        <div class="relative flex-1">
          <Search
            class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
          />

          <input
            v-model="search"
            type="search"
            placeholder="Rechercher un membre..."
            class="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <!-- Refresh -->
        <button
          @click="loadPersonnels"
          :disabled="loading"
          class="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            :class="[
              'h-4 w-4',
              loading && 'animate-spin',
            ]"
          />

          Actualiser
        </button>
      </div>

      <!-- Stats -->
      <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div
          class="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
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

        <div
          class="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
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

        <div
          class="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:block"
        >
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
      <div
        v-if="error"
        class="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300"
      >
        {{ error }}
      </div>

      <!-- Loading -->
      <div
        v-if="loading && personnels.length === 0"
        class="flex min-h-[300px] items-center justify-center"
      >
        <div class="text-center">
          <LoaderCircle
            class="mx-auto h-10 w-10 animate-spin text-indigo-500"
          />

          <p class="mt-4 text-sm text-slate-500">
            Chargement des membres...
          </p>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!loading && filteredPersonnels.length === 0"
        class="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center"
      >
        <Search
          class="mx-auto h-12 w-12 text-slate-700"
        />

        <h3 class="mt-4 font-semibold text-white">
          Aucun membre trouvé
        </h3>

        <p class="mt-2 text-sm text-slate-500">
          Essayez avec un autre nom, email ou numéro.
        </p>
      </div>

      <!-- Members -->
      <div
        v-else
        class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
          v-for="person in filteredPersonnels"
          :key="person.id"
          class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-indigo-500/5"
        >
          <!-- Photo -->
          <div class="relative h-64 overflow-hidden bg-slate-900">
            <img
              v-if="person.photo"
              :src="person.photo"
              :alt="`${person.prenom} ${person.nom}`"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div
              v-else
              class="flex h-full items-center justify-center"
            >
              <User class="h-20 w-20 text-slate-700" />
            </div>

            <!-- Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"
            ></div>

            <!-- QR -->
            <button
              @click="openPersonnel(person)"
              class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-white backdrop-blur-md transition hover:bg-indigo-500"
              title="Voir le badge"
            >
              <QrCode class="h-5 w-5" />
            </button>

            <!-- Name -->
            <div class="absolute bottom-4 left-4">
              <h2 class="text-lg font-bold text-white">
                {{ person.prenom }} {{ person.nom }}
              </h2>

              <p class="text-xs text-slate-400">
                Personnel
              </p>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">

            <div class="space-y-3">

              <div class="flex items-center gap-3">
                <Mail class="h-4 w-4 shrink-0 text-slate-500" />

                <span
                  class="truncate text-sm text-slate-400"
                >
                  {{ person.email || 'Email non renseigné' }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <Phone class="h-4 w-4 shrink-0 text-slate-500" />

                <span class="text-sm text-slate-400">
                  {{ person.telephone || 'Téléphone non renseigné' }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <BriefcaseBusiness
                  class="h-4 w-4 shrink-0 text-slate-500"
                />

                <span class="text-sm text-slate-400">
                  Poste #{{ person.poste }}
                </span>
              </div>

            </div>

            <!-- Details -->
            <button
              @click="openPersonnel(person)"
              class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-slate-300 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
            >
              <QrCode class="h-4 w-4" />

              Voir le badge
            </button>
          </div>
        </div>
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
