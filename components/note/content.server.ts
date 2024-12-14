import { MDCRenderer } from "#components";
import { type MDCParserResult } from "@nuxtjs/mdc";
import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import { type NotesResponse } from "~/types/pocketbase";

export default defineNuxtComponent({
  props: {
    id: {
      type: String,
      default: "",
      required: true,
    },
  },
  async setup(props) {
    const { $pb } = useNuxtApp();

    const { data: note } = await useAsyncData<NotesResponse>(() =>
      $pb.collection("notes").getOne(props.id),
    );

    const { data: ast } = await useAsyncData<MDCParserResult>(() =>
      parseMarkdown(note.value?.content ?? ""),
    );

    return () =>
      ast.value
        ? h(MDCRenderer, { body: ast.value.body, data: ast.value.data })
        : h("");
  },
});
