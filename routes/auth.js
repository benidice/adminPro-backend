/*
    path: /login
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { loginUsuario, renewToken, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


// Login de usuario
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], loginUsuario );


// Validar y revalidar token
router.get( '/renew', validarJWT , renewToken );


// Login de usuario Google
router.post( '/google', [
    check('token', 'El token de Google es obligatorio').notEmpty(),
    validarCampos
], googleSignIn );




module.exports = router;