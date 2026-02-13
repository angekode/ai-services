import { Embeddings } from "@langchain/core/embeddings";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { OllamaEmbeddings  } from "@langchain/ollama";
import { OpenAIEmbeddings } from "@langchain/openai";


/*
| Provider             | Package                      | Classe Embeddings                |
| -------------------- | ---------------------------- | -------------------------------- |
| **OpenAI**           | `@langchain/openai`          | `OpenAIEmbeddings`               |
| **Azure OpenAI**     | `@langchain/azure-openai`    | `AzureOpenAIEmbeddings`          |
| **Anthropic**        | `@langchain/anthropic`       |                                  |
| **Google Gemini**    | `@langchain/google-genai`    | `GoogleGenerativeAIEmbeddings`   |
| **Google Vertex AI** | `@langchain/google-vertexai` | `VertexAIEmbeddings`             |
| **AWS Bedrock**      | `@langchain/aws`             | `BedrockEmbeddings`              |
| **Mistral**          | `@langchain/mistralai`       | `MistralAIEmbeddings`            |
| **Cohere**           | `@langchain/cohere`          | `CohereEmbeddings`               |
| **Groq**             | `@langchain/groq`            |                                  |
| **Fireworks**        | `@langchain/fireworks`       | `FireworksEmbeddings`            |
| **Together AI**      | `@langchain/together`        | `TogetherAIEmbeddings`           |
| **Ollama (local)**   | `@langchain/ollama`          | `OllamaEmbeddings`               |
| **Hugging Face**     | `@langchain/community`       |  `HuggingFaceInferenceEmbeddings`|
*/


export default class EmbeddingsModels {

  /**
   * Permet d'instancier des models de type Embeddings (ex: OpenAIEmbeddings, MistralAIEmbeddings)
   * de manière générique à partir d'informations en chaine de caractère.
   * 
   * @example
   * const { provider, model, key } = ...
   * const genericModel = EmbeddingsModels.create(provider, model, key);
   * const document : Document[] = await pdfLoader.load();
   * const messenger = new DocumentTransformer(document, genericModel);
   * ...
   */
  static create(providerName: string, modelName: string, apiKey: string) : Embeddings {
    if (providerName === 'openai') {
      return new OpenAIEmbeddings({ model: modelName, apiKey: apiKey });
      
    } else if (providerName === 'mistralai') {
      return new MistralAIEmbeddings({ model: modelName, apiKey: apiKey });

    } else if (providerName === 'ollama') {
      return new OllamaEmbeddings({ model: modelName });

    } else {
      throw new Error(`Provider ${providerName} non pris en charge`);
    }
  }
}
