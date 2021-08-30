//CONFIGURAMOS E IMPORTAMOS EL MODULO TIMEAGO.JS PARA QUE EL USURIO PUEDA VER HACE CUNTO TIEMPO HIZO EL REGISTRO
//DECIMOS COMO VA A COMPORTARSE EL MODULO TIMEAGO
const {format}=require('timeago.js');
const helpers={};
helpers.timeago=(timestamp)=>{//CREAMOS METODO DEL OBJETO HELPERS, TIMESTAMP EL ES FORMATO EN EL QUE ETA EN LA BASE DE DATOS
    return format(timestamp); /*DESDE timeago.js Utiliza el metodo format que
    hace que toma el timestamp y nos da un formato de 2 minutos atras
     o 3 minutos atras y asi es decir cuanto tiempo ha pasado desde que se hizo el registro en la base de datos*/
};

module.exports=helpers;
