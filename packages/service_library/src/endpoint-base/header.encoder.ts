import type { Response } from 'express';
import type { Context } from './context.type.ts';


export function encodeHeaders(res: Response, context: Context) {
  for (const [headerName, headerValue] of Object.entries(context)) {
    if (typeof headerValue === 'string') {
      res.setHeader(headerName, headerValue);
    }
  }
}
