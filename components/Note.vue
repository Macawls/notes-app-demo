<template>
  <Sheet>
    <div class="flex gap-2 relative">
      <div v-if="user">
        <NuxtLink :to="`profile/${user.id}`">
          <Avatar class="h-8 w-8">
            <AvatarImage
              :src="$pb.files.getURL(user, user.avatar)"
              :alt="user.name"
            />
            <AvatarFallback>{{ user.name }}</AvatarFallback>
          </Avatar>
        </NuxtLink>
      </div>
      <div class="flex-grow flex-col flex">
        <div class="flex items-center gap-1">
          <div v-if="user" class="font-medium">{{ user.name }}</div>
          <div class="text-xs italic">
            {{ "~ " + $dayjs(created).utc().fromNow() }}
          </div>
        </div>
        <div
          :style="{ backgroundColor: color }"
          class="shadow-sm p-3 relative text-black rounded-tr-md rounded-br-md rounded-bl-md"
        >
          {{ content }}
        </div>
        <div
          class="self-end flex justify-between w-full items-center mt-2 gap-4"
        >
          <NoteReactions :key="reactionsKey" :note-id="noteId" />
          <SheetTrigger v-if="user" as-child>
            <Button
              @click="() => fetchReactions()"
              class="max-w-fit h-fit m-0 p-0 translate-y-0.5"
              variant="ghost"
            >
              <Icon class="size-5" name="codicon:reactions" />
            </Button>
          </SheetTrigger>
        </div>
      </div>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Pick an Emoji</SheetTitle>
          <SheetDescription>
            <template v-if="reactions">
              React to {{ user!.name + `'s` }} post with an emoji
              <div
                class="flex gap-4 flex-wrap mt-4 justify-center md:justify-start"
              >
                <template v-for="reaction in reactions">
                  <SheetClose as-child>
                    <Button
                      :key="reaction.id"
                      type="submit"
                      variant="ghost"
                      class="flex flex-col items-center justify-center size-24 p-2"
                      @click="addReaction(reaction.id)"
                    >
                      <Icon class="size-10" :name="reaction.iconify_id" />
                    </Button>
                  </SheetClose>
                </template>
              </div>
            </template>
            <template v-else>
              <IconLoader variant="medium" />
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

const reactionsKey = ref(10);

const { $pb, $dayjs } = useNuxtApp();

const { data: user, execute: fetchUser } = useLazyAsyncData(
  `user-${props.userId}`,
  () => $pb.collection("users").getOne(props.userId)
);

const { data: reactions, execute: fetchReactions } = useLazyAsyncData(() =>
  $pb.collection("reactions").getFullList()
);

const addReaction = async (id: string) => {
  try {
    await $pb.collection("note_reactions").create({
      reaction: id,
      note: props.noteId,
      user: user.value?.id || "",
    });

    reactionsKey.value = reactionsKey.value++; // re-render reactions, unfortunately not optimisic update for now
  } catch (err) {
    toast({
      variant: "destructive",
      title: `${(err as any).status} Error`,
      description: (err as any).message,
      duration: 3000,
    });
  }
};

onMounted(() => {
  fetchUser();
});
</script>
