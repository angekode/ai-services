import zod from 'zod';

/*
  Les requêtes en entrée reprennent partiellement le format de OpenAI,
  pour la route /chat/completion (ligne 3238).
  https://github.com/openai/openai-openapi/blob/manual_spec/openapi.yaml

  CreateChatCompletionRequest (ligne 36442)
  ChatCompletionRequestMessage (ligne 34918)
  ChatCompletionRequestUserMessage (ligne 35155)

  Tous les champs de OpenAI ne sont pas repris, mais tous les champs utilisés
  suivent la spécification d'OpenAI.
*/



/**
 * Schéma validateur des messages
 */
const ChatCompletionRequestMessage_Scheme = zod.object({
  content: zod.string(), // The contents of the user message. (openai: string ou array[ChatCompletionRequestUserMessageContentPartChatCompletionRequestUserMessageContentPart])
  role: zod.enum(['user', 'system', 'assistant'])
  // ** name
});

/**
 * Schéma de validation de la propriété 'model' au format: "<nom plateforme>/<fournisseur>/<id modèle>"
 * Permet de récupérer match[1] = <nom plateforme>, match[2] = <fournisseur>/<id modèle>
 */
export const INPUT_REQUEST_MODEL_PATTERN = /^([^\/]+)\/(.+)/;

/**
 * Schéma validateur du corps
 */
export const inputRequestBody_Completion_Scheme = zod.object({

  messages: zod.array(ChatCompletionRequestMessage_Scheme),
  /** model: "<nom fournisseur>/<nom du modèle>"
   * Les fournisseurs d'inférence privés (OpenAI, MistralAI...) demandent un id de modèle dans ce champs (model: <id modèle>)
   * Les plateformes de modèles (OpenRouter, Huggingface...) demandent un nom de modèle dans (model: <fournisseur>/<id modèle>)
   * Ici on demande "<nom plateforme>/<fournisseur>/<id modèle>"
  */
  model: zod.string().regex(INPUT_REQUEST_MODEL_PATTERN),
  stream: zod.boolean().optional()
});


/**
 * Schéma validateur des entêtes
 */
export const inputRequestHeaders_Completion_Scheme = zod.object({
  'traceparent': zod.string(),
  'x-run-id': zod.string(),
  'x-user-id': zod.string(),
  'authorization': zod.string().optional()
});

/**
 * Format des entêtes
 */
export type inputRequestHeaders_Completion_Type = zod.infer<typeof inputRequestHeaders_Completion_Scheme>;

/**
 * Format du corps
 */
export type InputRequestBody_Completion_Type = zod.infer<typeof inputRequestBody_Completion_Scheme>;
