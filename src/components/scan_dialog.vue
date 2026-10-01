<script>
// import { Html5Qrcode } from 'html5-qrcode'
import { X, Camera, LoaderCircle } from 'lucide-vue-next'

export default {
  name: 'ScanDialog',

  components: {
    X,
    Camera,
    LoaderCircle,
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close', 'scanned'],

  data() {
    return {
      scanner: null,
      loading: false,
      error: null,
      scanned: false,
    }
  },

  watch: {
    show(value) {
      if (value) {
        this.$nextTick(() => {
          this.startScanner()
        })
      } else {
        this.stopScanner()
      }
    },
  },

  beforeUnmount() {
    this.stopScanner()
  },

  methods: {
    async startScanner() {
      if (this.scanner) return

      this.loading = true
      this.error = null
      this.scanned = false

      try {
        this.scanner = new Html5Qrcode('qr-reader')

        await this.scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          async (decodedText) => {
            if (this.scanned) return

            this.scanned = true

            await this.stopScanner()

            this.$emit('scanned', decodedText)
            this.$emit('close')
          },
          () => {
            // Les erreurs de scan sont normales pendant la recherche
          },
        )
      } catch (error) {
        console.error(error)

        this.error =
          "Impossible d'accéder à la caméra. Vérifiez les permissions de votre navigateur."
      } finally {
        this.loading = false
      }
    },

    async stopScanner() {
      if (!this.scanner) return

      try {
        const state = this.scanner.getState()

        if (state === 2) {
          await this.scanner.stop()
        }

        this.scanner.clear()
      } catch (error) {
        console.error(error)
      }

      this.scanner = null
    },

    async close() {
      await this.stopScanner()
      this.$emit('close')
    },
  },
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        @click="close"
      ></div>

      <!-- Dialog -->
      <div
        class="relative w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-5 border-b border-white/10"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"
            >
              <Camera class="h-5 w-5" />
            </div>

            <div>
              <h2 class="text-lg font-semibold text-white">
                Scanner un badge
              </h2>

              <p class="text-sm text-slate-400">
                Placez le QR code devant la caméra
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="close"
            class="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Scanner -->
        <div class="p-6">
          <div
            class="relative overflow-hidden rounded-2xl bg-black min-h-[320px]"
          >
            <div
              v-if="loading"
              class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950"
            >
              <LoaderCircle
                class="h-10 w-10 animate-spin text-indigo-500"
              />

              <p class="mt-4 text-sm text-slate-400">
                Initialisation de la caméra...
              </p>
            </div>

            <div
              id="qr-reader"
              class="w-full"
            ></div>
          </div>

          <!-- Error -->
          <div
            v-if="error"
            class="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {{ error }}
          </div>

          <p class="mt-4 text-center text-xs text-slate-500">
            Autorisez l'accès à votre caméra pour scanner le badge.
          </p>
        </div>

        <!-- Footer -->
        <div class="px-6 pb-6">
          <button
            type="button"
            @click="close"
            class="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
#qr-reader {
  border: 0 !important;
}

#qr-reader__dashboard {
  display: none !important;
}

#qr-reader video {
  width: 100% !important;
  height: 320px !important;
  object-fit: cover;
}

#qr-reader__scan_region {
  border: 0 !important;
}
</style>
