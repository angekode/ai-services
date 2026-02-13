import type { Request, Response, NextFunction } from 'express';


export interface RequestDecoder<TReq, TCommand, TContext> {
  decode(req: TReq): Promise<{command: TCommand, context: TContext}>;
}

export type UseCaseResult<TOut, TChunk> =
  | { kind: 'single'; value: TOut }
  | { kind: 'stream'; stream: AsyncIterable<TChunk> };

export interface UseCase<TCommand, TOut, TChunk = never> {
  execute(command: TCommand): Promise<UseCaseResult<TOut, TChunk>>;
}

export interface ResponseEncoder<TRes, TOut, TChunk, TContext> {
  encode(res: TRes, result: UseCaseResult<TOut, TChunk>, context: TContext): Promise<void>;
}

export interface ErrorEncoder<TRes> {
  encode(res: TRes, error: unknown) : void;
}

export function createController<TCommand, TOut, TChunk, TContext>(
  reqDecoder: RequestDecoder<Request, TCommand, TContext>,
  useCase: UseCase<TCommand, TOut, TChunk>,
  resEncoder: ResponseEncoder<Response, TOut, TChunk, TContext>,
  errorEncoder: ErrorEncoder<Response>
) {

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { command, context } = await reqDecoder.decode(req);
      const result = await useCase.execute(command);
      await resEncoder.encode(res, result, context);

    } catch (error: unknown) {
      errorEncoder.encode(res, error);
    }
  };
}
