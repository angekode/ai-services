import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'My API', version: '1.0.0' },
  },
  apis: ['./src/routes/**/*.ts'], // ou controllers, etc.
};

const openapiSpec = swaggerJSDoc(options);

export { openapiSpec };