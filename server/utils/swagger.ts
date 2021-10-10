import swaggerJSDoc from 'swagger-jsdoc';
import { writeFile } from 'fs/promises';

const options: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sample API',
      description:
        'Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.',
      version: '0.1.9',
    },
    servers: [
      { url: 'http://localhost:8080/', description: 'Local development server' },
      {
        url: 'http://staging-api.example.com',
        description: 'Optional server description, e.g. Internal staging server for testing',
      },
    ],
  },
  apis: ['./routes.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
const generateSwaggerJson = () => {
  try {
    writeFile('swagger.json', JSON.stringify(swaggerSpec, null, 2)).then(() => {
      console.log('Latest API spec has been written to swagger.json');
    });
  } catch (err) {
    console.error(err);
    return;
  }
};
generateSwaggerJson();

export default swaggerSpec;
