import fs from 'fs/promises'
import path from 'path'

const DATA_FILE_PATH = process.env.DATA_FILE_PATH || './data/app-data.json'

/**
 * Initialise le fichier de données s'il n'existe pas
 */
async function initializeDataFile() {
  try {
    const dataPath = path.resolve(DATA_FILE_PATH)
    // Vérifier si le fichier existe
    await fs.access(dataPath)
  } catch (error) {
    // Le fichier n'existe pas, le créer avec des données par défaut
    console.log('Fichier app-data.json manquant, création automatique...')
    const initialData = {
      startDate: new Date().toISOString(),
      resets: []
    }
    const dataPath = path.resolve(DATA_FILE_PATH)
    await fs.mkdir(path.dirname(dataPath), { recursive: true })
    await fs.writeFile(dataPath, JSON.stringify(initialData, null, 2), 'utf-8')
    console.log('Fichier app-data.json créé avec succès avec la date de départ:', initialData.startDate)
  }
}

/**
 * Lit les données depuis le fichier JSON
 */
export async function readData() {
  try {
    // S'assurer que le fichier existe
    await initializeDataFile()
    
    const dataPath = path.resolve(DATA_FILE_PATH)
    const fileContent = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Erreur lors de la lecture des données:', error)
    // Retourner des données par défaut en dernier recours
    return {
      startDate: new Date().toISOString(),
      resets: []
    }
  }
}

/**
 * Écrit les données dans le fichier JSON
 */
export async function writeData(data) {
  try {
    const dataPath = path.resolve(DATA_FILE_PATH)
    // S'assurer que le dossier existe
    await fs.mkdir(path.dirname(dataPath), { recursive: true })
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Erreur lors de l\'écriture des données:', error)
    return false
  }
}

/**
 * Réinitialise le timer (ajoute un reset)
 */
export async function resetTimer(reason = '') {
  const data = await readData()
  const now = new Date().toISOString()
  
  // Ajouter l'ancien startDate aux resets
  if (data.startDate) {
    data.resets.push({
      startDate: data.startDate,
      endDate: now,
      reason: reason
    })
  }
  
  // Définir une nouvelle date de départ
  data.startDate = now
  
  await writeData(data)
  return data
}
