import { readData } from '../utils/dataStore.js'

export default defineEventHandler(async (event) => {
  const data = await readData()
  return data
})
