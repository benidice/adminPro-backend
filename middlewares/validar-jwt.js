const { response } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');

const validarJWT = ( req, res = response, next ) => {

    const token = req.header('x-token');

    if( !token  ) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        // Podemos añadir parametros en la request
        req.uid  = uid;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();
}



const validarAdminRole = async ( req, res = response, next) => {
    //Pondremos este middleware despúes del validarJWT por lo que ya tendremos el uid
    const uid = req.uid;    

    try {
        const usuarioDB = await Usuario.findById(uid);
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if( usuarioDB.role !== 'ADMIN_ROLE '){
            return res.status(403).json({
                ok: false,
                msg: 'No tiene permisos para realizar la acción'
            });
        }

        //Todo ok
        next();

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }
}




/**
 * Este middleware permite que un usuario pueda modificar su perfil, pero tambien permite 
 * que se pueda modificar el ROLE. TODO: Falta implementar la lógica para evitar la modificacion de roles
 */
const validarAdminRole_o_MismoUsuario = async ( req, res = response, next) => {
    //Pondremos este middleware despúes del validarJWT por lo que ya tendremos el uid
    const uid = req.uid;
    const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if( usuarioDB.role === 'ADMIN_ROLE ' || uid === id ){            
            next(); //Todo ok
        } else{
            return res.status(403).json({
                ok: false,
                msg: 'No tiene permisos para realizar la acción'
            });
        }


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }
}


module.exports = {
    validarJWT,
    validarAdminRole,
    validarAdminRole_o_MismoUsuario
}

