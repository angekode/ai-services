import { LangchainLLMClient } from 'llm_library';
import type { InferStreamResult } from 'llm_library/dist/llm-client-interface.ts';

import { ServerError } from '../error.ts';
import type { InternalRequest } from '../requests/internal.request.ts';


const llmClient = new LangchainLLMClient();


export type CompletionResult = {
  type: 'message'
  content: string | undefined,
  success: 'ok' | 'error';
  metadata: Record<string, any>,
  id: string | undefined
} | {
  type: 'error',
  message: string
};

export type CompletionStreamResult = InferStreamResult;


/**
 * Génère une inférence à partir du contenu de InternalRequest qui contient:
 * - le prompt
 * - le nom de la plateforme, fournisseur et modèle à utiliser
 *
 * Utilise LangchainLLMClient.infer() en interne.
 *
 * @param ir - Contient le prompt (question), le nom de la plateforme, fournisseur et modèle à utiliser
 * @returns - la réponse générée et les metadata si pas d'erreurs, un objet erreur sinon
 * @throws - ServerError si les données dans l'objet InternalRequest ne sont pas valides
 */
export async function generateCompletion(ir : InternalRequest) : Promise<CompletionResult> {
  if (!ir.input) {
    throw new ServerError('L\'objet InternalRequestInput n\'est pas défini');
  }

  const resp = await llmClient.infer(
    ir.input.messages,
    ir.input.provider,
    ir.input.model,
    ir.input.key ? { apiKey:  ir.input.key } : {}
  );

  if (resp.type === 'message') {
    return {
      type: 'message',
      content: resp.content,
      success: 'ok',
      metadata: resp.metadata,
      id: resp.id
    };
  } else {
    return {
      type: 'error',
      message: resp.message
    };
  }
}


/**
 * Fonction génératrice qui produit une inférence à partir du contenu de InternalRequest qui contient:
 * - le prompt
 * - le nom de la plateforme, fournisseur et modèle à utiliser
 *
 * Utilise LangchainLLMClient.inferStream() en interne.
 *
 * @param ir - Contient le prompt (question), le nom de la plateforme, fournisseur et modèle à utiliser
 * @returns - morceau de la réponse et les metadata si pas d'erreurs, un objet erreur sinon
 * @throws - ServerError si les données dans l'objet InternalRequest ne sont pas valides
 */
export async function * generateCompletionStream(ir : InternalRequest) : AsyncGenerator<CompletionStreamResult> {
  if (!ir.input) {
    throw new ServerError('L\'objet InternalRequestInput n\'est pas défini');
  }

  const stream = llmClient.inferStream(
    ir.input.messages,
    ir.input.provider,
    ir.input.model,
    ir.input.key ? { apiKey:  ir.input.key } : {}
  );

  for await (const chunk of stream) {
    yield chunk as CompletionStreamResult;
  }
}
