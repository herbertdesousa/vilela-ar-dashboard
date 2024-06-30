import { z } from 'zod';

export const DocumentModel = z.object({
  id: z.string().min(1),

  title: z.string().min(1),

  layers: z.array(
    z.discriminatedUnion('type', [
      z.object({
        id: z.string(),

        type: z.literal('header'),

        date: z.coerce.date(),
      }),
      z.object({
        id: z.string(),

        type: z.literal('block'),
      }),
      z.object({
        id: z.string(),

        type: z.literal('payment'),
      }),
    ]),
  ),
});
export type DocumentModel = z.infer<typeof DocumentModel>;
