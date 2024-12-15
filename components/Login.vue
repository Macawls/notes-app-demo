<template>
  <div class="mt-4 flex justify-center gap-6">
    <template v-if="data">
      <Button
        :key="authProvider.name"
        v-for="authProvider in data?.oauth2.providers"
        @click="loginWithOAuth2(authProvider.name)"
        class="w-fit h-fit"
      >
        <Icon :name="`mdi:${authProvider.name}`" class="size-16" />
      </Button>
    </template>
    <template v-else>
      <IconLoader variant="large" />
    </template>
  </div>
</template>

<script setup lang="ts">
const { data } = useLazyAsyncData(() =>
  useNuxtApp().$pb.collection("users").listAuthMethods()
);
const { loginWithOAuth2 } = useUser();
</script>
