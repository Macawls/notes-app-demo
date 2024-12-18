import { useEventBus } from "@vueuse/core";

export const useClientReactionBus = () => {
  return useEventBus<{
    noteId: string;
    iconify_id: string;
    type: "added" | "removed"; // Corrected the union type
  }>("reactionBus");
};
