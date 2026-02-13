# Service Library

## Objectif

- Uniformiser le protocole de communication au niveau des headers entre tous les services.
- Uniformiser le protocole au niveau du body (à faire).
- Permettre de créer un controller pour un endpoint de manière modulaire.
- Mettre en place toute la chaine:
  - Validation et interprétation d'une requête entrante d'un service client.
  - Exécution des actions demandées par la requête entrante.
  - Renvoie d'une requête de réponse sortante vers le service client.

## Schéma général



### createController

- Création d'un controlleur avec la fonction template `createController`.
- `createController` est implémenté avec:
  - `RequestDecoder`: lit la requête d'entrée pour produire un `TCommand` et `TContext`.
  - `UseCase`: exécute les actions à partir des informations de `TCommand` et renvoie un `UseCaseResult`.
  - `RequestEncoder`: écrit la requête de sortie à partir des informations de `UseCaseResult`.

### Erreurs

- `BadInputError`, `ServerError`, `ProviderError`: objets à envoyer en exception en cas d'erreur, le controlleur généré par `createController` les captures pour renvoyer une erreur dans la requête de sortie.
- `ErrorEncoder`: à implémenter pour choisir le format de la requête de sortie à partir des infos dans l'objet Error.

### Header

- `encodeHeader` est déjà implémenté car tous les endpoints et service doivent avoir le même format de header pour le tracking.

### Exemple

On implémente toutes les classes et on crée un controlleur pour une nouvelle route:

```js
import express from 'express';
import { CustomReqDecoder, CustomUseCase, CustomResEncoder, CustomErrorEncoder } from './src/custom-endpoint/index.js';

const nouveauControlleur = createController(
  new CustomReqDecoder(),
  new CustomUseCase(),
  new CustomResEncoder(),
  new CustomErrorEncoder()
);

const app = express();
app.post('/nouveau-endpoint', nouveauControlleur);
app.listen('3000', () => console.log('serveur à l\'écoute'));
```