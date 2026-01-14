export type ConversationCompletionOutputRequestType = {
  choices: [
    {
      finish_reason: 'stop',
      index: number,
      message: {
        role: 'assistant',
        content: string
      }
    }
  ]
};


// #/components/schemas/ChatCompletionStreamResponseDelta (35358)
type ConversationCompletionOutputRequestDeltaType = {
  role: 'developper' | 'system' | 'user' | 'assistant' | 'tool',
  content: string | null, // content of the message
}



export type ConversationCompletionOutputRequestStreamType = {
  choices: {
    index: number,
    delta: ConversationCompletionOutputRequestDeltaType,
    finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls',
  }[],
  model: string,
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

/*
{
  "id": "chatcmpl-CnOBmEsqognJEzmK4aUb5BDryjm07",
  "object": "chat.completion",
  "created": 1765887090,
  "model": "gpt-4o-mini-2024-07-18",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        "refusal": null,
        "annotations": []
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 8,
    "completion_tokens": 10,
    "total_tokens": 18,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "service_tier": "default",
  "system_fingerprint": "fp_644f11dd4d"
}*/