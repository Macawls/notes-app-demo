<template>
  <Sheet>
    <div
      class="flex gap-3 relative max-w-full animate-in fade-in duration-500 slide-in-from-bottom-8"
    >
      <div v-if="noteUser">
        <NuxtLink :to="`user/${noteUser.id}`">
          <Avatar class="size-9 flex-shrink-0">
            <AvatarImage
              :src="$pb.files.getURL(noteUser, noteUser.avatar)"
              :alt="noteUser.name"
            />
            <AvatarFallback>{{ noteUser.name }}</AvatarFallback>
          </Avatar>
        </NuxtLink>
      </div>
      <div class="flex-grow flex flex-col overflow-hidden">
        <div class="flex items-center gap-1 flex-wrap">
          <div v-if="noteUser" class="font-medium">{{ noteUser.name }}</div>
          <div class="text-xs italic">
            {{ "~ " + $dayjs(created).utc().fromNow() }}
          </div>
        </div>
        <div
          :style="{ backgroundColor: color }"
          class="shadow-sm p-3 relative text-black rounded-tr-md rounded-br-md rounded-bl-md break-words"
        >
          {{ content }}
        </div>
        <div class="flex justify-between w-full items-center mt-2 gap-4">
          <NoteReactions :key="noteId" :note-id="noteId" />
          <ClientOnly>
            <SheetTrigger as-child>
              <div class="h-8 w-8 flex items-center justify-center">
                <Button
                  @click="() => fetchReactions()"
                  class="h-8 w-8 p-0 flex items-center justify-center disabled:text-transparent"
                  :disabled="!(noteUser && user && user.id !== noteUser.id)"
                  variant="ghost"
                >
                  <Icon class="h-5 w-5" name="codicon:reactions" />
                </Button>
              </div>
            </SheetTrigger>
          </ClientOnly>
        </div>
      </div>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Pick an Emoji</SheetTitle>
          <SheetDescription>
            <template v-if="reactionOptions">
              React to {{ noteUser!.name + `'s` }} note with an emoji
              <div class="flex gap-4 my-8">
                <img
                  class="rounded-full shadow-md object-cover size-14"
                  v-if="noteUser"
                  :src="$pb.files.getURL(noteUser, noteUser.avatar)"
                  :alt="noteUser.name"
                />
                <div class="flex flex-col overflow-hidden max-w-md">
                  <div
                    :style="{ backgroundColor: color }"
                    class="shadow-sm p-3 relative text-black rounded-md break-words text-base"
                  >
                    {{ content }}
                  </div>
                </div>
              </div>
              <div
                class="grid gap-6 grid-cols-3 sm:grid-cols-4 md:flex md:flex-row w-fit"
              >
                <template v-for="reaction in reactionOptions">
                  <SheetClose as-child>
                    <Button
                      :key="reaction.id"
                      type="submit"
                      variant="ghost"
                      :disabled="hasReactedWithEmoji(reaction.iconify_id)"
                      class="flex flex-col items-center justify-center h-24 w-24 p-2 disabled:grayscale"
                      @click="addReaction(reaction.id)"
                    >
                      <Icon class="h-10 w-10" :name="reaction.iconify_id" />
                    </Button>
                  </SheetClose>
                </template>
              </div>
            </template>
            <template v-else>
              <IconLoader variant="large" />
            </template>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </div>
  </Sheet>
</template>

<script setup lang="ts">
import { toast } from "@/components/ui/toast";

const props = defineProps<{
  noteId: string;
  content: string;
  color: string;
  userId: string;
  created: string;
}>();

const { user } = useUser();

const { $pb, $dayjs } = useNuxtApp();

const { data: noteUser } = useAsyncData(`user-${props.userId}`, () =>
  $pb.collection("users").getOne(props.userId)
);

const { data: reactionOptions, execute: fetchReactions } = useLazyAsyncData(
  `reactions`,
  () => $pb.collection("reactions").getFullList()
);

const hasReactedWithEmoji = (iconifyId: string): boolean => {
  const { data } = useNuxtData<ReactionsByNoteData>(
    `reactions-${props.noteId}`
  );

  if (!data.value) return false;
  const reaction = data.value.reactions.find((r) => r.iconify_id === iconifyId);
  return reaction ? reaction.users.includes(user.value.name) : false;
};

const { emit } = useClientReactionBus();

const addReaction = async (id: string) => {
  if (!user.value) return;
  if (!reactionOptions.value) return;

  const reaction = reactionOptions.value.find((e) => e.id === id);

  // optimistic update first
  if (reaction) {
    emit({
      iconify_id: reaction.iconify_id,
      noteId: props.noteId,
      type: "added",
    });
  }

  try {
    await $pb.collection("note_reactions").create({
      reaction: id,
      note: props.noteId,
      user: user.value.id,
    });
  } catch (err) {
    toast({
      variant: "destructive",
      title: `${(err as any).status} Error`,
      description: (err as any).message,
      duration: 3000,
    });

    // Remove if failed
    if (reaction) {
      emit({
        iconify_id: reaction.iconify_id,
        noteId: props.noteId,
        type: "removed",
      });
    }
  }
};
</script>
