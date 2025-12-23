import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";

/*
# Fournisseurs Cloud

| Fournisseur      | Package node                 | Classe BaseChatModel     |
| ---------------- | ---------------------------- | ------------------------ |
| OpenAI           | `@langchain/openai`          | `ChatOpenAI`             |
| Azure OpenAI     | `@langchain/azure-openai`    | `AzureChatOpenAI`        |
| Anthropic        | `@langchain/anthropic`       | `ChatAnthropic`          |
| Google Gemini    | `@langchain/google-genai`    | `ChatGoogleGenerativeAI` |
| Google Vertex AI | `@langchain/google-vertexai` | `ChatVertexAI`           |
| AWS Bedrock      | `@langchain/aws`             | `ChatBedrockConverse`    |
| Mistral          | `@langchain/mistralai`       | `ChatMistralAI`          |
| Cohere           | `@langchain/cohere`          | `ChatCohere`             |
| Groq             | `@langchain/groq`            | `ChatGroq`               |
| Fireworks        | `@langchain/fireworks`       | `ChatFireworks`          |
| Together AI      | `@langchain/together`        | `ChatTogetherAI`         |

# Fournisseur local / self hosted

| Provider    | Package                  | Classe            |
| ----------- | ------------------------ | ----------------- |
| Ollama      | `@langchain/ollama`      | `ChatOllama`      |
| HuggingFace | `@langchain/huggingface` | `ChatHuggingFace` |

*/

export default class ChatsModels {
  /**
   * Permet d'instancier des models de type BaseChatModel (ex: ChatOpenAI, ChatMistral)
   * de manière générique à partir d'informations en chaine de caractère.
   *
   * @example
   * const genericModel = ChatModels.create('openai', 'gpt-4o-mini', <key>);
   * const messenger = new Messenger(genericModel);
   * 
   * @example
   * const genericModel = ChatModels.create('aoi_gateway', 'openai/gpt-4o-mini', <key>, { gatewayUrl: 'http://localhost:3001' });
   * const messenger = new Messenger(genericModel);
   * ...
   * 
   * @param providerName - Nom de la plateforme qui fourni l'API/endpoint. Valeurs possibles:
   * 
   * | providerName | Description                                                                                              |
   * | ------------ | -------------------------------------------------------------------------------------------------------- |
   * | mistralai    | https://docs.mistral.ai/api                                                                              |
   * | oai_gateway  | Indique qu'il faut utiliser l'adresse donnée dans options.gatewayUrl (requis) comme API.                 |
   * |              | L'API doit être compatible OpenAI.                                                                       |
   * |              | https://github.com/openai/openai-openapi/tree/manual_spec                                                |
   * | ollama       | https://docs.ollama.com/                                                                                 |
   * | openai       | https://platform.openai.com/docs/api-reference/introduction                                              |
   * | openrouter   | https://openrouter.ai/docs/api/reference/overview                                                        |
   * | ------------ | -------------------------------------------------------------------------------------------------------- |
   * 
   * 
   * @param modelName - Identifiant du modèle 
   * 
   * | providerName | Comment trouver la liste des identifiants de modèles ?                                                   |
   * | ------------ | -------------------------------------------------------------------------------------------------------- |
   * | mistralai    | GET https://api.mistral.ai/v1//v1/models                                                                 |
   * | oai_gateway  | GET <options.gatewayUrl>/models                                                                          |
   * | ollama       | https://ollama.com/search                                                                                |
   * | openai       | GET https://api.openai.com/v1/models                                                                     |
   * | openrouter   | https://openrouter.ai/models                                                                             |
   * | ------------ | -------------------------------------------------------------------------------------------------------- |
   * 
   * @param apiKey - Clé d'authentification
   * 
   * | providerName | Où la générer ?                                                                                          |
   * | ------------ | -------------------------------------------------------------------------------------------------------- |
   * | mistralai    | https://console.mistral.ai/home?workspace_dialog=apiKeys                                                 |
   * | oai_gateway  | selon le fournisseur indiqué dans la 1ère partie de modelName                                            |
   * | ollama       | /                                                                                                        |
   * | openai       | https://platform.openai.com/api-keys                                                                     |
   * | openrouter   | https://openrouter.ai/settings/keys                                                                      |
   * | ------------ | -------------------------------------------------------------------------------------------------------- |
   * 
   * @param options - gatewayUrl (requis si providerName = 'oai_gateway') : url de base de l'API de la passerelle LLM 
   * @example http://localhost:3001/v1
   */
  static create(
    providerName: string,
    modelName: string,
    apiKey: string,
    options? : {
      gatewayUrl?: string
    }
  ): BaseChatModel | undefined {

    if (providerName === "mistralai") {
      return new ChatMistralAI({ model: modelName, apiKey: apiKey });
      
    } else if (providerName === "oai_gateway") {
      if (!options || !options.gatewayUrl) {
        throw new TypeError('Url manquante pour le founisseur type oai_gateway');
      }
      return new ChatOpenAI({
        model: modelName,
        apiKey: apiKey,
        configuration: { baseURL: options?.gatewayUrl },
      });
      
    } else if (providerName === "ollama") {
      return new ChatOllama({ model: modelName });

    } else if (providerName === "openai") {
      return new ChatOpenAI({ model: modelName, apiKey: apiKey });
      
    } else if (providerName === "openrouter") {
      // https://openrouter.ai/docs/guides/community/langchain
      // https://docs.langchain.com/oss/javascript/integrations/chat/openai#custom-urls
      return new ChatOpenAI({
        model: modelName,
        apiKey: apiKey,
        configuration: { baseURL: "https://openrouter.ai/api/v1" },
      });    
      
    } else {
      return undefined;
    }
  }
}
