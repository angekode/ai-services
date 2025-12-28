export type Context = {
  'traceparent': string | undefined,
  'x-run-id': string | undefined,
  'x-user-id': string | undefined
};

export function createContext() : Context {
  return {
    'traceparent': undefined,
    'x-run-id': undefined,
    'x-user-id': undefined
  };
}
