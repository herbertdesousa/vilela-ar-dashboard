import { z } from 'zod';

export const DocumentModel = z.object({
  id: z.string().min(1),

  title: z.string().min(1),

  // createdDate: z.coerce.date(),
});
export type DocumentModel = z.infer<typeof DocumentModel>;
