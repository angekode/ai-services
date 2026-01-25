import { LangchainLLMClient } from 'rag_library';
import type { InferStreamResult } from 'rag_library/dist/llm-client-interface.js';

import { ServerError, type UseCase, type UseCaseResult, ProviderError } from "service_library";
import { type ConversationCompletionCommand } from "./command.js";
import database  from '../../database/client.js';

export type ConversationCompletionUseCaseResultSingleValue = {
  content: string;
  metadata: unknown;
  id: string | undefined;
  model: string;
};

export type ConversationCompletionUseCaseResultStreamValue = InferStreamResult;

type Message = {
  role: 'user' | 'system' | 'assistant';
  content : string;
};


/**
 * ConversationCompletionUseCase(command)
 * 
 * command : ConversationCompletionCommand {
 *   messages: Message[],
 *   conversationId: string,
 *   stream: boolean
 * }
 * 
 * A partir d'un ou plusieurs messages de requête du client,
 * et de l'historique des messages de la conversation,
 * renvoie une réponse du LLM.
 * 
 * Les messages de requête du client sont enregistrés dans la base de donnée,
 * si la réponse du LLM est bien reçue.
 * 
 * 
 * 
 * @param command Contient la liste des messages envoyés par le client, l'id de la conversation, et le mode stream.
 * @return En mode non stream: Un objet contenant le message de réponse avec l'id du message utile pour les autres requêtes
 *         En mode stram: Un objet contenant le stream qui enverra le message par morceaux
 */
export class ConversationCompletionUseCase implements UseCase<ConversationCompletionCommand, ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue> {
  async execute(command: ConversationCompletionCommand): Promise<UseCaseResult<ConversationCompletionUseCaseResultSingleValue, ConversationCompletionUseCaseResultStreamValue>> {

    if (!process.env.LLM_PROVIDER || !process.env.LLM_MODEL) {
      throw new ServerError('Variables d\' environnement llm non définies');
    }


    // Récupération de l'historique de la conversation dans la base de donnée
    const conversations = await database.client.messageModel?.getEntries({ conversation_id: Number(command.conversationId) });
    if (!conversations) {
      throw new ServerError(`Conversation non trouvée: ${command.conversationId}`);
    }

    let messageHistory : Message[] = conversations.map(m => { 
      if (!['user', 'system', 'assistant'].includes(m.role)) {
        throw new ServerError('Role de message invalide');
      }
      return {
        role : m.role as 'user' | 'system' | 'assistant', 
        content: m.content 
      }
    });


    // Demande de réponse du LLM en mode non stream
    if (command.stream === false) {

      // Requête au LLM
      const client = new LangchainLLMClient();
      const llmResult = await client.infer(
        messageHistory,
        process.env.LLM_PROVIDER,
        process.env.LLM_MODEL,
        process.env.LLM_KEY  ? { apiKey: process.env.LLM_KEY } : {}
      );

      if (llmResult.type === 'error') {
        throw new ProviderError(llmResult.message);
      }
      
      // Enregistrement du message de réponse du LLM dans l'historique
      const llmResponseSavedEntry = await database.client.messageModel?.addEntry({
        role: 'assistant',
        content: llmResult.content,
        conversation_id: Number(command.conversationId)
      });


      return {
        kind: 'single',
        value: {
          content: llmResult.content,
          metadata: llmResult.metadata,
          id: llmResponseSavedEntry?.id.toString() /*result.id*/, // on remplace l'id de completion généré par le LLM par l'id du message dans la base de donnée
          model: process.env.LLM_MODEL
        }
      };


    // Demande de réponse au LLM en mode stream
    } else {

      const client = new LangchainLLMClient();
      const result = await client.inferStream(
        messageHistory,
        process.env.LLM_PROVIDER,
        process.env.LLM_MODEL,
        process.env.LLM_KEY  ? { apiKey: process.env.LLM_KEY } : {}
      );

      const streamWrapper = async function * (result : AsyncGenerator<InferStreamResult>)  {
        let concatenatedResponse = '';
        
        try {
          for await (const chunk of result) {
            if (chunk.type === 'message.delta') {
              chunk.id = 
              concatenatedResponse += chunk.content;
            }
            yield chunk;
          }
        
        // Coupure de la connextion par le serveur llm
        } catch (error) {
          console.error(String(error));

        // Enregistrement de la réponse même si elle est interrompue
        } finally {
          database.client.messageModel?.addEntry({
            role: 'assistant',
            content: concatenatedResponse,
            conversation_id: Number(command.conversationId)
          });
        }
      }

      return {
        kind: 'stream',
        stream: streamWrapper(result)
      };

    }
  }
}
