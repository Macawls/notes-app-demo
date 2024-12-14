<template>
    <header class="bg-primary text-primary-foreground">
        <div
            class="container mx-auto px-4 py-4 flex justify-between items-center"
        >
            <NuxtLink href="/" class="text-2xl font-bold">Notes Demo</NuxtLink>
            <nav class="gap-6 flex items-center">
                <ProfileDropdown />
                <ClientOnly>
                    <DarkModeSwitch />
                    <template #fallback>
                        <IconLoaderSmall />
                    </template>
                </ClientOnly>
            </nav>
        </div>
    </header>
</template>
