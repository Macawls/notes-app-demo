import { useEventBus } from "@vueuse/core";

export const useClientReactionBus = () => {
  return useEventBus<{
    noteId: string;
    iconify_id: string;
  }>("reactionBus");
};
