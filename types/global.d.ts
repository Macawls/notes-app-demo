interface ReactionData {
  iconify_id: string;
  users: string[];
}

interface NoteReactions extends Array<ReactionData> {}
