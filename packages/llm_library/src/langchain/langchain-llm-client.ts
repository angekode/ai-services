import { 
  type LLMClientInterface,
  type Message,
  type InferOptions,
  type InferResult
} from "../llm-client-interface.js";

import ChatsModels from "./chat/chat-models.js";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessage } from "@langchain/core/messages";


export default class LangchainLLMClient implements LLMClientInterface {

    async infer(messages: Message[], provider: string, model: string, options?: InferOptions) : Promise<InferResult> {
      const chatModel = ChatsModels.create(provider, model, options?.apiKey ?? '');
      if (!chatModel) {
        throw new Error('Model not created');
      }
      const chunk = await chatModel.invoke(messages.map(m => this.langChainMessage(m)));

      if (typeof chunk.content === 'string') {
        return { type: 'message', content: chunk.content };
      
      } else if (Array.isArray(chunk.content)) {
        const text = chunk.content
          .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
          .join('');

        if (!text) {
          return { type: 'error', message: 'No text content' };
        }

        return { type: 'message', content: text };

      } else {
        return { type: 'error', message: 'No text content' };
      }
    }


    private langChainMessage(message: Message) :  BaseMessage  {
      switch (message.role) {
        case 'user':
          return new HumanMessage(message.content);
        case 'assistant':
          return new AIMessage(message.content);
        case 'system':
          new SystemMessage(message.content);
        default: 
          throw new Error(`Unhandheld role ${message.role}`);   
      }
    }
}