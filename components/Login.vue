<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-flow-row gap-6 mx-auto">
    <template v-if="providers">
      <template v-for="provider in providers">
        <Button
          :key="provider"
          v-if="!filteredProviders.includes(provider)"
          @click="
            () => {
              useDialogOpen().value = false;
              loginWithOAuth2(provider);
            }
          "
          class="w-fit h-fit p-4"
        >
          <Icon :name="iconMap[provider]" class="size-16" />
        </Button>
      </template>
    </template>
    <IconLoader v-else variant="large" />
  </div>
</template>

<script setup lang="ts">
const { data } = useLazyAsyncData(() =>
  useNuxtApp().$pb.collection("users").listAuthMethods()
);
const { loginWithOAuth2 } = useUser();

const providers = computed(() => {
  if (!data.value) return undefined;
  return data.value.oauth2.providers.map((e) => e.name);
});

withDefaults(
  defineProps<{
    filteredProviders?: string[];
  }>(),
  {
    filteredProviders: () => [],
  }
);

const iconMap: Record<string, string> = {
  google: "logos:google-icon",
  discord: "logos:discord-icon",
  github: "cib:github",
};
</script>
