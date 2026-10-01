<script>
import {
  X,
  User,
  Mail,
  Phone,
  BriefcaseBusiness,
  LoaderCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-vue-next'

export default {
  name: 'BadgeDialog',

  components: {
    X,
    User,
    Mail,
    Phone,
    BriefcaseBusiness,
    LoaderCircle,
    ShieldCheck,
    AlertCircle,
  },

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

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/personnel/personnels/${id}/`,
        )

        if (!response.ok) {
          throw new Error('Personnel introuvable')
        }

        this.person = await response.json()
      } catch (error) {
        console.error(error)

        this.error =
          "Impossible de récupérer les informations du personnel."
      } finally {
        this.loading = false
      }
    },

    close() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[110] flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        @click="close"
      ></div>

      <div
        class="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-white/10 px-6 py-5"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"
            >
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

          <button
            @click="close"
            class="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center p-12"
        >
          <LoaderCircle
            class="h-10 w-10 animate-spin text-indigo-500"
          />

          <p class="mt-4 text-sm text-slate-400">
            Vérification du badge...
          </p>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="p-6"
        >
          <div
            class="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center"
          >
            <AlertCircle
              class="mx-auto h-10 w-10 text-red-400"
            />

            <h3 class="mt-3 font-semibold text-white">
              Badge non trouvé
            </h3>

            <p class="mt-2 text-sm text-red-300">
              {{ error }}
            </p>
          </div>

          <button
            @click="close"
            class="mt-5 w-full rounded-xl bg-white/5 py-3 text-sm text-slate-300 hover:bg-white/10"
          >
            Fermer
          </button>
        </div>

        <!-- Personnel -->
        <div
          v-else-if="person"
          class="p-6"
        >
          <!-- Photo -->
          <div class="flex justify-center">
            <div
              class="h-28 w-28 overflow-hidden rounded-full border-4 border-indigo-500/20 bg-slate-800 shadow-xl"
            >
              <img
                v-if="person.photo"
                :src="person.photo"
                :alt="`${person.prenom} ${person.nom}`"
                class="h-full w-full object-cover"
              />

              <div
                v-else
                class="flex h-full w-full items-center justify-center text-slate-500"
              >
                <User class="h-12 w-12" />
              </div>
            </div>
          </div>

          <!-- Name -->
          <div class="mt-5 text-center">
            <h3 class="text-2xl font-bold text-white">
              {{ person.prenom }} {{ person.nom }}
            </h3>

            <p class="mt-1 text-sm text-indigo-400">
              Personnel #{{ person.id.slice(0, 8) }}
            </p>
          </div>

          <!-- Details -->
          <div class="mt-6 space-y-3">
            <div
              class="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4"
            >
              <Mail class="h-5 w-5 text-indigo-400" />

              <div>
                <p class="text-xs text-slate-500">
                  Email
                </p>

                <p class="text-sm text-slate-200">
                  {{ person.email || 'Non renseigné' }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4"
            >
              <Phone class="h-5 w-5 text-emerald-400" />

              <div>
                <p class="text-xs text-slate-500">
                  Téléphone
                </p>

                <p class="text-sm text-slate-200">
                  {{ person.telephone || 'Non renseigné' }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4"
            >
              <BriefcaseBusiness class="h-5 w-5 text-purple-400" />

              <div>
                <p class="text-xs text-slate-500">
                  Poste
                </p>

                <p class="text-sm text-slate-200">
                  {{ person.poste || 'Non renseigné' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Close -->
          <button
            @click="close"
            class="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-purple-500"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
