//Import Modules
const express=require('express');
const morgan=require('morgan');     //VER PETICIONES
const exphbs=require('express-handlebars');//MOTOR DE PLANTILLA
const path=require('path');//MANEJAR LAS DIRECCIONES
const flash =require('connect-flash');//PARA ENVIAR MENSAJES ENTRE DIFERENTES VISTAS
const session= require('express-session'); //LA SESION ME ALMACENA LOS DATOS EN LA MEMORIA DEL SERVDOR
const passport=require('passport'); //LEER ARCHIVO passport.js COMPLETO, NOTE:PASSPORT ES UN MIDLEWEARE
//TAMBIEN SE PUEDE EN LA BASE DE DATOS PARA ESO NESECITAMOS EL MODULO express-mysql-sesion 
const MySQLStore=require('express-mysql-session');//PARA ALMACENAR LAS SESSIONES EN LA BASE DE DATOS
const {database}=require('./keys'); //IMPORTO LA CONNEXION CON LA BASE DE DATOS
//Initialization
const app=express();
require('./lib/passport'); //TRAEMOS LA AUTENTIFICAION QUE CREAMOS PARA QUE EL LA APP SE ENTERE ALIGUAL QUE EL MIDDLEWARE PASSPOR QUE CREE
//Settings
app.set('port',process.env.PORT || 3000); //SI EXISTE UN PUERTO TOMALO SI NO TOMA EL 3000
app.set('views',path.join(__dirname,'views')); //DIRECCION DE LAS VISTAS
app.engine('.hbs',exphbs({  //AJUSTES DEL MOTOR DE PLANTILLA
    defaultLayout:'main.hbs', //VISTA PRINCIPAL OSEA TDS LOS ARCHIVOS TENDRAN ESTO SI O SI {{{body}}} ES LO UNICO QUE CAMBIARA PARA LAS DEMAS VISTAS
    layoutsDir:path.join(app.get('views'),'layouts'), //UBICACION DE LA VISTA PRINCIPAL
    partialsDir:path.join(app.get('views'),'partials'),//DIRECCION DE LOS PEDAZOS DE CODIGO(RECURSIVIDAD)
    extname:'.hbs',//EXTENSION DE LOS ARCHIVOS PUEDE SER .hbs o .handlebars
    helpers:require('./lib/handlebars') //Funciones de handlebars creada por mi
}));
app.set('view engine','.hbs');//MOTOR DE PLANTILLA QUE USARE


//MiddleWeares
app.use(session({
    secret:'dannyNODEjsSession123', //un texto cualquiera
    resave:false,   //para que no se renove la sesion
    saveUninitialized:false,//para que no se vuelva a establecer la sesion
    store:new MySQLStore(database)     //DONDE SE GUARDARA LA SESION EN MI CASO LO HARE EN LA BASE DE DATOS
    //ASI QUE LE PASO COMO PARAMETRO LA CONEXION CON LA BASE DA DATOS
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true})); //TIPOS DE ARCHIVOS QUE SERA VALIDOS FALSE FILES SIMPLES COMO STRINGS TRUE IMAGENES, VIDEOS, ETC.
app.use(express.json());//RECIBIR ARCHIVO JSON
app.use(passport.initialize());//INICIAMOS PASSPORT
app.use(passport.session()); //PERO EL NO SABE COMO VA A GUARDAR LO DATOS PARA ESO USAMOS UNA SESION

//Global Varibales
app.use((req,res,next)=>{
    app.locals.success=req.flash('success');//almaceno la variables locales, la col.17 es el nombre con el que lo llamare el mensaje
    // para que flash funcione debemos gurdarlo con una sesion para eso el modulo express-session
    app.locals.message=req.flash('message');
    app.locals.user=req.user //ALMACENAMOS LA INFORMACION DEL USUSARIO CON LA DESERIALIZACION PARA MOSTRARLA LA INFO EN CUALQUIER VISTA
    next();
})
//Routes
app.use(require('./routes'));//RUTAS PRINCIPALES
app.use(require('./routes/authentification'));//AUTENTIFICAR LOS USUARIOS
app.use('/links',require('./routes/links'));//Ruta para almacenar los link o img Con el prefijo Link y el id que sige /link/id
//TODAS LA RUTAS DE ESE ARCHIVO REQUIEREN /links en la url
//Public
app.use(express.static(path.join(__dirname,'public')))

//Starting The Server
app.listen(app.get('port'),()=>{
    console.log('Listen on port',app.get('port'));
})