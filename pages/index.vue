<template>
  <div class="space-y-4">
    <Note
      :key="note.id"
      v-for="note in publicNotes"
      :color="colorOptionsMap[note.color].hex"
      :content="note.content"
      :user-id="note.user"
    />
  </div>
  <ClientOnly>
    <template v-if="user">
      <Dialog>
        <DialogTrigger as-child>
          <Button class="fixed bottom-8 right-8 max-w-fit z-50">
            Create a note!
            <Icon class="size-6" name="hugeicons:quill-write-01" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create note</DialogTitle>
            <DialogDescription>
              Fill in the form below to share your note with everyone!
            </DialogDescription>
          </DialogHeader>
          <form @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="content">
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What are you thinking about today?"
                    class="resize-none"
                    v-bind="componentField"
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="color">
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
                        'w-full h-fit p-2 flex flex-col items-center justify-center',
                        values.color === color.id ? 'ring-2 ring-primary' : '',
                      ]"
                      @click="setFieldValue('color', color.id)"
                    >
                      <div
                        class="w-8 h-8 rounded-full mb-1"
                        :style="{
                          backgroundColor: color.hex,
                        }"
                      ></div>
                      <span class="text-xs capitalize">{{ color.name }}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button :disabled="!meta.valid" type="submit" class="w-full mt-4">
              {{ isSubmitting ? "Creating" : "Create"
              }}<IconLoaderSmall v-if="isSubmitting"
            /></Button>
          </form>
        </DialogContent>
      </Dialog>
    </template>
    <template v-else>
      <LoginPrompt>
        <template #description>
          Securely login with a social account to add a note!
        </template>
        <Button class="fixed bottom-8 right-8 max-w-fit z-50">
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
import { type NotesResponse, type ColorsResponse } from "~/types/pocketbase";

const { $pb } = useNuxtApp();
const { user } = useUser();

const { data: colorOptions } = await useAsyncData(() =>
  $pb.collection("colors").getFullList()
);

const { data: publicNotes } = await useAsyncData(() =>
  $pb.collection("notes").getFullList<
    NotesResponse<{
      color: ColorsResponse;
    }>
  >({
    expand: "color",
    sort: "-created",
  })
);

const colorOptionsMap = computed(() => {
  if (!colorOptions.value) return {};
  return colorOptions.value.reduce((map, e) => {
    map[e.id] = { ...e };
    return map;
  }, {} as Record<string, ColorsResponse>);
});

const noteSchema = useNoteSchema({
  colorIds: colorOptions.value
    ? colorOptions.value.map((option) => option.id)
    : [],
});

const { handleSubmit, values, setFieldValue, meta, isSubmitting } = useForm({
  validationSchema: noteSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await $pb.collection("notes").create({
      ...values,
      user: $pb.authStore.record!.id,
    });

    toast({
      title: "Shared note! 🥳",
    });
  } catch (err) {
    toast({
      variant: "destructive",
      title: `${(err as any).status} Error`,
      description: (err as any).message,
      duration: 2000,
    });
  }
});
</script>
