<template>
  <header
    class="bg-primary text-primary-foreground sticky top-0 z-30 shadow-sm"
  >
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <NuxtLink href="/" class="text-2xl font-bold">Notes Demo</NuxtLink>
      <nav class="gap-7 flex items-center mx-2">
        <UserMenu />
        <ClientOnly>
          <DarkModeSwitch />
          <template #fallback>
            <IconLoader />
          </template>
        </ClientOnly>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useUser();
</script>
