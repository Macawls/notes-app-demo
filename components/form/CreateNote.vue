<template>
  <form id="createNoteForm" @submit="onSubmit">
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
              v-for="color in colors"
              :key="color.id"
              type="button"
              variant="outline"
              :class="[
                'flex flex-col items-center justify-center w-full h-full p-2',
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
              <div class="text-xs capitalize text-center whitespace-normal">
                {{ color.name }}
              </div>
            </Button>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button
      form="createNoteForm"
      :disabled="!meta.valid || isSubmitting"
      type="submit"
      class="w-full mt-4"
    >
      {{ isSubmitting ? "Creating" : "Create" }}<IconLoader v-if="isSubmitting"
    /></Button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toast } from "@/components/ui/toast";

const { $pb } = useNuxtApp();

const { colors } = defineProps<{
  colors: {
    id: string;
    hex: string;
    name: string;
  }[];
}>();

const noteSchema = useNoteSchema({
  colorIds: colors.map((option) => option.id),
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

    useCreateNoteDialog().value = false;

    toast({
      title: "Shared note! 🥳",
      duration: 1600,
    });
  } catch (err) {
    toast({
      variant: "destructive",
      title: `${(err as any).status} Error`,
      description: (err as any).message,
      duration: 3000,
    });
  }
});
</script>
