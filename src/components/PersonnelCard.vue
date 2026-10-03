<template>
  <div class="group overflow-hidden rounded border border-white/10 bg-white/3 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-indigo-500/5">
    <!-- Photo -->
    <div class="relative h-64 overflow-hidden bg-slate-900">
      <img
        v-if="person.photo"
        :src="person.photo"
        :alt="`${person.prenom} ${person.nom}`"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div v-else class="flex h-full items-center justify-center">
        <User class="h-20 w-20 text-slate-700" />
      </div>

      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

      <!-- QR -->
      <button
        @click="$emit('open', person)"
        class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded border border-white/10 bg-slate-950/70 text-white backdrop-blur-md transition hover:bg-indigo-500"
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
          <span class="truncate text-sm text-slate-400">
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
          <BriefcaseBusiness class="h-4 w-4 shrink-0 text-slate-500" />
          <span class="text-sm text-slate-400">
            Poste #{{ person.poste }}
          </span>
        </div>
      </div>

      <!-- Details -->
      <button
        @click="$emit('open', person)"
        class="mt-5 flex w-full items-center justify-center gap-2 rounded border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-slate-300 transition hover:border-indigo-500/30 hover:bg-indigo-500/10"
      >
        <QrCode class="h-4 w-4" />
        Voir le badge
      </button>
    </div>
  </div>
</template>

<script>
import { QrCode, Mail, Phone, BriefcaseBusiness, User } from 'lucide-vue-next'

export default {
  name: 'PersonnelCard',
  components: {
    QrCode,
    Mail,
    Phone,
    BriefcaseBusiness,
    User,
  },
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
}
</script>
