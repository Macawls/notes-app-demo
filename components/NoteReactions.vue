<template>
  <span v-if="data">
    <span
      v-for="reaction in reactions"
      :key="reaction.iconify_id"
      class="inline-flex items-center mr-2 animate-in zoom-in duration-300"
    >
      <Icon
        class="inline-block mr-1 text-xl"
        :name="reaction.iconify_id"
      ></Icon>
      <span
        :key="reaction.users.length"
        class="text-sm text-foreground animate-in zoom-in duration-200"
        >{{ reaction.users.length }}</span
      >
    </span>
  </span>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();
const { user } = useUser();

const props = defineProps<{
  noteId: string;
}>();

const { data } = await useAsyncData<ReactionsByNoteData>(
  `reactions-${props.noteId}`,
  () => $pb.collection("reactions_by_note").getOne(props.noteId),
  {
    pick: ["id", "reactions"],
  }
);

const reactions = computed(() => {
  if (!data.value) return undefined;
  return data.value?.reactions.sort((a, b) =>
    a.iconify_id.localeCompare(b.iconify_id)
  );
});

const { on } = useClientReactionBus();

const unsubscribe = on(({ iconify_id, noteId, type }) => {
  if (!user.value) return;
  if (!data.value) return;
  if (props.noteId !== noteId) return;

  const { name } = user.value;
  const copy = { ...data.value };

  const reaction = copy.reactions.find(
    (reaction) => reaction.iconify_id === iconify_id
  );

  if (type === "added") {
    if (reaction) {
      // Add to users for that emoji
      if (!reaction.users.includes(name)) {
        reaction.users = [...reaction.users, name];
      }
    } else {
      // No emoji already, create a new one
      copy.reactions.push({
        iconify_id: iconify_id,
        users: [name],
      });
    }
  }

  if (type === "removed") {
    if (reaction) {
      // Remove user from list
      reaction.users = reaction.users.filter((userName) => userName !== name);

      // Remove the reaction
      if (reaction.users.length === 0) {
        copy.reactions = copy.reactions.filter(
          (r) => r.iconify_id !== iconify_id
        );
      }
    }
  }

  data.value = copy;
});

onUnmounted(() => {
  unsubscribe();
});
</script>
