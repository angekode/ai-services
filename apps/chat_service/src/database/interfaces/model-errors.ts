/**
 * Erreur de base renvoyée en cas d'erreur:
 * - Par l'utilisateur d'une méthode d'une instance de la classe ModelInterface
 * - De l'ORM utilisé en interne
 * 
 * Les erreurs de l'ORM et de l'utilisateur doivent être traduites en ModelError,
 * mais pas les autres erreurs lancées par JavaScript.
 * 
 * L'objectif est de standardiser les exceptions lancées par les classes qui
 * implémentent ModelInterface et de faire abstraction des erreurs spécifiques
 * à chaque ORM.
 */
export class ModelError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Quand la contrainte unique est violée par une requête
 */
export class UniqueConstraintModelError extends ModelError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Erreur de syntaxe détectée dans une requête
 */
export class QueryModelError extends ModelError {
  constructor(message: string) {
    super(message);
  }
}


/**
 * L'élément n'existe pas dans la base
 */
export class NotFoundModelError extends ModelError {
  constructor(message: string) {
    super(message);
  }
}