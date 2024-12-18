<template>
  <div class="mx-auto">
    <h1 class="text-4xl font-bold text-foreground mb-8">Account Settings</h1>
    <div class="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your information here</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="space-y-6">
            <div class="flex items-center space-x-6">
              <div class="shrink-0">
                <img
                  class="h-16 w-16 object-cover rounded-full"
                  :src="avatarPreview || $pb.files.getURL(user, user.avatar)"
                  alt="Current avatar"
                />
              </div>
              <FormField type="file" v-slot="{ handleChange }" name="avatar">
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      accept="image/jpeg,image/webp,image/png"
                      type="file"
                      @change="handleChange"
                      :class="{
                        'is-valid': meta.valid && meta.touched,
                        'is-invalid': !meta.valid && meta.touched,
                      }"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    autocomplete="off"
                    type="text"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormDescription
                  >This is your public display name</FormDescription
                >
                <FormMessage />
              </FormItem>
            </FormField>
            <div class="space-x-2">
              <Button
                class="animate-in fade-in slide-in-from-bottom-2"
                v-if="meta.dirty"
                type="submit"
                :disabled="!meta.valid || isSubmitting"
              >
                {{ isSubmitting ? "Updating..." : "Update" }}
              </Button>
              <Button
                class="animate-in fade-in slide-in-from-bottom-2"
                @click="resetForm"
                variant="destructive"
                v-if="meta.dirty && !isSubmitting"
                >Reset</Button
              >
            </div>
          </form>
        </CardContent>
      </Card>
      <Card v-if="userExternalAuths && userExternalAuths.length">
        <CardHeader>
          <CardTitle>Authorized Accounts</CardTitle>
          <CardDescription
            >Manage third-party logins connected to your
            account</CardDescription
          >
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="auth in userExternalAuths"
              :key="auth.provider"
              class="flex items-center space-x-2 justify-center border-border border-2 p-3 rounded-lg"
            >
              <Icon :name="providerIconMap[auth.provider]" class="size-6" />
              <span class="text-xs capitalize pr-2">{{ auth.provider }}</span>
              <Button
                @click="removeProvider(auth.id)"
                :disabled="removingProvider"
                variant="destructive"
                v-if="canRemoveProviders"
                >Remove
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter v-if="canAddLogin">
          <Dialog v-model:open="open">
            <DialogTrigger as-child>
              <Button>Link Account<Icon name="ri:external-link-fill" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Login</DialogTitle>
                <DialogDescription>
                  Add a login to your account
                </DialogDescription>
              </DialogHeader>
              <Login :exclusion-list="excludedProviders" />
              <DialogFooter class="text-muted-foreground">
                <div class="p-4 border-border border rounded-lg">
                  <strong>Note</strong>
                  <p class="text-xs italic mt-1">
                    If you want to link an
                    <strong>already existing login</strong> with this account,
                    you need to
                    <strong>delete the other account first.</strong>
                  </p>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog></CardFooter
        >
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription
            >Permanently remove your account and all associated
            data</CardDescription
          >
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button :disabled="deleting" variant="destructive"
                >Delete Account</Button
              >
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will
                  <b
                    >permanently delete your account and remove all of your
                    notes</b
                  >
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction @click="deleteAccount">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoSchema } from "~/composables/schemas";
import { useForm } from "vee-validate";
import { toast } from "~/components/ui/toast";
import { computedAsync } from "@vueuse/core";
import { type ExternalauthsResponse } from "~/types/pocketbase";

const { user, set } = useUser();
const { $pb } = useNuxtApp();

definePageMeta({
  middleware: [
    (to, from) => {
      if (!useUser().user.value) {
        return navigateTo("/");
      }
    },
  ],
});

watch(user, async () => {
  if (!user.value) {
    await navigateTo("/");
  }
});

const { providerIconMap } = useAppConfig();

const open = useDialogOpen();

const authMethods = computedAsync(async () => {
  return await $pb.collection("users").listAuthMethods();
});

const { data: userExternalAuths, refresh: refreshAuths } = useAsyncData(
  "user-external-auths",
  () => $pb.collection("_externalAuths").getFullList()
);

watch(user, (val) => {
  if (val) refreshAuths();
});

const canAddLogin = computed(() => {
  if (!userExternalAuths.value || !authMethods.value) return undefined;
  return (
    userExternalAuths.value.length != authMethods.value.oauth2.providers.length
  );
});

const excludedProviders = computed(() => {
  if (!userExternalAuths.value || !authMethods.value) return undefined;
  const providers = authMethods.value.oauth2.providers.map((e) => e.name);
  return userExternalAuths.value
    .filter((e) => providers.includes(e.provider))
    .map((e) => e.provider);
});

const canRemoveProviders = computed(() => {
  if (!userExternalAuths.value) return;
  return userExternalAuths.value.length > 1;
});

const userInfoSchema = useUserInfoSchema();

const { handleSubmit, values, meta, isSubmitting, resetForm, errorBag } =
  useForm({
    validationSchema: userInfoSchema,
    initialValues: {
      name: user.value?.name || "",
    },
  });

const avatarPreview = computedAsync(async () => {
  if (!values.avatar) return undefined;

  const reader = new FileReader();
  const file = values.avatar as Blob;

  return new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const record = await $pb.collection("users").update(user.value.id, values);

    set(record);

    resetForm({
      values: {
        name: record.name,
      },
    });

    toast({
      title: `Looking good ${record.name} 🥳`,
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

const deleting = ref(false);

const deleteAccount = async () => {
  try {
    deleting.value = true;
    await $pb.collection("users").delete(user.value.id);
    set(undefined);
  } catch (err) {
    toast({
      variant: "destructive",
      title: `${(err as any).status} Error`,
      description: (err as any).message,
      duration: 3000,
    });
  } finally {
    deleting.value = false;
  }
};

const removingProvider = ref(false);

const removeProvider = async (id: string) => {
  const deletedProvider = userExternalAuths.value!.find((e) => e.id === id)!;
  const { data } = useNuxtData<ExternalauthsResponse[]>("user-external-auths");

  try {
    removingProvider.value = true;
    await $pb.collection("_externalAuths").delete(id);

    data.value = data.value!.filter((e) => e.id !== id);
  } catch (err) {
    data.value = [...data.value!, deletedProvider];
    toast({
      variant: "destructive",
      title: `${(err as any).status} Error`,
      description: (err as any).message,
      duration: 3000,
    });
  } finally {
    removingProvider.value = false;
  }
};
</script>
