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


// Validar y revalidar token
router.put( '/:tipo/:id', [
    validarJWT,
    check('tipo', 'El tipo o colección al que pertenece el fichero es obligatorio').notEmpty(),
    check('id', 'El Id no existe o no es válido').isMongoId(),
    validarCampos
] , fileUpload );


router.get( '/:tipo/:file', [
    validarJWT,
    check('tipo', 'El tipo o colección al que pertenece el fichero es obligatorio').notEmpty(),
    check('file', 'El nombre del fichero es obligatorio').notEmpty(),
    validarCampos
] , getFile );




module.exports = router;