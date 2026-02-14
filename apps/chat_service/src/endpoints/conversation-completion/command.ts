export type Message = {
  role: 'user' | 'assistant' | 'system',
  content: string
};

export type ConversationCompletionCommand = {
  conversationId: string,
  stream: boolean
};
