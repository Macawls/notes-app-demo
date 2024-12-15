<template>
  <Dialog v-if="user">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" class="relative h-8 w-8 rounded-full">
          <Avatar>
            <AvatarImage
              :src="$pb.files.getURL(user, user.avatar)"
              alt="Default user"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56" align="end">
        <DropdownMenuLabel class="font-normal">
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-medium leading-none">{{ user.name }}</p>
            <p class="text-xs leading-none text-muted-foreground">
              {{ user.email }}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <NuxtLink to="/account">Account</NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NuxtLink to="/notes">My Notes</NuxtLink>
        </DropdownMenuItem>
        <DialogTrigger as-child>
          <DropdownMenuItem @click="">Log out</DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sign out</DialogTitle>
        <DialogDescription>
          <p class="mt-2">We're sad to see you go 😞</p>
          <p>Are you sure you want to log out, {{ user.name }}?</p>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-4">
        <Button @click="logout" variant="secondary">Log out</Button>
        <DialogClose asChild>
          <Button>Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <Dialog v-else>
    <DialogTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar>
          <AvatarImage
            src="https://vercel.com/api/www/avatar?u=rauchg&s=64"
            alt="Default user"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sign in</DialogTitle>
        <DialogDescription>
          Login with your social account to access your profile
        </DialogDescription>
      </DialogHeader>
      <Login />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();
const { user, logout } = useUser();
</script>
