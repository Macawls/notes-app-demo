<template>
  <Dialog v-model:open="open">
    <div
      ref="notesContainer"
      class="space-y-2 max-h-[80vh] overflow-y-auto scrollbar-hide"
    >
      <Note
        v-for="note in notes?.items"
        :key="note.id"
        :note-id="note.id"
        :color="colorOptionsMap[note.color]?.hex"
        :content="note.content"
        :user-id="note.user"
        :created="note.created"
      />
      <div v-if="isLoading" class="flex justify-center py-4">
        <IconLoader variant="medium" />
      </div>
    </div>
    <DialogTrigger as-child>
      <Button class="fixed bottom-8 right-8 max-w-fit z-50">
        Share Note
        <Icon class="size-6" name="hugeicons:quill-write-01" />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <template v-if="user">
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Fill in the form below to share your note with everyone!
          </DialogDescription>
        </DialogHeader>
        <FormCreateNote v-if="colorOptions" :colors="colorOptions" />
      </template>
      <template v-else>
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Share what's on your mind by selecting a social account
          </DialogDescription>
          <Login class="mt-2" />
        </DialogHeader>
      </template>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import type { ListResult } from "pocketbase";
import {
  type NotesResponse,
  type ColorsResponse,
  type ReactionsByNoteResponse,
} from "~/types/pocketbase";

const { $pb } = useNuxtApp();
const { user } = useUser();
const open = useDialogOpen();
const { data: colorOptions } = await useAsyncData(() =>
  $pb.collection("colors").getFullList()
);

type NotesWithColor = NotesResponse<{
  color: ColorsResponse;
}>;

const notesContainer = ref(null);
const isLoading = ref(false);
const hasMore = ref(true);
const page = ref(1);

const fetchNotes = () =>
  $pb.collection("notes").getList<NotesWithColor>(page.value, 8, {
    expand: "color",
    sort: "-created",
  });

const { data: notes, refresh } =
  await useAsyncData<ListResult<NotesWithColor> | null>("notes", () =>
    fetchNotes()
  );

useInfiniteScroll(
  notesContainer,
  async () => {
    if (!hasMore.value || isLoading.value) return;
    isLoading.value = true;

    try {
      page.value++;
      const res = await fetchNotes();

      notes.value = notes.value
        ? {
            ...notes.value,
            items: [...notes.value.items, ...res.items],
            totalItems: res.totalItems,
            totalPages: res.totalPages,
            page: res.page,
          }
        : res;

      hasMore.value = res.totalItems > (notes.value?.items.length ?? 0);
    } catch (error) {
      console.error("Error fetching notes:", error);
      page.value--;
    } finally {
      isLoading.value = false;
    }
  },
  { distance: 20 }
);

const colorOptionsMap = computed(() => {
  return !colorOptions.value
    ? {}
    : colorOptions.value.reduce((map, e) => {
        map[e.id] = { ...e };
        return map;
      }, {} as Record<string, ColorsResponse>);
});

onMounted(async () => {
  $pb.collection("notes").subscribe("*", ({ action, record }) => {
    if (!notes.value) return;

    if (action === "create") {
      notes.value.items.unshift({
        ...record,
        expand: {
          color: colorOptionsMap.value[record.color],
        },
      });
    }

    if (action === "delete") {
      notes.value.items = notes.value.items.filter(
        (note) => note.id !== record.id
      );
    }
  });

  $pb
    .collection("note_reactions")
    .subscribe("*", async ({ action, record }) => {
      if (!notes.value) return;

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

            if (data.value) {
              data.value = {
                id: result.id,
                reactions: result.reactions as ReactionData[],
              };
            }
          }
        } catch (err) {
          console.error("Error updating reactions:", err);
        }
      }
    });
});

onUnmounted(() => {
  $pb.collection("notes").unsubscribe("*");
  $pb.collection("note_reactions").unsubscribe("*");
});
</script>
