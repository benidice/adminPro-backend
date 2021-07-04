/*
    ruta: api/busquedas/
    
    Busqueda total = ruta/todo/:busqueda
    Buesqueda por coleccion: ruta/:coleccion/:busqueda
*/

const { Router } = require('express');

const { getTodo, getDocsColeccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


// Validar y revalidar token
router.get( '/todo/:busqueda', validarJWT , getTodo );

router.get( '/:coleccion/:busqueda', validarJWT , getDocsColeccion );




module.exports = router;