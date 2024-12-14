// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      pocketbase: "https://pb-notes.macawls.dev/",
    },
  },
  icon: {
    serverBundle: "remote",
  },
  colorMode: {
    preference: "system",
    classSuffix: "",
    fallback: "light",
  },
  modules: [
    "@nuxtjs/mdc",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "@nuxt/fonts",
  ],
  fonts: {
    provider: "google",
  },
});
