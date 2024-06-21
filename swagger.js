const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Rest Ferremas.js',
      version: '1.0.0',
      description: 'Documentación de la API Rest con Swagger',
    },
    components: {
      schemas: {
        Articulo: {
          type: 'object',
          required: ['nombre', 'precio'],

          properties: {

            _id: {
              type: 'string',
              description: 'ID único del artículo generado por MongoDB',
            },

            codigo_del_producto:{
              type: 'string',
              description: 'Código general de Ferremas',
            },

            marca: {
              type: 'string',
              description: 'Marca del artículo',
            },

            codigo:{
              type: 'string',
              description: 'Código según categoría del artículo',
            },

            nombre: {
              type: 'string',
              description: 'Nombre del artículo',
            },

            valor: {
              type: 'number',
              description: 'Precio del artículo',
            },
            imagen: {
              type: 'string',
              description: 'Nombre del archivo de imagen del artículo',
            },
          },
        },
      },
    },
  },
  apis: ['./rutas/*.js'], // Ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
