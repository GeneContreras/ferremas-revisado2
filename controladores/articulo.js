const Articulo = require("../modelos/Articulo");
const { validarArticulo } = require("../helpers/validar");
const fs = require("fs");
const path = require("path");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "test articulo"
    });
}

const crear = (req, res) => {
    //recoger los parametros por post a guardar
    let parametros = req.body;
    // validar datos

    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"
        });
    }
    //crear objeto o guardar

    const articulo = new Articulo(parametros); //asignar valores a objeto basado en el modelo automatico.

    //guardar el articulo en la base de datos. Para esta version no se utiliza callback**
    articulo.save()
        .then(articuloGuardado => {
            return res.status(200).json({
                status: 'success',
                articulo: articuloGuardado,
                mensaje: 'Articulo guardado con éxito'
            });
        })
        .catch(error => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha guardado el artículo: '
            });
        });
}

const listar = (req, res) => {
    let consulta = Articulo.find()
    if (req.params.ultimos) { //un filtro random
        consulta.limit(3); //devuelve los 3 ultimos
    }
    consulta.sort({ fecha: -1 }) //orden del mas reciente al mas antiguo
        .exec()
        .then(articulos => {
            if (!articulos || articulos.length === 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado artículos"
                });
            }
            return res.status(200).json({
                status: "success",
                parametro: req.params.ultimos, // si agrego parametros despues de la barra de la url, en este caso, puede ser un id.
                contador: articulos.length,
                articulos: articulos
                
            });
        })
        .catch(error => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al buscar los artículos: " + error.message
            });
        });
};

const uno = (req, res) => {
    // Recoger un ID por la URL
    let id = req.params.id;
    //select*from articulos where id = a lo que rescato de mongodb compass

    // Buscar el artículo por su ID
    Articulo.findById(id)
        .then(articulo => {
            // Si no se encontró ningún artículo con el ID proporcionado
            if (!articulo) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el artículo" + error.message
                });
            }
            // Si se encontró el artículo, devolverlo en la respuesta
            return res.status(200).json({
                status: "success",
                articulo: articulo
            });
        })
        .catch(error => {
            // Si ocurrió un error al buscar el artículo
            return res.status(500).json({
                status: "error",
                mensaje: "Error al buscar el artículo: " + error.message
            });
        });
};

const borrar = (req, res) => {
    let articuloId = req.params.id;
    Articulo.findOneAndDelete({ _id: articuloId })
        .then(articuloBorrado => {
            if (!articuloBorrado) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "El artículo no fue encontrado o ya ha sido eliminado" + error.message
                });
            }
            return res.status(200).json({
                status: "success",
                articulo: articuloBorrado,
                mensaje: "Artículo eliminado correctamente"
            });
        })
        .catch(error => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error al intentar borrar el artículo" + error.message
            });
        });
};


const editar = async (req, res) => {
    try {
        // Recoger artículo a editar
        const articuloId = req.params.id;
        // Recoger el dato del body
        const parametros = req.body;
        // Validar datos
        try {
            validarArticulo(parametros);
        } catch (error) {
            return res.status(400).json({
                status: "error",
                mensaje: "faltan datos por enviar" + error.message
            });
        }
        // Buscar y actualizar artículo
        const articuloActualizado = await Articulo.findOneAndUpdate({ _id: articuloId }, req.body, { new: true });
        if (!articuloActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo para actualizar"
            });
        }
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el artículo: " + error.message
        });
    }
};

const subir = async (req, res) => {

    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            mensaje: "Petición inválida"
        });
    }

    // Recoger artículo a editar
    const articuloId = req.params.id;

    // Verificar la extensión del archivo
    const archivo = req.file.originalname;
    const archivoSplit = archivo.split(".");
    const extension = archivoSplit[1];

    if (!["png", "jpg", "jpeg", "gif"].includes(extension.toLowerCase())) {
        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            if (error) {
                console.error("Error al borrar el archivo:", error);
            }
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen inválida"
            });
        });
    } else {
        try {
            // Buscar y actualizar artículo con la nueva imagen
            const articuloActualizado = await Articulo.findOneAndUpdate(
                { _id: articuloId },
                { imagen: req.file.filename },
                { new: true }
            );

            if (!articuloActualizado) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se encontró el artículo para actualizar"
                });
            }

            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                fichero: req.file
            });
        } catch (error) {
            console.error("Error al actualizar el artículo:", error);
            return res.status(500).json({
                status: "error",
                mensaje: "Error al actualizar el artículo"
            });
        }
    }
};

const imagen = (req, res) => {
    let fichero = req.params.fichero;

    // Validar la ruta del archivo
    if (!fichero) {
        return res.status(400).json({
            status: "error",
            mensaje: "Parámetro de ruta de archivo faltante"
        });
    }

    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, stats) => {
        if (error || !stats.isFile()) {
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe"
            });
        } else {
            // Enviar el archivo al cliente si existe
            return res.sendFile(path.resolve(ruta_fisica));
        }
    });
};
const buscador = (req, res) => {
    // Sacar el término de búsqueda
    let busqueda = req.params.busqueda;

    // Validar el término de búsqueda
    if (!busqueda) {
        return res.status(400).json({
            status: "error",
            mensaje: "Parámetro de búsqueda faltante"
        });
    }

    // Consultar artículos en la base de datos
    Articulo.find({
        $or: [
            { nombre: { $regex: new RegExp(busqueda, "i") } },
            { marca: { $regex: new RegExp(busqueda, "i") } }
        ]
    })
        .sort({ fecha: -1 })
        .exec()
        .then(articulosEncontrados => {
            if (!articulosEncontrados || articulosEncontrados.length === 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se encontraron artículos"
                });
            }

            return res.status(200).json({
                status: "success",
                articulos: articulosEncontrados
            });
        })
        .catch(error => {
            console.error("Error al buscar artículos:", error);
            return res.status(500).json({
                status: "error",
                mensaje: "Error al buscar artículos en la base de datos"
            });
        });
};

module.exports = {
    prueba,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}