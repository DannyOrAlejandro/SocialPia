const passport=require('passport');/*PARA HACER LAS AUTENTIFICACIONES LO MAS PROFESIONAL POSIBLE Y ASI SU VEZ ES MAS 
SENCILLO DE ULTILIZAR PASSPORT ES UN MIDLEWEARE*/
const helpers=require('../lib/helpers');//ENCRIPTAR CONTRASELA ARCHIV CREADO POR MI
const pool=require('../database');
const LocalStrategy=require('passport-local').Strategy;//TRABAJA JUNTO CON PASSPORT-LOCAL Y LOS DOS CON EXPRESS-SESSION
/*PUEDO SELECCIONAR QUE TIPO DE AUTNTIFICACION QUIERO ATRAVEZ DE FACEBOOK TWITER EMAIL,ETC EN MI CASO LO HARE LOCAL OSEA CON 
MI PROPIA BASE DE DATOS
AUTENTIFICACION PARA EL SIGNIN INISIO DE SESION*/
passport.use('local.signin',new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true //POR SI DEPRONTO LO LLEGO ASAR DEJARLO PREPARADO, NO NESECITO MAS DATOS QUE LOS ANTERIORES
},async (req,username,password,done)=>{
    const rows=await pool.query('SELECT * FROM users WHERE username=?',[username]);
    console.log('imprimeindo rows',req.body);
    if (rows.length>0) {
        const user=rows[0];
        const validPassword=await helpers.matchPassword(password,user.password);//VALIDAMOS QUE LA CONTRASEÑA SEAN IGUALES, ESTO ME DUVIELVE TRUE O FALSE
        console.log(validPassword);
        console.log(user);
        console.log(user.password);
        console.log(password);
        if (validPassword) {
           done(null,user,req.flash('success','Welcome '+user.fullname));
        }else{
            done(null,false,req.flash('message','Incorrect Password'));//NO HAY UN ERROR COMO TAL SI NO LO ENCUNTRA,COMO NO LO ENCONTRO NO LE PASA NINGUN USURAIO
        }
    }else{
        
        return done(null,false,req.flash('message','The UserName Does Not Exist'))
    }
}))


/*primer parametro es el nombre de la autentificacion y el 
segundo es instanciar, inicializar el (passport-local).strategy y en el objeto lo que queremos recibir
AUTENTIFICACION PARA EL SIGNUP REGISTRO*/
passport.use('local.signup',new LocalStrategy({
    usernameField:'username',   //NOMBRE DE USUARIO EL name DEL CAMPO EN EL FORM
    passwordField:'password',   //CONTRASEÑA EL name DEL CAMPO EN EL FORM
    passReqToCallback:true      //ESTO SI VOY A ACEPTAR EL OBJETO REQUEST PARA RECIBIR MAS DATOS PARA LA AUTENTIFICACION
},async (req,username,password,done)=>{
    /*ASYNC PARA TENER LA PALABRA CALVE AWAIT DISPONIBLE Y TRABAJAR CON PROCESOS ASINCRONIS RECUARDO
    QUE AWAIT ESPERA A QUE SE EJECUTE UNA LIENA DE COD QUE LLEVE ALGO DE TIEMPO EJECUTARSES COMO UNA CONSULTA SQL,
    ES ASINCRONA PORQUE NODEJS MANDA LAS PETICIONES EL A COSAS Y SIGUE EJECUTANDOSE ASYNC AWAIT ES PARA QUE ESPERE 
    LA RESPUESTE, EL MANDA LA PETICION A SQL DE LA CONSULTA Y SEGURIA CON EJECUTANDOSE HASTA QUE SQL LE DIGA QUE YA
    ACABO Y LE PASE EL RESULTADO O UNA PETICION A SISTEMA OERATIVO O UNA ENTIDAD AJENA A NODEJS ASYNC Y AWAIT ES PARA
    QUE PARE DE EJECUTARSE Y ESPERE ESA RESPUESTA CUANDO LA TENGA SEGUIRA EJECUTANDOSE.
    ESTE CALLBACK LUEGO DEL OBJETO CON LAS COFIGURACIONES usernameField O passwordField O passReqToCallBack SIRVE PARA
    RECIBIR MAS DATOS PARAMETRO res PARA RECIBIR MAS DATOS UN username UN password Y TAMBIEN 
    UN done QUE ES OTRO CALLBACK QUE SE EJECUTA UNA VEZ ACABEMOS CON EL PROCESO DE AUTENTIFICACION PARA PODER SEGUIR 
    EJECUTANDO MAS CODIGO QUE HAYA EN EL SERVIDOR COMO POR EJEMPLO GUARDAR IMAGENES*/
    
    //COMPROBAMOS QUE EL NOMBRE DE USUARIO NO ESTE REPETIDO
    const validUserName= await pool.query('SELECT * FROM users WHERE username=?',[username]);
    if (validUserName.length>0) {
        done(null,false,req.flash('message','This UserName Already Is Used, Please Select One Different'));
    }else{
        const {fullname}=req.body;
    const newUser={
        username,
        password,
        fullname
    }
    newUser.password=await helpers.encryptPassword(password); //ENCRIPTAMOS LA CONTRASEÑA ANTES DE GURDARLA LLAMANDO AL ARVHIVO HELPES DONDE ENCRYPTO LA CONTRASEÑA
    const result=await pool.query('INSERT INTO users SET ?',[newUser]);
    newUser.id=result.insertId; //AGREGAMOS LA PROPIEDAD id AL OBJETO newUser LA CONSUTA ME DEVIELVE UN OBJETO CON DIVERSA INFORMACION ENTRE ELLA EL ID QUE LE ASIGNO
    return done(null,newUser); //null POR SI HAY UN ERROR SINO EL OBJETO newUser PARA CREAR UNA SESION EN EL METODO DE ABAJO
    }
    
}))
/*PARA PODER USAR TODO ESTO NESECITO LLAMARLO DESDE EL ARCHIVO PRINCIPAL PARA ESTO NESECITO DEFINIR BIEN EL local.signup
QUE ES EL NOMBRE QUE LE PUSUMOS A NUESTRA AUTENTIFICACION PARA DEFINIRLO BIEN NESECITAMOS UNOS CUANTOS MIDDLEWEARES
DESDE PASSPORT EN SU DOCUMETACION NOS DICE QUE DEBEMOS DEFINIR DOS PARTES DE PASSPORT UNA PARA SERIALIZAR EL USUARIO
Y OTRA PARA DESERIALIZARLO ESTO ES UN PROSESO DE COMO PASSPORT VA A FUNCIONAR INTERNAMENTE

PARA SERIALIZAR EL USUARIO*/
passport.serializeUser((user,done)=>{//RECIBIRA UN USUARIO Y UN CALLBACK DONE PARA GUARDAR EL ID DEL USUARION EN SESION PARA UNA FUTURA PETICIION
    done (null,user.id); //SERIALIZAR ES GUARDAR EL ID DEL USUARIO
});
passport.deserializeUser(async (id,done)=>{//DESERIALIZAR ES USAR ESE ID PARA VOLVER A TOMAR LOS DATOS DEL PERFIL SE USUARIO
    const rows= await pool.query('SELECT * FROM users WHERE id=?',[id]);
    done(null,rows[0]); //DEL OBJETO QUE ME DEVUELVE SOLO LO QUE NESESITO LA POSICION 0 EL ID
});//ESTO ES COMO ABRIR Y CERRAR SESION CREO
/*PASSPORT YA LO HEMOS DEFINIDO PERO LA APLICACION NO CONOCE DE EL HASTA QUE LO IMPORTEMOS EN EL ARCHIVO PRINCIPAL
NO PARA DEFINIR ARUTENTIFICACONE SINO PARA PODERUTILIZAR SU CODIGO PRINCIPA*/