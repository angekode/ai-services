export type InternalRequest = {
  input: InternalRequestInput | undefined,
  context: InternalRequestContext | undefined,
  error: InternalRequestError | undefined
};

export type InternalRequestInput = {
  provider: string,
  model: string,
  messages: { role: 'user' | 'assistant' | 'system', content: string }[],
  stream: boolean,
  key: string | null
};

export function createInternalRequestInput() : InternalRequestInput {
  return {
    provider: '',
    model: '',
    messages: [],
    stream: false,
    key: null
  };
}


export type InternalRequestContext = {
  'traceparent': string | undefined,
  'x-run-id': string | undefined,
  'x-user-id': string | undefined
};

export type InternalRequestError = {
  message: string
};

export function createInternalRequest() : InternalRequest {
  return {
    input: undefined,
    context: undefined,
    error: undefined
  };
}
