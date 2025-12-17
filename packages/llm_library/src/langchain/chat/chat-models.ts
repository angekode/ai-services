import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';


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
   * const { provider, model, key } = ...
   * const genericModel = ChatModels.create(provider, model, key);
   * const messenger = new Messenger(genericModel);
   * ...
   */
  static create(providerName : string, modelName: string, apiKey: string) : BaseChatModel | undefined {

    if (providerName === 'mistralai') {
      return new ChatMistralAI({ model: modelName, apiKey: apiKey });

    } else if (providerName === 'openai') {
      return new ChatOpenAI({ model: modelName, apiKey: apiKey });

    } else if (providerName === 'openrouter') {
      // https://openrouter.ai/docs/guides/community/langchain
      // https://docs.langchain.com/oss/javascript/integrations/chat/openai#custom-urls
      return new ChatOpenAI({
          model: modelName,
          apiKey: apiKey,
          configuration: { baseURL: 'https://openrouter.ai/api/v1' }
      });

    } else if (providerName === 'ollama') {
      return new ChatOllama({ model: modelName });

    } else {
      return undefined;
    }
  }
}
