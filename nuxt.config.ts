// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      pocketbase: "https://pb-notes.macawls.dev/",
    },
  },
  experimental: {
    payloadExtraction: true,
    componentIslands: true,
  },
  icon: {
    serverBundle: "remote",
  },
  // $development: {
  //   runtimeConfig: {
  //     public: {
  //       pocketbase: "http://127.0.0.1:8090/",
  //     },
  //   },
  // },
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
    "@vueuse/nuxt",
    "dayjs-nuxt",
  ],
  fonts: {
    provider: "google",
  },
});
