const {Schema, model} = require("mongoose");

const ArticuloSchema = Schema({
    
    codigo_del_producto: {
        type: String,
        require:true
    },

    marca: {
        type: String,
        require:true
    },

    codigo: {
        type: String,
        require: true
    },

    nombre: {
        type: String,
        require:true
    },

    fecha: {
        type: Date,
        default: Date.now
    },

    foto: {
        type: String,
        default: "default.png"
    },

    valor: {
        type: Number,
        require:true
    }

});

module.exports = model("Articulo", ArticuloSchema, "articulos");

