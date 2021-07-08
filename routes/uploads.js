/*
    ruta: api/uploads/
    
    fileUpload = ruta/:tipo/:id    => donde tipo sera una coleccion como usuario / medico
*/

const { Router } = require('express');
// Middlewares
const { check } = require('express-validator');
const expressFileUpload = require('express-fileupload');

const { fileUpload, getFile } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');



const router = Router();

// default options
router.use( expressFileUpload() );


// Subir una imagen - seria como actualizar
router.put( '/:tipo/:id', [
    validarJWT,
    check('tipo', 'El tipo o colección al que pertenece el fichero es obligatorio').notEmpty(),
    check('id', 'El Id no existe o no es válido').isMongoId(),
    validarCampos
] , fileUpload );


router.get( '/:tipo/:file', [
    // validarJWT,  //Si la protegemos los links desde la aplicacion de Angular no funcionan
    check('tipo', 'El tipo o colección al que pertenece el fichero es obligatorio').notEmpty(),
    check('file', 'El nombre del fichero es obligatorio').notEmpty(),
    validarCampos
] , getFile );




module.exports = router;