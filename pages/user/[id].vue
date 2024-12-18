<template>
  <div v-if="user">
    <h1 class="text-4xl font-bold text-foreground mb-8 flex items-center">
      <NuxtLink class="inline-block mr-4" to="/">
        <Icon name="material-symbols:arrow-back-rounded"></Icon>
      </NuxtLink>
      User Profile
    </h1>
    <Card class="duration-300 animate-in fade-in slide-in-from-bottom-8">
      <CardHeader>
        <Avatar class="mb-4 size-20">
          <AvatarImage
            :alt="user.name"
            :src="$pb.files.getURL(user, user?.avatar)"
          />
          <AvatarFallback>{{ user.name }}</AvatarFallback>
        </Avatar>
        <CardTitle>{{ user?.name }}</CardTitle>
        <CardDescription>
          Joined {{ $dayjs(user?.created).utc().fromNow() }}
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          v-if="notesCreated"
          class="flex items-center space-x-3 p-4 rounded-lg border border-border duration-300 animate-in fade-in slide-in-from-bottom-8"
        >
          <Icon class="size-8" name="hugeicons:quill-write-01" />
          <span class="text-lg font-semibold">
            {{ notesCreated.length }}
            {{ notesCreated.length === 1 ? "Note" : "Notes" }} Shared
          </span>
        </div>
        <div
          v-if="reactionsLeft"
          class="flex items-center space-x-3 p-4 rounded-lg border border-border duration-300 animate-in fade-in slide-in-from-bottom-8"
        >
          <Icon class="size-8" name="mingcute:happy-line" />
          <span class="text-lg font-semibold">
            {{ reactionsLeft.length }}
            {{ reactionsLeft.length === 1 ? "Reaction" : "Reactions" }}
            Left
          </span>
        </div>
        <div
          v-if="favouriteColor"
          class="flex items-center justify-start space-x-3 p-4 rounded-lg border border-border duration-300 animate-in fade-in slide-in-from-bottom-8"
        >
          <span class="text-lg font-semibold flex items-center space-x-3">
            <div
              class="size-8 rounded-full inline-block"
              :style="{
                backgroundColor: favouriteColor.hex,
              }"
            ></div>
            <span
              >Prefers
              <span class="capitalize">{{ favouriteColor.name }}</span></span
            >
          </span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;

const { $pb } = useNuxtApp();

const { data: user } = await useAsyncData(`user-${id}`, () =>
  $pb.collection("users").getOne(id)
);

const reactionsLeft = computedAsync(() =>
  $pb.collection("note_reactions").getFullList({
    filter: $pb.filter("user={:id}", { id: id }),
  })
);

const notesCreated = computedAsync(() =>
  $pb.collection("notes").getFullList({
    filter: $pb.filter("user={:id}", { id: id }),
  })
);

const favouriteColor = computedAsync(async () => {
  if (!notesCreated.value) return undefined;
  const colorCounts: { [key: string]: number } = notesCreated.value
    .map((note) => note.color)
    .reduce((acc, color) => {
      acc[color] = (acc[color] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

  const colorId = Object.keys(colorCounts).reduce((a, b) =>
    colorCounts[a] > colorCounts[b] ? a : b
  );

  return await $pb.collection("colors").getOne(colorId);
});
</script>
