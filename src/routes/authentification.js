//PUEDO TENER ESTA RUTA EN EL MISMO ARCHIVO DE links.js PERO PARA MAS ORDEN Y YO ENTERNDERLO MEJOR A FUTURO LOS SEPARE
const express=require('express');
const router=express.Router();
const passport=require('passport');
const {isLoggedIn,isNotLoggedIn}=require('../lib/auth'); /*IMPORTO CON CREADO POR MI PARA PROTEGER
LAS VISTAS LO EJECUTO EN LA RUTAS QUE QUIERO PROTEGER IMPORTO CON CREADO POR MI PARA PROTEGER VISTAS,
EN ESTE CASO LLAMO LA FUNCION PARA SABER SI ESTA LOGEADO O NO SI ESTA LOGEADO NO PUEDE VER LAS VISTAS SIGNIN O SIGNUP 
Y SI NO ESTA LOGEADO SI LAS PUEDE VER*/
router.get('/signup',isNotLoggedIn,(req,res)=>{
    res.render('autentification/signup'); 
})
//se diferencian en la peticion un para renderizar la vista y otra para recolectar lo datos
//RUTA PARA LA AUTENTIFICACION

/*
router.post('/signup',(req,res)=>{
    passport.authenticate('local.signup',{//EL PRIMER PARAMTRO ES EL NOMBRE DE LA AUTENTIFICACION QUE CREAMOS
        successRedirect:'/profile',//QUE HACER SI TODO FUNCIONA CORRECTAMENTE, SI EL USURAIO SE AUTENTIFICO CORRECTAMENTE, LO REDIRECCIONA
        failureRedirect:'/signup',//CUANDO FALLA LA AUTENTIFICACION, LO REDIRECCIONA
        failureFlash:true       //SI RECIBIRA UN MANSAJE EN CASO DE QUE FALLER POR EL MODULO FLASH
    });
console.log(req.body);
})//ESTO SE PUEDE HACER DE FORMA MAS EFICAZ Y CORTA ASI*/

router.post('/signup',isNotLoggedIn,passport.authenticate('local.signup',{ //SIN PASARLE REQ O RES
    successRedirect:'/profile',
    failureRedirect:'/signup',
    failureFlash:true
}));//VIAJAN HASTA EL ARCHIVO PRINCIPAL DE AHI A MI AUTENTIFICACION QUE HE CREADO Y LES HAGO CIERTO PROCESO
router.get('/signin',isNotLoggedIn,(req,res)=>{
    res.render('autentification/signin');
})
router.post('/signin',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local.signin',{//ASI Y NO COMO ANTES PARA HACER AUTENTIFICACION MAS FACIL
        successRedirect:'/profile',
        failureRedirect:'/signin',
        failureFlash:true
    })(req,res,next);
})

router.get('/profile',isLoggedIn,(req,res)=>{//ANTES DE EJECUTAR LA LOGICA LLAMA MI FUNCION PARA VER SI EL USURAIO ESTA AUTENTICADO isLoggedIn
    res.render('profile');
})
router.get('/logout',isLoggedIn,(req,res)=>{ //CERRAR SESION
    req.logOut();
    res.redirect('/signin');
})
module.exports=router;