import { type UsersResponse } from "~/types/pocketbase";

export const useUser = () => {
  const { $pb } = useNuxtApp();
  const user = useState<UsersResponse<unknown> | undefined>(() => undefined);

  if ($pb.authStore.isValid) {
    user.value = $pb.authStore.record as UsersResponse<unknown>;
  }

  // TODO, implement login and logout
  const loginWithOAuth2 = async (provider: string) => {
    const res = await $pb.collection("users").authWithOAuth2({
      provider: provider,
    });

    user.value = res.record;
  };

  const logout = () => {
    $pb.authStore.clear();
    user.value = undefined;
  };

  return {
    user: computed(() => user.value as UsersResponse),
    loginWithOAuth2,
    logout,
    set: (record: UsersResponse | undefined) => (user.value = record),
  };
};
