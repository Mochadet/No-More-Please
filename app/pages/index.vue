<template>
  <div class="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
    <div class="w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6">
      <div class="text-center">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">{{ homeSentence }}</h2>
        
        <!-- Timer Display -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <!-- Jours -->
          <div class="flex flex-col items-center">
            <div class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tabular-nums">
              {{ days }}
            </div>
            <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 uppercase">
              Jours
            </div>
          </div>
          
          <!-- Heures -->
          <div class="flex flex-col items-center">
            <div class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tabular-nums">
              {{ hours }}
            </div>
            <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 uppercase">
              Heures
            </div>
          </div>
          
          <!-- Minutes -->
          <div class="flex flex-col items-center">
            <div class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tabular-nums">
              {{ minutes }}
            </div>
            <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 uppercase">
              Minutes
            </div>
          </div>
          
          <!-- Secondes -->
          <div class="flex flex-col items-center">
            <div class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tabular-nums">
              {{ seconds }}
            </div>
            <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 uppercase">
              Secondes
            </div>
          </div>
        </div>
        
        <!-- Date de départ -->
        <div class="mt-6 sm:mt-8 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Depuis le : <span class="font-semibold">{{ startDate }}</span>
        </div>
      </div>
    </div>
    
    <!-- Bouton J'ai craqué -->
    <div class="w-full mx-auto mt-4 sm:mt-6">
      <button 
        @click="showReasonDialog = true"
        :disabled="isResetting"
        class="w-full px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isResetting ? 'Réinitialisation...' : 'J\'ai craqué' }}
      </button>
    </div>

    <!-- Dialog pour demander la raison -->
    <div v-if="showReasonDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="showReasonDialog = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Que s'est-il passé ?
        </h3>
        <textarea
          v-model="resetReason"
          placeholder="Décris ce qui s'est passé..."
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          rows="4"
          @keydown.esc="showReasonDialog = false"
        ></textarea>
        <div class="flex gap-3 mt-4">
          <button
            @click="showReasonDialog = false"
            class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="handleReset"
            :disabled="isResetting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isResetting ? 'En cours...' : 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Configuration
const config = useRuntimeConfig()
const homeSentence = config.public.homeSentence

// État
const data = ref(null)
const currentTime = ref(new Date())
let intervalId = null

// Récupérer les données au chargement
const { data: appData } = await useFetch('/api/data')
data.value = appData.value

// Mettre à jour l'heure actuelle chaque seconde
onMounted(() => {
  intervalId = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Calculer le temps écoulé
const timeElapsed = computed(() => {
  if (!data.value || !data.value.startDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const start = new Date(data.value.startDate)
  const now = currentTime.value
  const diffMs = now - start
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
  
  return { days, hours, minutes, seconds }
})

// Formater les valeurs pour l'affichage (avec padding)
const days = computed(() => String(timeElapsed.value.days).padStart(2, '0'))
const hours = computed(() => String(timeElapsed.value.hours).padStart(2, '0'))
const minutes = computed(() => String(timeElapsed.value.minutes).padStart(2, '0'))
const seconds = computed(() => String(timeElapsed.value.seconds).padStart(2, '0'))

// Formater la date de départ
const startDate = computed(() => {
  if (!data.value || !data.value.startDate) {
    return 'N/A'
  }
  
  const date = new Date(data.value.startDate)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
})

// Fonction pour réinitialiser le timer
const isResetting = ref(false)
const showReasonDialog = ref(false)
const resetReason = ref('')

const handleReset = async () => {
  if (isResetting.value) return
  
  isResetting.value = true
  try {
    const response = await $fetch('/api/reset', { 
      method: 'POST',
      body: { reason: resetReason.value }
    })
    if (response.success) {
      data.value = response.data
      showReasonDialog.value = false
      resetReason.value = ''
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
  } finally {
    isResetting.value = false
  }
}
</script>