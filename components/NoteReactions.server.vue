<template>
  <div class="inline-block">
    <span v-if="data">
      <span
        v-for="reaction in (data.reactions as NoteReactions)"
        :key="reaction.iconify_id"
        class="inline-flex items-center mr-2"
      >
        <Icon
          class="inline-block mr-1 text-xl"
          :name="reaction.iconify_id"
          mode="svg"
        ></Icon>
        <span class="text-sm text-foreground">{{ reaction.users.length }}</span>
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
const { noteId } = defineProps<{
  noteId: string;
}>();

type NoteReactions = Array<{
  iconify_id: string;
  users: string[];
}>;

const { $pb } = useNuxtApp();
const { data } = await useAsyncData(() =>
  $pb.collection("reactions_by_note").getOne(noteId)
);
</script>
