<template>
    <div
        v-for="note in publicNotes"
        :key="note.id"
        class="bg-secondary w-full p-4 mb-4 rounded-lg"
    >
        {{ note.content }}
        <div
            class="w-4 h-4 rounded-full inline-block ml-2"
            :style="{ backgroundColor: note.color.hex }"
        ></div>
    </div>
    <ClientOnly>
        <template v-if="user">
            <Dialog>
                <DialogTrigger as-child>
                    <Button class="fixed bottom-8 right-8 max-w-fit">
                        Create a note!
                        <Icon class="size-6" name="hugeicons:quill-write-01" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create note</DialogTitle>
                        <DialogDescription>
                            Fill in the form below to share your note with
                            everyone!
                        </DialogDescription>
                    </DialogHeader>
                    <Form
                        v-slot="{ handleSubmit }"
                        as=""
                        :validation-schema="noteSchema"
                        @submit="onSubmit"
                    >
                        <FormField v-slot="{ componentField }" name="content">
                            <FormItem>
                                <FormLabel>Note</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="What are you thinking about today?"
                                        class="resize-none"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="color">
                            <FormItem>
                                <FormLabel>Color</FormLabel>

                                <FormControl>
                                    <div class="grid grid-cols-4 gap-2">
                                        <Button
                                            v-for="color in colorOptions"
                                            :key="color.id"
                                            type="button"
                                            variant="outline"
                                            :class="[
                                                'p-0 w-full h-fit p-2 flex flex-col items-center justify-center',
                                                selectedColor === color.id
                                                    ? 'ring-2 ring-primary'
                                                    : '',
                                            ]"
                                            @click="selectedColor = color.id"
                                        >
                                            <div
                                                class="w-8 h-8 rounded-full mb-1"
                                                :style="{
                                                    backgroundColor: color.hex,
                                                }"
                                            ></div>
                                            <span class="text-xs capitalize">{{
                                                color.name
                                            }}</span>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <Button type="submit" class="w-full mt-4"
                            >Create Note</Button
                        >
                    </Form>
                </DialogContent>
            </Dialog>
        </template>
        <template v-else>
            <LoginPrompt>
                <template #description>
                    Securely login with a social account to add a note!
                </template>
                <Button class="fixed bottom-8 right-8 max-w-fit">
                    Create a note!
                    <Icon class="size-6" name="hugeicons:quill-write-01" />
                </Button>
            </LoginPrompt>
        </template>
    </ClientOnly>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toast } from "@/components/ui/toast";

const { $pb } = useNuxtApp();
const { user } = useUser();

const { data: colorOptionsData } = await useAsyncData(() =>
    $pb.collection("colors").getFullList(),
);

const { data: publicNotes } = await useAsyncData(() =>
    $pb.collection("notes").getFullList(),
);

const colorOptions = computed(() => {
    if (!colorOptionsData.value) return [];
    return colorOptionsData.value.map((e) => ({
        id: e.id,
        name: e.name,
        hex: e.hex,
    }));
});

const selectedColor = ref("");

const noteSchema = useNoteSchema({
    colorIds: colorOptions.value.map((option) => option.id),
});

const { handleSubmit } = useForm({
    validationSchema: noteSchema,
});

const onSubmit = handleSubmit(async (values) => {
    if (selectedColor.value) {
        values.color = selectedColor.value;
    }

    toast({
        title: "Shared note successfully!",
    });

    await $pb.collection("notes").create(values);
});
</script>
