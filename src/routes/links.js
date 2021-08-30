const express=require('express');
const router=express.Router();
const pool=require('../database'); //IMPORTO LA CONNECTION A LA BASE DE DATOS
const {isLoggedIn}=require('../lib/auth'); /*IMPORTO CON CREADO POR MI PARA PROTEGER
                                             LAS VISTAS LO EJECUTO EN LA RUTAS QUE QUIERO PROTEGER*/
router.get('/addUrl',isLoggedIn,(req,res)=>{ //RUTA DEL FORMULARIO
    res.render('img/addURL.hbs');
})                          //AUNQUE TENGAN LA MISMA DIRECCION SE DIFERENCIAN EN EL METODO UNO ES GET Y OTRO POST
//RUTA O PROCESO DONDE GURDAMOS LOS DATOS
router.post('/addUrl',isLoggedIn,async (req,res)=>{ //asinc PARA QUE await FUNCIONE Y TAMBIEN PORQUE ES UNA CONSULTA ASINCRONA
        console.log(req.body);
        const {title,url,description}=req.body;
        const newImg={
            title,
            img:url,
            description,
            user_id:req.user.id
        }
        console.log(req.body); //VER DATOS QUE NOS MANDAN CON EL FORM EN CONSOLA
        await pool.query('INSERT INTO img SET ?',[newImg]);//SE INSERTAR LA IMAGEN JUNTO CON EL ID DEL USUARIO PARA PODER RECUPERARA SOLO LAS IMAGENESE DEESE USUARIO
        /*HACEMOS LA CONSULTA SQL 
        COMO ESTA LINEA TOMA TIEMPO EN EJECITARSE AGREGO AWAIT PARA QUE ESPERE A QUE SE EJECUTE Y AHI SI 
        CONTINUEL CON LA SIGUIENTE LINEA*/
        req.flash('success','Image Saved Successfully'); /*A LO CONFIGURE EN INDEX COMO MIDLEWEARE TONCES PUEDE ACCEDER AEL COMO REQUEST.FLASH*
        el primer parametro es el nombre del mensaje y el segundo el mensaje una vez creado y guardado lo hago
        disponible en todas mis vistas atravez del archico principal en la variables globales para luego comprobar si existe y llamarlo y usarlo
        para qu efuncione debo guardar una sesion para eso el modulo express-session*/
        res.redirect('/links');//ME DIRECCIONA A LA RUTA DE ABAJO
})
router.get('/addFile',isLoggedIn,async (req,res)=>{
    res.render('img/addFILE.hbs');
})

router.get('/',isLoggedIn,async (req,res)=>{ //RUTA DONDE MOSTRAMOS LOS DATOS GUARDADOS, 
    const imgs=await pool.query('SELECT * FROM img WHERE user_id=?',[req.user.id]);//CONSULA PARA SOLO VER LAS IMAGENES DE ESE USUAIRIO
    //LA RUTA ES /links PORQUE LE HEMOS CONFIGURADO UN PREFIJO A TODAS LA RUTAS
    console.log(imgs);
    res.render('img/list',{imgs}); //EL PARAMETRO A LA VISTA PARA PONDER REFERIRME A EL EN LA VISTA Y MOSTRARLOS DATOS
})
router.get('/delete/:id',isLoggedIn,async (req,res)=>{
    const {id}=req.params;
    await pool.query('DELETE FROM img WHERE id=?',[id]);//EL ? ES PARA DECIRLE QUE LE PASARE UNA VARIABLE Y LUEGO SE LA DOY
    //LOS DATOS LO MANDO EN LA RUTA ANTERIOR [] PARA INDICAR PARAMETRO PARA CONSULTA SQL 
    req.flash('success','Image Removed Successfully');
    res.redirect('/links'); //LO REDIRECCIONA A LA RUTA ANTERIOR QUE VUELVE A HACER LA CONSULTA Y ME ACTUALEZA LOS DATAS  
})
router.get('/edit/:id',isLoggedIn,async (req,res)=>{
    const {id}=req.params;
    const img=await pool.query('SELECT * FROM img WHERE id=?',[id]);
    res.render('img/edits',{img:img[0]}); //{} INDICAR PARAMETRO PARA HADLEBARS name:dato opcional puedo pasar el dato y ya si kiero en este caso paso como paraemetro un objeto
    //la consulta me devuelve un array con el objeto con lo datos en la posicion 0 lo indico porque no nesecito td el array
})
router.post('/edit/:id',isLoggedIn,async (req,res)=>{
    const {id} =req.params;
    const {title,description,url}=req.body; //datos que me mandan por el formularion los name igual en la anterior ruta post /add
    const newImg={
        title,
        description,
        img:url                 //el campo en mi base de datos se llama img donde ira el la el dato de la imagen en con el name url en el form
    };
    await pool.query('UPDATE img SET ? WHERE id=?',[newImg,id]);
    req.flash('success','Image Updated Successfully');
    res.redirect('/links');
})
module.exports=router;