// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false,

    timeline: {
      enabled: false
    }
  },
  build: {
    transpile:
        process.env.NODE_ENV === 'production'
            ? [
              'naive-ui',
              'vueuc',
              '@css-render/vue3-ssr',
            ]
            : [],
  }
})