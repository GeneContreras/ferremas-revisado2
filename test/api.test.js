const request = require('supertest');
const mongoose = require('mongoose');
const { createServer, startServer } = require('../index');
const { conexion } = require('../basedatos/conexion');

describe('API de Artículos', () => {
  let app;
  let server;

  beforeAll(async () => {
    await conexion();
    app = createServer();
    server = await startServer(app, 0); // Puerto 0 para que asigne uno automáticamente
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
  });

  describe('POST /api/crear', () => {
    it('debería crear un nuevo artículo', async () => {
      const res = await request(app)
        .post('/api/crear')
        .send({
          codigo_del_producto: '002',
          marca: 'Marca Integración',
          codigo: 'INT002',
          nombre: 'Artículo Integración',
          valor: '200'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('articulo');
    });
  });
});