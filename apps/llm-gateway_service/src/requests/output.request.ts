/*
  Les requêtes en sortie reprennent partiellement le format de OpenAI,
  pour la route /chat/completion (ligne 3434).
  https://github.com/openai/openai-openapi/blob/manual_spec/openapi.yaml

  CreateChatCompletionResponse (ligne 36761)
  CreateChatCompletionStreamResponse (ligne 36896)
  ChatCompletionResponseMessage (ligne 35203)

  Tous les champs de OpenAI ne sont pas repris, mais tous les champs utilisés
  suivent la spécification d'OpenAI.
*/

/**
 * Format du corps de la réponse non stream
 */
export type OutputRequest_CompletionBody_Type = {

  // A unique identifier for the chat completion.
  id: string,

  // A list of chat completion choices. Can be more than one if `n` is greater than 1.
  choices: {

    // The index of the choice in the list of choices.
    index: number,
    message: ChatCompletionRequestMessage_Type,
    // The reason the model stopped generating tokens.
    finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls',

    // logprobs
  }[],

  // The Unix timestamp (in seconds) of when the chat completion was created.
  created: number,
  // The model used for the chat completion.
  model: string,
  object: 'chat.completion',
  usage: CompletionUsage_Type,
};

/**
 * Format du corps de la réponse stream
 */
export type OutputRequest_StreamCompletionBody_Type = {
  // A unique identifier for the chat completion. Each chunk has the same ID.
  id: string,

  // A list of chat completion choices. Can be more than one if `n` is greater than 1.
  choices: {

    // The index of the choice in the list of choices.
    index: number,
    delta: ChatCompletionStreamResponseDelta_Type,
    // The reason the model stopped generating tokens.
    finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls',
    // logprobs
  }[],

  // The Unix timestamp (in seconds) of when the chat completion was created.
  created: number,
  // The model used for the chat completion.
  model: string,
  object: 'chat.completion',
  usage: CompletionUsage_Type,
};

// #/components/schemas/ErrorResponse (23305)
export type OutputRequest_ErrorBody_Type = {
  error: Error_Type
};

// #/components/schemas/Error (23268)
export type Error_Type = {
  code: string | null,
  message: string,
  param: string | null,
  type: string
};



// #/components/schemas/ChatCompletionResponseMessage (35203)
type ChatCompletionRequestMessage_Type = {
  role: 'assistant', // The role of the author of this message.
  content: string | null, // content of the message
  // refusal
  // tool_calls
  // annotations
  // function_call
  // audio
};

// #/components/schemas/CompletionUsage (35718)
type CompletionUsage_Type = {
  completion_tokens: number,
  prompt_tokens: number,
  total_tokens: number
  // completion_tokens_details
  // prompt_tokens_details
};



// #/components/schemas/ChatCompletionStreamResponseDelta (35358)
type ChatCompletionStreamResponseDelta_Type = {
  role: 'developper' | 'system' | 'user' | 'assistant' | 'tool',
  content: string | null, // content of the message
  // function_call
  // tool_calls
  // refusal
}

