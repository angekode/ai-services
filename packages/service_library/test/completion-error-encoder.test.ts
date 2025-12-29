import { test, expect, describe, vi } from 'vitest';
import { CompletionErrorEncoder } from '../src/endpoints/chat-completion/encoders/completion.error-encoder';
import { BadInputError, ServerError, ProviderError } from '../src/endpoint-base/error';
import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

describe('CompletionErrorEncoder', () => {
  const encoder = new CompletionErrorEncoder();

  test('Erreur 400 BadInputError', () => {
    const mockRes = {
      status: vi.fn().mockReturnThis(), // pour renvoyer mockRes quand on appelle status
      write: vi.fn(),
      end: vi.fn(),
    } as unknown as Response;

    const error = new BadInputError('Invalid input');

    encoder.encode(mockRes, error);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockRes.write).toHaveBeenCalledWith(
      JSON.stringify({
        error: {
          code: '',
          message: 'Invalid input',
          param: '',
          type: 'BadInputError'
        }
      })
    );
    expect(mockRes.end).toHaveBeenCalled();
  });

  test('Erreur 500 ServerError', () => {
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      write: vi.fn(),
      end: vi.fn(),
    } as unknown as Response;

    const error = new ServerError('Internal error');

    encoder.encode(mockRes, error);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(mockRes.write).toHaveBeenCalledWith(
      JSON.stringify({
        error: {
          code: '',
          message: 'Internal error',
          param: '',
          type: 'ServerError'
        }
      })
    );
    expect(mockRes.end).toHaveBeenCalled();
  });

  test('Erreur 502 ProviderError', () => {
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      write: vi.fn(),
      end: vi.fn(),
    } as unknown as Response;

    const error = new ProviderError('Provider down');

    encoder.encode(mockRes, error);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.BAD_GATEWAY);
    expect(mockRes.write).toHaveBeenCalledWith(
      JSON.stringify({
        error: {
          code: '',
          message: 'Provider down',
          param: '',
          type: 'ProviderError'
        }
      })
    );
    expect(mockRes.end).toHaveBeenCalled();
  });

  test('Erreur 500 avec le type Error', () => {
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      write: vi.fn(),
      end: vi.fn(),
    } as unknown as Response;

    const error = new Error('Generic error');

    encoder.encode(mockRes, error);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(mockRes.write).toHaveBeenCalledWith(
      JSON.stringify({
        error: {
          code: '',
          message: 'Generic error',
          param: '',
          type: 'Error'
        }
      })
    );
    expect(mockRes.end).toHaveBeenCalled();
  });

  test('Erreur 500 avec le type string', () => {
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      write: vi.fn(),
      end: vi.fn(),
    } as unknown as Response;

    const error = 'String error message';

    encoder.encode(mockRes, error);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(mockRes.write).toHaveBeenCalledWith(
      JSON.stringify({
        error: {
          code: '',
          message: 'String error message',
          param: '',
          type: 'unknown'
        }
      })
    );
    expect(mockRes.end).toHaveBeenCalled();
  });

  test('Erreur 500 avec un type inconnu', () => {
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      write: vi.fn(),
      end: vi.fn(),
    } as unknown as Response;

    const error = { custom: 'object' };

    encoder.encode(mockRes, error);

    expect(mockRes.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(mockRes.write).toHaveBeenCalledWith(
      JSON.stringify({
        error: {
          code: '',
          message: '[object Object]',
          param: '',
          type: 'unknown'
        }
      })
    );
    expect(mockRes.end).toHaveBeenCalled();
  });
});