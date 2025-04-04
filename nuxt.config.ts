// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@prisma/nuxt',
    '@unocss/nuxt',
    'v-gsap-nuxt',
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
  ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
    },
    supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
    databaseUrl: process.env.POSTGRES_PRISMA_URL,
    postgresUser: process.env.POSTGRES_USER,
  },
  prisma: {
    autoSetupPrisma: true,
  },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: 'http://localhost:3000/api/auth',
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: '',
      addDefaultCallbackUrl: '/',
    },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    }
  }
});
