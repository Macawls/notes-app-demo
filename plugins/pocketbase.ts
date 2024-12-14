import PocketBase, { type AuthModel } from "pocketbase";
import type { TypedPocketBase } from "~/types/pocketbase";

export default defineNuxtPlugin(async () => {
  let pb: TypedPocketBase | undefined = undefined;

  pb = new PocketBase(useRuntimeConfig().public.pocketbase);

  if (import.meta.client) {
    await initClientAuthStore(pb);
  }

  return {
    provide: { pb },
  };
});

const initClientAuthStore = async (pb: PocketBase) => {
  const cookie = useCookie<{
    token: string;
    model: AuthModel;
  }>("pb_auth", {
    path: "/",
    secure: true,
    sameSite: "strict",
    httpOnly: false,
    maxAge: 604800,
  });

  if (cookie.value) {
    pb.authStore.save(cookie.value.token, cookie.value.model);
  }

  pb.authStore.onChange(() => {
    cookie.value = {
      token: pb.authStore.token,
      model: pb.authStore.model,
    };
  });

  try {
    pb.authStore.isValid && (await pb.collection("users").authRefresh());
  } catch (_) {
    pb.authStore.clear();
  }
};
