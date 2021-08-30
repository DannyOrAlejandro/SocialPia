
//SABER SI UN USUARIO ESTA LOGUEADO PARA PROTEGER LAS VISTAS
module.exports={
    isLoggedIn(req,res,next){
        if(req.isAuthenticated()){//ME DEVUELVE TRUE O FALSE SI EL USUARIO EXISTE O NO OSEA SI SE HA LOGEADO O NO
            return next();
        }else{
            return res.redirect('/signin');
        }
    },
    isNotLoggedIn(req,res,next){
        if (!req.isAuthenticated()) {//SI NO ESTA LOGEADO SIGA CON EL PROSESO NORMAL, SI ESTA LOGEADO NO PUEDE VER LA VISTA DE LOGIN O LOGUP
            return next();
        }else{
            return res.redirect('/profile');
        }
    }

}