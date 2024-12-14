<template>
    <template v-if="user">
        <DropdownMenu>
            <DropdownMenuTrigger>
                <ProfileAvatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{{ user.name }}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>My Notes</DropdownMenuItem>
                <DropdownMenuItem @click="logout()">Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </template>
    <template v-else>
        <LoginPrompt>
            <template #description>
                Securely connect your social account to access your own profile!
            </template>
            <ProfileAvatar />
        </LoginPrompt>
    </template>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();
const { user, logout } = useUser();
</script>
