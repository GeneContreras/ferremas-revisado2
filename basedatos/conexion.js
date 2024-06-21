const mongoose = require("mongoose");
//hacer el método con una función asíncrona async
const conexion = async() => {
    try{
        //esperara a conectarse
       await mongoose.connect("mongodb://127.0.0.1:27017/ferremas_test");//usar el nombre de la bbdd y para esta version de mongoose, usar la ip.
        //parametros dentro de objetos
        //useNewUrlParser: true
        //useUndefiedTopology: true
        //useCreateIndex: true
        console.log("conectado correctamente a la bbdd ferremas_test");
    } catch(error) {
        console.log(error);
        //excepción
        throw new Error("No se ha podido conectar a la bbdd");
    }
}
module.exports ={
    conexion
}