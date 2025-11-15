<template>
  <div class="min-h-screen p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-4xl mx-auto">
      <!-- Titre -->
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
        Historique des périodes
      </h1>

      <!-- Statistiques (épinglées en haut) -->
      <div v-if="resets && resets.length > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Statistiques
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {{ resets.length }}
            </p>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tentatives
            </p>
          </div>
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {{ longestStreak }}
            </p>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Record
            </p>
          </div>
          <div class="text-center col-span-2 sm:col-span-1">
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {{ averageDuration }}
            </p>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Durée moyenne
            </p>
          </div>
        </div>
      </div>

      <!-- Message si aucun log -->
      <div v-if="!resets || resets.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Aucune période enregistrée pour le moment.
        </p>
        <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Continue à résister ! 💪
        </p>
      </div>

      <!-- Liste des logs (défilable) -->
      <div v-else class="pr-2">
        <LogItem 
          v-for="(reset, index) in resets" 
          :key="index"
          :reset="reset"
          :period-number="resets.length - index"
          class="mb-6"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Récupérer les données
const { data: appData } = await useFetch('/api/data')
const resets = computed(() => {
  if (!appData.value || !appData.value.resets) return []
  // Inverser pour afficher les plus récents en premier
  return [...appData.value.resets].reverse()
})

// Calculer le record (plus longue période)
const longestStreak = computed(() => {
  if (!appData.value || !appData.value.resets || appData.value.resets.length === 0) {
    return 'N/A'
  }
  
  let maxDuration = 0
  appData.value.resets.forEach(reset => {
    const start = new Date(reset.startDate)
    const end = new Date(reset.endDate)
    const duration = end - start
    if (duration > maxDuration) {
      maxDuration = duration
    }
  })
  
  const days = Math.floor(maxDuration / (1000 * 60 * 60 * 24))
  const hours = Math.floor((maxDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `${days}j ${hours}h`
  } else {
    return `${hours}h`
  }
})

// Calculer la durée moyenne
const averageDuration = computed(() => {
  if (!appData.value || !appData.value.resets || appData.value.resets.length === 0) {
    return 'N/A'
  }
  
  let totalDuration = 0
  appData.value.resets.forEach(reset => {
    const start = new Date(reset.startDate)
    const end = new Date(reset.endDate)
    totalDuration += (end - start)
  })
  
  const avgDuration = totalDuration / appData.value.resets.length
  const days = Math.floor(avgDuration / (1000 * 60 * 60 * 24))
  const hours = Math.floor((avgDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `${days}j ${hours}h`
  } else {
    return `${hours}h`
  }
})
</script>

