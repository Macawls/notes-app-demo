<template>
  <div
    v-if="providers"
    class="gap-8 justify-center items-center mx-auto"
    :class="[providers.length === 1 ? 'flex' : 'grid grid-cols-2 md:flex']"
  >
    <Button
      v-for="provider in providers"
      :key="provider"
      @click="
        () => {
          useDialogOpen().value = false;
          loginWithOAuth2(provider);
        }
      "
      class="w-fit h-fit p-4"
    >
      <Icon :name="providerIconMap[provider]" class="size-16" />
    </Button>
  </div>
  <IconLoader class="mx-auto" v-else variant="large" />
</template>

<script setup lang="ts">
const { data } = useLazyAsyncData(() =>
  useNuxtApp().$pb.collection("users").listAuthMethods()
);
const { loginWithOAuth2 } = useUser();

const { providerIconMap } = useAppConfig();

const { exclusionList } = withDefaults(
  defineProps<{
    exclusionList?: string[];
  }>(),
  {
    exclusionList: () => [],
  }
);

const providers = computed(() => {
  if (!data.value) return undefined;
  return data.value.oauth2.providers
    .map((e) => e.name)
    .filter((provider) => !exclusionList.includes(provider));
});
</script>
