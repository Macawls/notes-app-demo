<template>
  <div>
    <Header />
    <main class="container mx-auto px-4 py-8 max-w-xl">
      <Suspense>
        <slot></slot>
        <template #fallback>
          <IconLoader variant="large" />
        </template>
      </Suspense>
    </main>
  </div>
</template>
