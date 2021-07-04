/**
 * Ruta: /api/usuarios
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, revalidarToken, eliminarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


// Crear un nuevo usuario
router.get( '/', validarJWT, getUsuarios );


// Crear un nuevo usuario
router.post( '/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], crearUsuario );


// Crear un nuevo usuario
router.put( '/:id', [
    validarJWT,
    check('name',   'El nombre es obligatorio').not().isEmpty(),
    check('email',  'El email es obligatorio').isEmail(),
    check('role',   'El rol es obligatorio').notEmpty(),
    validarCampos
],  actualizarUsuario);


// Crear un nuevo usuario
router.delete( '/:id', validarJWT, eliminarUsuario);



// Validar y revalidar token
router.get( '/renew', validarJWT , revalidarToken );







module.exports = router;