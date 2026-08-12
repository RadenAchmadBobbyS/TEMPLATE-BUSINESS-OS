import { z } from "zod";
import { TicketCategory, TicketPriority, TicketStatus } from "@prisma/client";

export const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters").max(100),
  category: z.nativeEnum(TicketCategory),
  priority: z.nativeEnum(TicketPriority),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const addReplySchema = z.object({
  messageBody: z.string().min(1, "Message cannot be empty"),
  isInternalNote: z.boolean().default(false),
});

export const updateTicketStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
});

export const updateTicketPrioritySchema = z.object({
  priority: z.nativeEnum(TicketPriority),
});
