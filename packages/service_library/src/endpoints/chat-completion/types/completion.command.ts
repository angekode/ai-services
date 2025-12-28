export type CompletionCommand = {
  model: string;
  provider: string;
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[];
  responseMode: 'single' | 'stream';
  key: string | null;
};
