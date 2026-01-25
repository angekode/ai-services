import zod from 'zod';

export const messageScheme = zod.object({
  role: zod.literal(['user', 'assistant', 'system']),
  content: zod.string()
});

export const conversationCompletionScheme = zod.object({
  stream: zod.boolean()
});
