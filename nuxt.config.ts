import tailwindcss from "@tailwindcss/vite";
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    public: {
      homeSentence: process.env.HOME_SENTENCE || 'Tu as résisté pendant :',
    },
  },

  modules: ["@kgierke/nuxt-basic-auth"],
  basicAuth: {
    enabled: true,
    users: [
      {
        username: process.env.AUTH_USERNAME,
        password: process.env.AUTH_PASSWORD,
      },
    ],
  },
});