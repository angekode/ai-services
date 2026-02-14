/**
 * Abstraction des manipulations sur la base de données. L'objectif
 * est de pouvoir changer d'ORM sans toucher au code de l'application,
 * il suffit d'implémenter cette classe avec le nouvel ORM.
 */
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
