<template>
  <form id="createNoteForm" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="content">
      <FormItem
        class="animate-in fade-in slide-in-from-bottom-4 duration-300"
        v-show="values.color"
      >
        <FormLabel>Note</FormLabel>
        <FormControl class="relative">
          <Textarea
            id="content"
            placeholder="What are you thinking about today?"
            class="resize-none text-black text-base"
            :style="{ backgroundColor: hexColor }"
            v-bind="componentField"
          >
          </Textarea>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="color">
      <FormItem
        class="animate-in fade-in slide-in-from-bottom-4 duration-300"
        v-show="!values.color"
      >
        <FormLabel>Color</FormLabel>
        <FormControl>
          <div class="grid grid-cols-3 gap-4">
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
                class="w-10 h-10 rounded-full"
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
    <div class="mt-4 space-y-4">
      <Button
        v-if="values.color"
        form="createNoteForm"
        :disabled="!meta.valid || isSubmitting"
        type="submit"
        class="w-full"
      >
        {{ isSubmitting ? "Creating" : "Create"
        }}<IconLoader v-if="isSubmitting"
      /></Button>
      <Button
        v-if="values.color"
        variant="secondary"
        :disabled="isSubmitting"
        @click="resetField('color')"
        type="submit"
        tabindex="-1"
        class="w-full"
      >
        Change Color</Button
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toast } from "@/components/ui/toast";
import { useField } from "vee-validate";

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

const { handleSubmit, values, setFieldValue, meta, isSubmitting, resetField } =
  useForm({
    validationSchema: noteSchema,
  });

const hexColor = computed(() => {
  if (!values.color) return undefined;
  return colors.find((e) => e.id === values.color)!.hex;
});

const { value } = useField("color");

watch(value, (val) => {
  if (val) {
    nextTick(() =>
      (document.querySelector("#content") as HTMLInputElement)?.focus()
    );
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await $pb.collection("notes").create({
      ...values,
      user: $pb.authStore.record!.id,
    });

    useDialogOpen().value = false;

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
