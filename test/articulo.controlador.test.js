const ArticuloControlador = require('../controladores/articulo');
const Articulo = require('../modelos/Articulo');
const { validarArticulo } = require('../helpers/validar');

jest.mock('../modelos/Articulo');
jest.mock('../helpers/validar');

describe('ArticuloControlador', () => {
  describe('crear', () => {
    it('debería crear un artículo exitosamente', async () => {
      const req = {
        body: {
          codigo_del_producto: '001',
          marca: 'Marca Test',
          codigo: 'COD001',
          nombre: 'Artículo Test',
          valor: '100'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      validarArticulo.mockImplementation(() => true);
      Articulo.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
          _id: '123',
          ...req.body
        })
      }));

      await ArticuloControlador.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        articulo: expect.any(Object)
      }));
    });
  });
});