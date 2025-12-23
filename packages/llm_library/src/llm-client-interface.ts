/**
 * Permet d'envoyer des requêtes et recevoir des réponses d'inférence et d'embeddings
 * sur des API de LLM de manière générique en indiquant uniqument le nom du fournisseur
 *  et du modèle LLM en chaines de caractère.
 * 
 * L'objectif est de faire abstraction de la couche de communication avec les fournisseurs,
 * qui peuvent avoir des adresses différentes, des formats d'API différentes, qui peuvent être
 * local à la machine ou sur internet.
 * 
 * C'est l'implémentation de l'interface qui choisit les fournisseurs et modèles supportés.
 * 
 */
export interface LLMClientInterface {
  /**
   * Génère une inférence non stream à partir de la liste de messages.
   * 
   * @param - Historique des messages du contexte, le dernier message servant de question avec le role de 'user' ou 'system'.
   * @param provider - Nom codifié du fournisseur de LLM.
   * @param model - Nom codifié du modèle LLM.
   * @param options -  Clé d'authentification chez le fournisseur, adresse url de l'API si besoin.
   */
  infer(messages: Message[], provider: string, model: string, options?: InferOptions) : Promise<InferResult>;

  /**
   * Renvoie une fonction génératrice qui envoie le résultat de l'inférence par morceaux de texte.
   * 
   * @param - Historique des messages du contexte, le dernier message servant de question avec le role de 'user' ou 'system'.
   * @param provider - Nom codifié du fournisseur de LLM.
   * @param model - Nom codifié du modèle LLM.
   * @param options -  Clé d'authentification chez le fournisseur, adresse url de l'API si besoin.
   */
  inferStream(messages: Message[], provider: string, model: string, options?: InferOptions) : AsyncGenerator<InferStreamResult>;

  /**
   * Convertit les chaines de caractère en vecteurs d'embeddings de dimensions identiques entre eux.
   * 
   * @param texts - Chaines à convertir.
   * @param provider - Nom codifié du fournisseur de LLM.
   * @param model - Nom codifié du modèle LLM.
   * @param options - Clé d'authentification chez le fournisseur.
   */
  embed(texts: TextChunk[], provider: string, model: string, options?: EmbedOptions) : Promise<EmbedResult>;

  /**
   * Renvoie la liste des vecteurs d'embeddings les plus proches sémentiquement de la chaine donnée en target.
   * 
   * @param string - La chaine de référence par rapport à laquelle la similarité sémentique est calculée.
   * @param vectors - Vecteurs d'embeddings à compararer sémentiquement avec la chaine.
   * @param provider - Nom codifié du fournisseur de LLM.
   * @param model - Nom codifié du modèle LLM.
   * @param options - Clé d'authentification chez le fournisseur et le nombre de résultat de similarité maximal à retourner (le n plus similaires).
   */
  calculateSimilarity(target: string, vectors: EmbedVector[], provider: string, model: string, options?: SimilarEmbeddingsOptions): Promise<SimilarityResult[]>;
}


export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type InferOptions = {
  apiKey?: string,
  gatewayUrl?: string
};

export type InferResult = 
{ 
  type: 'message',
  content: string,
  metadata: Record<string, any>,
  id: string | undefined,
} |
{ 
  type: 'error',
  message: string 
};

export type InferStreamResult = 
  { type: "message.delta", content: string, metadata: Record<string, any>, id: string | undefined } | 
  { type: "message.done" } |
  { type: "error", message: string };

export type TextChunk = {
  content: string;
  metaData: Record<string, string>;
};

export type EmbedOptions = {
  apiKey?: string;
}

export type EmbedVector = number[];

export type EmbedResult = number[][];

export type SimilarityResult = {
  index: number;
  similarity: number;
};

export type SimilarEmbeddingsOptions = { 
  apiKey?: string;
  maxResultCount?: number;
};

