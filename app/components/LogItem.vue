<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Informations de la période -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Période #{{ periodNumber }}
        </h3>
        <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span class="font-medium">Début :</span> 
            {{ formatDate(reset.startDate) }}
          </p>
          <p>
            <span class="font-medium">Fin :</span> 
            {{ formatDate(reset.endDate) }}
          </p>
          <p>
            <span class="font-medium">Durée :</span> 
            {{ duration }}
          </p>
          <p v-if="reset.reason" class="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            <span class="font-medium">Ce qui s'est passé :</span><br>
            <span class="text-gray-700 dark:text-gray-300 italic">"{{ reset.reason }}"</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  reset: {
    type: Object,
    required: true
  },
  periodNumber: {
    type: Number,
    required: true
  }
})

// Formater une date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Calculer la durée
const duration = computed(() => {
  const start = new Date(props.reset.startDate)
  const end = new Date(props.reset.endDate)
  const diffMs = end - start
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days}j ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
})
</script>
