const mysql=require('mysql'); //MODULO PARA LA CONNECCION
const {promisify}=require('util');//MODULO PARA PODER USAR PROMESAS YA EL MODULO MYSQL NO LAS SOPORTA
const {database} =require('./keys');//DESECTRUCTURACION DEL OBJETO SOLO LLAMO EL OBJETO DATABASE
const pool=mysql.createPool(database);//CREO CONECCION
pool.getConnection((err,connection)=>{ //UTILIZO LA CONECCION ANTES DE EXPORTARLA PARA NO TENER QUE HACER ESTO A CADA RATO
    if (err) {      //VALIDO ERRORES MAS COMUNES
        if(err.code==='PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }else if(err.code==='ER_CON_COUNT_CONNECTION'){
            console.error('DATA BASE HAS TO MANY CONNECTIONS');
        }else if(err.code==='ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }else{
            console.log(err);
        }
    }else{//SI NO HAY ERRORES
        if(connection){
            connection.release();
            console.log('DataBase Is Connected');
            return;
        }
    }
})
//Promisify Pool Query 
//COMBIERTO A PROMESAS LO QUE ANTES ERAN CALLBACKS
pool.query=promisify(pool.query);//SOLO COMVIERTO LOS METODOS QUEN EMPIEZEN CON QUERY
//Con esto ya puedo hacer consutas ala base de datos

module.exports=pool;