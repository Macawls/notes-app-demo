<template>
  <div class="inline-block">
    <span v-if="data">
      <span
        v-for="reaction in data.reactions"
        :key="reaction.iconify_id"
        class="inline-flex items-center mr-2"
      >
        <Icon
          class="inline-block mr-1 text-xl"
          :name="reaction.iconify_id"
        ></Icon>
        <span :key="reaction.users.length" class="text-sm text-foreground">{{
          reaction.users.length
        }}</span>
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();

const { user } = useUser();

const props = defineProps<{
  noteId: string;
}>();

const { data } = await useAsyncData<ReactionsByNoteData>(
  `reactions-${props.noteId}`,
  async () =>
    (await $pb.collection("reactions_by_note").getOne(props.noteId)) ||
    undefined,
  {
    pick: ["id", "reactions"],
  }
);

const { on } = useClientReactionBus();

const unsubscribe = on(({ iconify_id, noteId }) => {
  if (!user.value) return;
  if (!data.value) return;
  if (props.noteId !== noteId) return;

  const { name } = user.value;

  const copy = { ...data.value };

  const reaction = copy.reactions.find(
    (reaction) => reaction.iconify_id === iconify_id
  );

  if (reaction) {
    // add to users for that emoji
    if (!reaction.users.includes(name)) {
      reaction.users = [...reaction.users, name];
    }
  } else {
    // no emoji already, make new list
    copy.reactions.push({
      iconify_id: iconify_id,
      users: [name],
    });
  }

  data.value = copy;
});

onUnmounted(() => {
  unsubscribe();
});
</script>
