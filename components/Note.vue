<template>
  <div
    class="p-6 rounded-lg text-gray-900 relative pr-20 shadow-md"
    :style="{ backgroundColor: color }"
  >
    {{ content }}
    <div v-if="user" class="absolute bottom-2 right-4 z-10 text-sm">
      ~ {{ user.name }}
      <Avatar>
        <AvatarImage :src="$pb.files.getURL(user, user.avatar)" />
        <AvatarFallback>{{ user.name }}</AvatarFallback>
      </Avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
const { userId } = defineProps<{
  content: string;
  color: string;
  userId: string;
}>();

const { $pb } = useNuxtApp();
const { data: user, execute } = useLazyAsyncData(`user-${userId}`, () =>
  $pb.collection("users").getOne(userId)
);

onMounted(() => {
  execute();
});
</script>
