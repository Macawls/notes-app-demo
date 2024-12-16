<template>
  <Dialog v-model:open="open">
    <div class="space-y-3">
      <Note
        :note-id="note.id"
        :key="note.id"
        v-for="note in publicNotes"
        :color="colorOptionsMap[note.color].hex"
        :content="note.content"
        :user-id="note.user"
        :created="note.created"
      />
    </div>
    <DialogTrigger as-child>
      <Button class="fixed bottom-8 right-8 max-w-fit z-50">
        Create a note!
        <Icon class="size-6" name="hugeicons:quill-write-01" />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <template v-if="user">
        <DialogHeader>
          <DialogTitle>Create note</DialogTitle>
          <DialogDescription>
            Fill in the form below to share your note with everyone!
          </DialogDescription>
        </DialogHeader>
        <FormCreateNote v-if="colorOptions" :colors="colorOptions" />
      </template>
      <template v-else>
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription
            >Share what's on your mind by selecting a social
            account</DialogDescription
          >
          <Login />
        </DialogHeader>
      </template>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  type NotesResponse,
  type ColorsResponse,
  type ReactionsByNoteResponse,
} from "~/types/pocketbase";

const { $pb } = useNuxtApp();
const { user } = useUser();

const open = useCreateNoteDialog();

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
  return !colorOptions.value
    ? {}
    : colorOptions.value.reduce((map, e) => {
        map[e.id] = { ...e };
        return map;
      }, {} as Record<string, ColorsResponse>);
});

onMounted(() => {
  $pb.collection("notes").subscribe("*", ({ action, record }) => {
    if (!publicNotes.value) return;

    if (action === "create") {
      publicNotes.value.unshift({
        ...record,
        expand: {
          color: colorOptionsMap.value[record.color],
        },
      });
    }

    if (action === "delete") {
      publicNotes.value = publicNotes.value.filter(
        (note) => note.id !== record.id
      );
    }
  });

  $pb
    .collection("note_reactions")
    .subscribe("*", async ({ action, record }) => {
      if (action === "create" || action === "delete") {
        try {
          const result = await $pb
            .collection<ReactionsByNoteResponse>("reactions_by_note")
            .getOne(record.note);

          if (result) {
            // update store
            const { data } = useNuxtData<ReactionsByNoteData>(
              `reactions-${record.note}`
            );

            data.value = {
              id: result.id,
              reactions: result.reactions as ReactionData[],
            };
          }
        } catch (err) {}
      }
    });
});

onUnmounted(() => {
  $pb.collection("notes").unsubscribe("*");
  $pb.collection("note_reactions").unsubscribe("*");
});
</script>
