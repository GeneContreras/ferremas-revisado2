const express = require("express");
const multer = require("multer");
const ArticuloControlador = require("../controladores/articulo");

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imagenes/articulos/');
    },
    filename: function (req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname);
    }
});

const subidas = multer({ storage: almacenamiento });

// Ruta de prueba
router.get("/ruta-de-prueba", ArticuloControlador.prueba);

// HTTP

/**
 * @swagger
 * /api/crear:
 *   post:
 *     summary: Crea un nuevo artículo
 *     description: Crea un nuevo artículo con los datos proporcionados
 *     tags:
 *       - Artículos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Articulo'
 *     responses:
 *       200:
 *         description: Artículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *       400:
 *         description: Error en la solicitud, datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/crear", ArticuloControlador.crear);

/**
 * @swagger
 * /api/subir-imagen/{id}:
 *   post:
 *     summary: Sube una imagen para un artículo
 *     description: Sube una imagen para un artículo específico identificado por su ID
 *     tags:
 *       - Artículos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del artículo
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file0:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *       400:
 *         description: Imagen inválida
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloControlador.subir);

/**
 * @swagger
 * /api/articulos/{ultimos}:
 *   get:
 *     summary: Obtiene una lista de artículos
 *     description: Obtiene una lista de artículos, opcionalmente los últimos artículos
 *     tags:
 *       - Artículos
 *     parameters:
 *       - in: path
 *         name: ultimos
 *         schema:
 *           type: string
 *         description: Parámetro opcional para obtener los últimos artículos
 *     responses:
 *       200:
 *         description: Lista de artículos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Articulo'
 *       404:
 *         description: No se encontraron artículos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/articulos/:ultimos?", ArticuloControlador.listar);

/**
 * @swagger
 * /api/articulo/{id}:
 *   get:
 *     summary: Obtiene un artículo por su ID
 *     description: Obtiene los detalles de un artículo específico identificado por su ID
 *     tags:
 *       - Artículos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/articulo/:id", ArticuloControlador.uno);

/**
 * @swagger
 * /api/imagen/{fichero}:
 *   get:
 *     summary: Obtiene una imagen de artículo
 *     description: Obtiene una imagen de artículo específica identificada por su nombre de fichero
 *     tags:
 *       - Artículos
 *     parameters:
 *       - in: path
 *         name: fichero
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del fichero de imagen
 *     responses:
 *       200:
 *         description: Imagen obtenida exitosamente
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Imagen no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/imagen/:fichero", ArticuloControlador.imagen);

/**
 * @swagger
 * /api/buscar/{busqueda}:
 *   get:
 *     summary: Busca artículos por término de búsqueda
 *     description: Busca artículos que coincidan con el término de búsqueda proporcionado
 *     tags:
 *       - Artículos
 *     parameters:
 *       - in: path
 *         name: busqueda
 *         schema:
 *           type: string
 *         required: true
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Artículos encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Articulo'
 *       404:
 *         description: No se encontraron artículos
 *       500:
 *         description: Error interno del servidor
 */
router.get("/buscar/:busqueda", ArticuloControlador.buscador);

/**
 * @swagger
 * /api/articulo/{id}:
 *   delete:
 *     summary: Elimina un artículo por su ID
 *     description: Elimina un artículo específico identificado por su ID
 *     tags:
 *       - Artículos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/articulo/:id", ArticuloControlador.borrar);

/**
 * @swagger
 * /api/articulo/{id}:
 *   put:
 *     summary: Edita un artículo por su ID
 *     description: Edita los detalles de un artículo específico identificado por su ID
 *     tags:
 *       - Artículos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del artículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Articulo'
 *     responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *       400:
 *         description: Error en la solicitud, datos inválidos
 *       404:
 *         description: Artículo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/articulo/:id", ArticuloControlador.editar);

module.exports = router;