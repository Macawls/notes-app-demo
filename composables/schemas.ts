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

export const useUserInfoSchema = () => {
  return toTypedSchema(
    z.object({
      name: z.string().min(3).max(50),
      avatar: z
        .instanceof(File)
        .refine((file) => file.size <= 1048576, {
          message: "Image size must be 1MB or less",
        })
        .optional(),
    })
  );
};
