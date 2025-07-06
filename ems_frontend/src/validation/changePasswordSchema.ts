import { z } from "zod";

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirm_password: z.string().min(6),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
