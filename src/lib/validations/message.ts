import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message is too long")
    .trim(),
  receiver_id: z.string().uuid("Invalid receiver ID"),
  message_type: z.enum(["text", "image"]).default("text"),
});

export type MessageInput = z.infer<typeof messageSchema>;
