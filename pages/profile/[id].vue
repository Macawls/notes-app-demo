<template>
  <div>
    {{ user }}
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const id = route.params.id as string;

const { data: user } = await useAsyncData(`user-${id}`, () =>
  useNuxtApp().$pb.collection("users").getOne(id)
);
</script>
