import { resetTimer } from '../utils/dataStore.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const reason = body?.reason || ''
  
  const data = await resetTimer(reason)
  return {
    success: true,
    data
  }
})
