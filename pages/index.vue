<template>
    <div>
        <template v-for="note in notes">
            <div class="bg-secondary w-full">
                {{ note }}
            </div>
        </template>
        {{ user }}
        <ClientOnly>
            <template v-if="user">
                <Button class="fixed bottom-8 right-8 max-w-fit">
                    Create a note!
                    <Icon class="size-6" name="hugeicons:quill-write-01"
                /></Button>
            </template>
            <template v-else>
                <LoginPrompt>
                    <template #description>
                        Securely login with your social account to add a note!
                    </template>
                    <Button class="fixed bottom-8 right-8 max-w-fit">
                        Create a note!
                        <Icon
                            class="size-6"
                            name="hugeicons:quill-write-01" /></Button
                ></LoginPrompt>
            </template>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();

const { user } = useUser();

const { data: notes } = await useAsyncData(() =>
    $pb.collection("notes_view").getFullList(),
);
</script>
