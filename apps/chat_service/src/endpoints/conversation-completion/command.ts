export type Message = {
  role: 'user' | 'assistant' | 'system',
  content: string
};

export type ConversationCompletionCommand = {
  messages: Message[],
  conversationId: string,
  stream: boolean
};
