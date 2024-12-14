<template>
    <template v-if="user">
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <ProfileAvatar />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{{ user.name }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>My Notes</DropdownMenuItem>
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign out</DialogTitle>
                    <DialogDescription>
                        <div class="mt-2">
                            <p>We're sad to see you go 😞</p>
                            <p>
                                Are you sure you want to log out,
                                {{ user.name }}?
                            </p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button @click="logout()" variant="secondary"
                        >Log out</Button
                    >
                    <DialogClose as-child>
                        <Button>Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </template>
    <template v-else>
        <LoginPrompt>
            <template #description>
                Securely log in with a social account to access your profile!
            </template>
            <ProfileAvatar />
        </LoginPrompt>
    </template>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();
const { user, logout } = useUser();
</script>
