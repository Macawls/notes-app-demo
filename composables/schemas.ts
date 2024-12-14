import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const useNoteSchema = (options: { colorIds: string[] }) => {
  return toTypedSchema(
    z.object({
      content: z.string().min(5).max(400),
      color: z.string().refine((value) => options.colorIds.includes(value), {
        message: "Please select a valid color",
      }),
    })
  );
};
