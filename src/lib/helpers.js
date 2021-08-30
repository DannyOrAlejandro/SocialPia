const bcrypt=require('bcryptjs');//MODULO PARA LA ENCRIPTACION
const helpers={}
//ENCRIPTAMOS CONTRASEÑAS
//lo que va luego del punto el el nomnbre que yo le asigne a la funcion helpers.name
helpers.encryptPassword=async (password)=>{//CREAMOS FUNCION DE NUETRO OBJETO HELPERS password EN TEXTO PLANO
    const salt=await bcrypt.genSalt(10); /*generamos un hash o un patro, el parametro es cuantas veces lo vamos a ejectuarlo,
    entre mas veces lo ejecutemos mas seguro sera el cifrado*/
    const hash=await bcrypt.hash(password,salt); /*PASAMOS EL HASH O PATRON QUE ME DEVUELVE EL
     SALT Y LAS CONTRASEÑA PARA QUE LA ENCRIPTE BASADO EN ESE PATRON*/
    return hash; //ME DEVUELVE EL CONTRASELA ENCRIPTADA*/
    //LO MISMO DE LOS COMENTAIOS ANTERIORES PERO DE FORMA RESUMIDA
}
helpers.matchPassword=async (password,savedPassword)=>{ //PARA EL LOGIN COMPARAR LA CONTRASELA ENCRYPTADA DE LA BASE DE DATOS CON LA QUE MAS PASA EL USUARIO EN TEXTO PLANO
        /*PARAMETROS CONTRASEÑA EN TEXTO PLANO QUE ME PASA EL USUARIO Y LA QUE TENGO ENCRIPTADA EN LA BASE 
        DE DATOS PARA COMPARARLAS ESTO ME DEVUELVE UN TRUE O UN FALSE PARA PODER TENER LA CONTRASEÑA LE DOY UN RETURN*/
        try{
            return await bcrypt.compare(password,savedPassword);
        }catch(err){
            console.log(err);
        }
}
module.exports=helpers;