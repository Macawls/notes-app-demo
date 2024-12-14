<template>
    <Dialog>
        <DialogTrigger><slot></slot></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Sign in</DialogTitle>
                <DialogDescription>
                    <slot name="description">
                        Securely login with your social account
                    </slot>
                    <div class="mt-4 flex justify-center gap-6">
                        <Button
                            :key="authProvider.name"
                            v-for="authProvider in data?.oauth2.providers"
                            @click="loginWithOAuth2(authProvider.name)"
                            class="w-fit h-fit"
                        >
                            <Icon
                                :name="`mdi:${authProvider.name}`"
                                class="size-16"
                            />
                        </Button>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();

const { loginWithOAuth2 } = useUser();

const { data } = useLazyAsyncData(() =>
    $pb.collection("users").listAuthMethods(),
);

const loading = ref(false);
</script>
