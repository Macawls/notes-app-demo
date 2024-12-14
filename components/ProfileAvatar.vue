<template>
    <Avatar>
        <ClientOnly>
            <AvatarImage
                :src="
                    user
                        ? $pb.files.getURL(user, user.avatar)
                        : 'https://vercel.com/api/www/avatar?u=rauchg&s=64'
                "
                alt="user-profile-image"
            />
            <template #fallback><AvatarFallback>CN</AvatarFallback></template>
        </ClientOnly>
    </Avatar>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();
const { user } = useUser();
</script>
