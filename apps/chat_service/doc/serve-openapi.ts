import { openapiSpec } from "./swagger-config";
import express from 'express';
import swaggerUi from 'swagger-ui-express';


const app = express();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.listen(3010, () => console.log('Serveur doc lancé sur http://localhost:3010/docs'));