import type NoteReactions from "~/components/NoteReactions.vue";
import { type BaseSystemFields, type UsersResponse } from "./pocketbase";

declare global {
  interface ReactionData {
    iconify_id: string;
    users: string[];
  }

  /**
   * The `id` here corresponds to the id of the note.
   * We don't need other data like collectionId, collectionName, etc.
   * Used for Nuxt's data to minimize payload on client
   */
  interface ReactionsByNoteData extends Pick<BaseSystemFields, "id"> {
    reactions: ReactionData[];
  }
}
