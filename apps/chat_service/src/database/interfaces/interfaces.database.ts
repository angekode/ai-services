export interface DatabaseInterface {
  /**
   * Établit la connexion à la base de données.
   * Doit être appelée avant toute autre opération.
   * @returns Promise résolue une fois la connexion établie.
   * @throws Une erreur si la connexion échoue.
   */
  connect(): Promise<void>;

  /**
   * Crée les tables / schémas nécessaires à l'application.
   * En général appelée après `connect()`.
   * @returns Promise résolue une fois les tables créées.
   * @throws Une erreur si la création échoue.
   */
  createTables(): Promise<void>;

  /**
   * Crée/enregistre les modèles côté ORM (définition des entités, relations, etc.).
   * En général appelée après `createTables()`.
   * @returns Promise résolue une fois les modèles créés.
   * @throws Une erreur si la création échoue.
   */
  createModels(): Promise<void>;
}


export type GetOptions = {
  ordering?: {
    order: 'ascending' | 'descending';
    /** Nom de la colonne utilisée pour le tri. */
    columnName: string;
  };

  /**
   * Liste de colonnes à récupérer (projection).
   * Si absent, l’ORM peut renvoyer toutes les colonnes.
   */
  attributes?: string[];
};


/**
 * Abstraction des opérations sur les bases de données.
 * Permet de changer plus facilement d'ORM sans toucher au code de l'application
 * qui veut accéder à la base de données.
 *
 * Il y a 2 étapes pour utiliser cette interface:
 *
 * 1) Implémenter la classe pour chaque fonction qui s'occupent de la logique
 *    de l'ORM choisit (ex: Base<ORM>Model extends ModelInterface).
 * 2) Paramétrer la classe obtenue Base<ORM>Model avec des types personnalisés
 *    représentant un type de table avec ses colonnes.
 *
 * @typeParam TEntry - Type représentant une ligne/entrée renvoyée par la table.
 * @typeParam TQuery - Type représentant le format des filtres utilisés pour les requêtes.
 * @typeParam TId - Type de l'identifiant unique (ex: number, string, UUID...).
 * @typeParam TAddEntry - Type représentant les données nécessaires à la création d'une entrée.
 * @typeParam TRemoveEntry - Type représentant les données nécessaires à la suppression d'une entrée.
 * @typeParam TUpdateEntry - Type représentant les données modifiables lors d'une mise à jour.
 */
export interface ModelInterface<
  TEntry,
  TQuery,
  TId,
  TAddEntry,
  TRemoveEntry,
  TUpdateEntry
> {

  /**
   * Toutes les actions à effectuer requises par l'ORM pour pouvoir
   * agir sur la base de données (enregistrement du modèle, associations, etc.).
   *
   * Cette méthode ne doit pas effectuer de requête métier : uniquement
   * l'initialisation du modèle côté ORM.
   */
  init(): void;


  /**
   * Renvoie la liste de tous les enregistrements de la table.
   * @param options - Options de tri et de sélection de colonnes.
   * @returns Tableau vide si aucun enregistrement n'existe.
   * @throws Une erreur si la requête échoue.
   */
  getAllEntries(options?: GetOptions): Promise<TEntry[]>;


  /**
   * Renvoie la liste des enregistrements de la table correspondants critères
   * définis dans `TQuery`.
   * @param query - Filtres au format choisi par le paramétrage.
   * @param options - Options de tri et de sélection de colonnes.
   * @returns Tableau vide si aucun enregistrement ne correspond.
   * @throws Une erreur si la requête échoue.
   */
  getEntries(query: TQuery, options?: GetOptions): Promise<TEntry[]>;


  /**
   * Renvoie le premier enregistrement qui satisfait les critères
   * définis dans `TQuery`.
   * @param query - Filtres au format choisi par le paramétrage.
   * @returns `null` si aucun enregistrement ne correspond.
   * @throws Une erreur si la requête échoue.
   */
  getFirstEntry(query: TQuery): Promise<TEntry | null>;


  /**
   * Renvoie l'enregistrement dont l'identifiant correspond à `id`.
   * @param id - Identifiant de l'enregistrement.
   * @returns `null` si aucun enregistrement ne correspond.
   * @throws Une erreur si la requête échoue.
   */
  getEntryWithId(id: TId): Promise<TEntry | null>;


  /**
   * Crée un nouvel enregistrement dans la base de données.
   * @param entry - Objet contenant les champs à créer et leurs valeurs.
   * @returns L'entrée créée (avec les valeurs persistées), ou `null` si l'insertion a échoué.
   * @throws Une erreur si la requête échoue (selon l'implémentation).
   */
  addEntry(entry: TAddEntry): Promise<TEntry | null>;


  /**
   * Supprime un enregistrement.
   * @param entry - Données permettant d'identifier l'enregistrement à supprimer.
   * @returns Nombre d'enregistrements supprimés (souvent 0 ou 1).
   * @throws Une erreur si la requête échoue.
   */
  removeEntry(entry: TRemoveEntry): Promise<number>;


  /**
   * Met à jour l'enregistrement identifié par `id`.
   * @param id - Identifiant de l'enregistrement à mettre à jour.
   * @param entry - Champs à modifier et leurs nouvelles valeurs.
   * @returns L'entrée mise à jour, ou `null` si aucun enregistrement ne correspond à `id`.
   * @throws Une erreur si la requête échoue.
   */
  updateEntryWithId(id: TId, entry: TUpdateEntry): Promise<TEntry | null>;


  /**
   * Supprime tous les enregistrements de la table.
   * @returns Nombre d'enregistrements supprimés.
   * @throws Une erreur si la requête échoue.
   */
  removeAllEntries(): Promise<number>;
}
