const validator = require("validator");

const validarArticulo = (parametros) => {


    let validar_codigo_del_producto = !validator.isEmpty(parametros.codigo_del_producto);

    let validar_marca = !validator.isEmpty(parametros.marca);

    let validar_codigo = !validator.isEmpty(parametros.codigo);

    let validar_nombre = !validator.isEmpty(parametros.nombre);

    let validar_valor = !validator.isEmpty (parametros.valor)

    if(!validar_codigo_del_producto || ! validar_marca || ! validar_codigo || !validar_nombre ||  !validar_valor  ){
        throw new Error ("no se ha validado la información");
    }

}

module.exports = {
    validarArticulo
}