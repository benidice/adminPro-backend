const { Router } = require('express');
const { check } = require('express-validator');

const { getHospitales,
        crearHospital,
        actualizarHospital,
        eliminarHospital } = require('../controllers/hospitales');
        
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


// Crear un nuevo usuario
router.get( '/', validarJWT, getHospitales );


// Crear un nuevo usuario
router.post( '/', [
    validarJWT,
    check('name', 'El nombre del hospital es obligatorio').notEmpty(),
    validarCampos
], crearHospital );


// Crear un nuevo usuario
router.put( '/:id', [
    validarJWT,
    validarCampos
],  actualizarHospital);


// Crear un nuevo usuario
router.delete( '/:id', validarJWT, eliminarHospital);



module.exports = router;