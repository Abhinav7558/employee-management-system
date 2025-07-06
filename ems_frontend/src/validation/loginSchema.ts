import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username should be have more than 3 characters"),
  password: z.string().min(8, "Password should be have more than 8 character"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
