const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { conexion } = require("./basedatos/conexion");

function createServer() {
  const app = express();

  // Configuración de middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rutas
  const rutas_articulo = require("./rutas/articulo");
  app.use("/api", rutas_articulo);

  // Rutas de prueba
  app.get("/probando", (req, res) => {
    return res.status(200).send("<div><h1>Probando</h1></div>");
  });

  app.get("/", (req, res) => {
    return res.status(200).send("<h1>funcionando ok</h1>");
  });

  return app;
}

async function startServer(app, port = 3900) {
  await conexion(); // Conectar a la base de datos
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log("Servidor corriendo en el puerto " + port);
      resolve(server);
    });
  });
}

// Si este archivo se ejecuta directamente (no importado como módulo)
if (require.main === module) {
  const app = createServer();
  startServer(app);
}

module.exports = { createServer, startServer };