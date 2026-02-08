import type { ModelInterface, GetOptions } from "../interfaces/model.interface.js";
import { type ModelStatic, Model, Sequelize, UniqueConstraintError, DatabaseError } from "sequelize";
import { ModelError, UniqueConstraintModelError, QueryModelError, NotFoundModelError } from '../interfaces/model-errors.js';


/**
 * Dictionnaire au format de l'objet à droite de:
 * where : { objet } dans les requêtes Sequelize.
 * https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#applying-where-clauses
 */
export type SequelizeQuery = Record<string, unknown>;


/**
 * Convertion entre le résultat des requêtes Sequelize (row)
 * et le type exposé par BaseModel TEntry.
 */
export interface EntryMapper<TEntry, TAddEntry>  {
  create(row: object): TEntry;
};


/**
 * Convertie toutes les exception Sequelize en un équivalant basé
 * sur ModelError.
 * https://sequelize.org/api/v6/identifiers.html#errors
 */
function convertToModelError(error: unknown): ModelError {

  // Erreurs en provenance de Sequelize à convertir
  if (error instanceof UniqueConstraintError ) {
    return new UniqueConstraintModelError(error.message);
  
  } else if (error instanceof DatabaseError) {
    /**
     * Erreur SQL brute renvoyée par la DB
     * colonne inexistante, fonction inconnue, 
     * mauavais alias/group by, bug schéma cassé
     */
    return new QueryModelError(error.message);
  }

  // Erreurs dérivées de ModelError à transmettre telles quelles
  if (error instanceof ModelError) {
    throw error;
  }

  // Autres erreurs inconnues
  if (error instanceof Error) {
    return new ModelError(error.message);
  }

  return new ModelError(String(error));
}


/**
 * Classe de base qui représente une table dans la base de donnée implémentée avec Sequelize.
 * Elle sert de base pour implémenter les models correspondants à chaque table.
 * 
 * Pour réaliser un modèle pour un format de table il suffit de paramétrer cette classe
 * avec des types personnalisés : TEntry, TId, TAddEntry, TRemoveEntry, TUpdateEntry
 * qui représente les différents champs.
 */
export class SequelizeBaseModel<TEntry, TId, TAddEntry, TRemoveEntry, TUpdateEntry> implements ModelInterface<TEntry, SequelizeQuery, TId, TAddEntry, TRemoveEntry, TUpdateEntry> {

  protected client : Sequelize;
  model: ModelStatic<Model> | undefined;
  #mapper: EntryMapper<TEntry, TAddEntry>;


  constructor(client: Sequelize, mapper: EntryMapper<TEntry, TAddEntry>) {
    this.client = client;
    this.#mapper = mapper;
  }


  init(): void {} // pour override


  /**
   * Renvoie la liste de tous les enregistrements de la table.
   * @param options - Options de tri et de sélection de colonnes.
   * @returns Tableau vide si aucun enregistrement n'existe.
   * @throws ModelError en cas d'erreur
   */
  async getAllEntries(options?: GetOptions): Promise<TEntry[]> {

    if (!this.model) {
      throw new ModelError('Modèle non initialisé');
    }

    try {

      // Construction de la requête au format Sequelize
      let request: any = { raw: true };
      
      if (options?.ordering !== undefined) {
        if (options.ordering.order === 'ascending') {
          request.order = [[options.ordering.columnName, 'ASC']];
        } else {
          request.order = [[options.ordering.columnName, 'DESC']];
        }
      }
  
      if (options?.attributes !== undefined) {
        request.attributes = options.attributes;
      }
      
      // findAll renvoie toujours un tableau
      const entries = await this.model.findAll(request);
      // Converstion model sequelize => TEntry
      return entries.map(e => this.#mapper.create(e));
    
    } catch (error) {
      throw convertToModelError(error);
    }
  }
  
  /**
   * Renvoie la liste des enregistrements de la table correspondants aux critères
   * définis dans `query`.
   * @param query - Filtres au format choisi par le paramétrage.
   * @param options - Options de tri et de sélection de colonnes.
   * @returns Tableau vide si aucun enregistrement ne correspond.
   * @throws ModelError en cas d'erreur
   */
  async getEntries(query: SequelizeQuery, options?: GetOptions): Promise<TEntry[]> {
    
    if (!this.model) {
      throw new ModelError('Modèle non initialisé');
    }
    
    try {

      // Construction de la requête au format Sequelize
      let request: any = { where : query, raw: true };
      
      // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping
      if (options?.ordering !== undefined) {
        if (options.ordering.order === 'ascending') {
          request.order = [[options.ordering.columnName, 'ASC']];
        } else {
          request.order = [[options.ordering.columnName, 'DESC']];
        }
      }

      if (options?.attributes !== undefined) {
        request.attributes = options.attributes;
      }
      
      // findAll renvoie toujours un tableau   
      //   
      const entries = await this.model?.findAll(request);
      // Converstion model sequelize => TEntry
      return entries.map(e => this.#mapper.create(e));
      
    } catch(error) {
      throw convertToModelError(error);
    }
  }


  /**
   * Renvoie le premier enregistrement qui satisfait les critères
   * définis dans `query`.
   * @param query - Filtres au format choisi par le paramétrage.
   * @returns `null` si aucun enregistrement ne correspond.
   * @throws ModelError en cas d'erreur
   */
  async getFirstEntry(query: SequelizeQuery): Promise<TEntry | null> {

    if (!this.model) {
      throw new ModelError('Modèle non initialisé');
    }
    
    try {

      // findOne renvoie null si aucun résultat 
      // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/?utm_source=chatgpt.com#findone
      const entry = await this.model.findOne({ where : query, raw: true });
      if (!entry) { return null; }
      return this.#mapper.create(entry);

    } catch(error) {
      throw convertToModelError(error);
    }
  }
  

  /**
   * Renvoie l'enregistrement dont l'identifiant correspond à `id`.
   * @param id - Identifiant de l'enregistrement.
   * @returns `null` si aucun enregistrement ne correspond.
   * @throws ModelError en cas d'erreur
   */
  async getEntryWithId(id: TId): Promise<TEntry | null> {

    if (!this.model) {
      throw new ModelError('Modèle non initialisé');
    }
    
    try {

      // findByPk renvoie null si aucun résultat 
      // https://sequelize.org/docs/v7/querying/select-methods/#findbypk
      const entry = await this.model.findByPk(id as any)
      if (!entry) { return null; }
      return this.#mapper.create(entry);

    } catch(error) {
      throw convertToModelError(error);
    }
  }

  /**
   * Crée un nouvel enregistrement dans la base de données.
   * @param entry - Objet contenant les champs à créer et leurs valeurs.
   * @returns L'entrée créée (avec les valeurs persistées), ou `null` si l'insertion a échoué.
   * @throws ModelError en cas d'erreur
   */
  async addEntry(entry: TAddEntry) : Promise<TEntry> {
    if (!this.model) {
      throw new ModelError('Modèle non initialisé');
    }
    
    try {

      // renvoie une exception en cas de doublons ou autre
      const newEntry = await this.model.create(entry as any);
      return this.#mapper.create(newEntry);

    } catch(error) {
      throw convertToModelError(error);
    }
  }


  /**
   * Met à jour l'enregistrement identifié par `id`.
   * @param id - Identifiant de l'enregistrement à mettre à jour.
   * @param entry - Champs à modifier et leurs nouvelles valeurs.
   * @returns L'entrée mise à jour, ou `null` si aucun enregistrement ne correspond à `id`.
   * @throws ModelError en cas d'erreur
   */
  async updateEntryWithId(id: TId, entry: TUpdateEntry) : Promise<TEntry | null> {

    if (!this.model) {
      throw new ModelError('Modèle non initialisé');
    }
    
    try {

      // findByPk renvoie null si aucun résultat 
      const entryToUpdate = await this.model.findByPk(id as any);
      if (!entryToUpdate) { throw new NotFoundModelError('Entrée non trouvée'); }
      const updatedEntry = await entryToUpdate.update(entry as any);
      return this.#mapper.create(updatedEntry);

    } catch(error) {
      throw convertToModelError(error);
    }
  }


  /**
   * Supprime un enregistrement.
   * @param entry - Données permettant d'identifier l'enregistrement à supprimer.
   * @returns Nombre d'enregistrements supprimés (0 ou 1).
   * @throws Une erreur si la requête échoue.
   */
  async removeEntry(entry: TRemoveEntry) : Promise<number> {

    if (!this.model) {
      throw new ModelError('Modèle non initialisé');
    }

    try {
      const record = await this.model.findOne({ where : entry as any });
      if (!record) { return 0; }
      record.destroy();
      return 1;

    } catch(error: unknown) {
      throw convertToModelError(error);
    }
  }

  /**
   * Supprime tous les enregistrements de la table.
   * @returns Nombre d'enregistrements supprimés.
   * @throws Une erreur si la requête échoue.
   */
  async removeAllEntries(): Promise<number> {

    if (!this.model) {
      throw new ModelError('Modèle non initialisé');
    }

    try {

      // Renvoie le nombre d'éléments supprimés
      return this.model.destroy({ where: {} });

    } catch(error: unknown) {
      throw convertToModelError(error);
    }
  }
};
