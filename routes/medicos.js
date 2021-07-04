const { Router } = require('express');
const { check } = require('express-validator');

const { getMedicos,
        crearMedico,
        actualizarMedico,
        eliminarMedico } = require('../controllers/medicos');
        
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


// Crear un nuevo usuario
router.get( '/', validarJWT, getMedicos );


// Crear un nuevo usuario
router.post( '/', [
    validarJWT,
    check('name', 'El nombre del medico es obligatorio').notEmpty(),
    check('hospital_id', 'El identificador del hospital debe de ser válido').isMongoId(),
    validarCampos
], crearMedico );


// Crear un nuevo usuario
router.put( '/:id', [
    validarJWT,
    validarCampos
],  actualizarMedico);


// Crear un nuevo usuario
router.delete( '/:id', validarJWT, eliminarMedico);



module.exports = router;