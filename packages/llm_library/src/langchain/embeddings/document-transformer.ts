import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import type { DocumentInterface } from "@langchain/core/documents";
import { Embeddings } from "@langchain/core/embeddings";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


/**
 * Effectue la phase 'Retrieval' du RAG: 
 * - Découpage d'un document en plusieurs morceaux.
 * - Sélection des morceaux les plus pertinants (= sémentique la plus proche d'un texte donné)
 * 
 * @example
 * 
 * const document : Document[] = await pdfLoader.load();
 * const embdeddingsModel = EmbeddingsModels.create(...);
 * const documentTransformer = new DocumentTransformer(document, embeddingsModel);
 * const mostRelevantChunks : DocumentInterface[] = await documentTransformer.similaritySearch('La vie des castors');
 */
export default class DocumentTransformer {

  document: Document[];
  
  #embeddingsModel: Embeddings;
  #splittedDocument: Document[] | undefined;
  #vectorStore: MemoryVectorStore | undefined;


  constructor(document: Document[], embeddingsModel: Embeddings) {
    this.#embeddingsModel = embeddingsModel;
    this.document = document;
  }


  /**
   * @param str une phrase qui contient le sujet
   * @returns une liste de 4 morceaux du documents qui on la sémentique la plus proche du sujet donné
   */
  async similaritySearch(str: string) : Promise<DocumentInterface[]> {
    if (this.#splittedDocument === undefined) {
      this.#splittedDocument = await this.#getSplitDocument();
    }
 
    if (this.#vectorStore === undefined) {
      this.#vectorStore = await MemoryVectorStore.fromDocuments(this.#splittedDocument, this.#embeddingsModel);
    }

    return this.#vectorStore.similaritySearch(str);    
  }


  async #getSplitDocument() : Promise<Document[]> {
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 400, chunkOverlap: 40 });
    return await splitter.splitDocuments(this.document);
  }
}
