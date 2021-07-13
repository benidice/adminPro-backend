const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');



const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const dbUser = await Usuario.findOne({ email });
        if(  !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es válido'
            });
        }

        // Generar el JWT
        const token = await generarJWT( dbUser.id );

        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token,
            menu: getMenuFrontEnd( dbUser.role )
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}



//                      //
//   Revalidar Token    //
//                      //
const renewToken = async(req, res = response ) => {

    const { uid } = req;
    try {
        const token = await generarJWT( uid );
        const user  = await Usuario.findById( uid );
        // console.log(user);
        return res.json({
            ok: true,
            token,
            user,
            menu: getMenuFrontEnd( user.role )
        });
    } catch (error) {
        
    }
    // Generar el JWT

}


//                      //
//   Login con Google   //
//                      //
const googleSignIn = async( req, res = response) => {

    const googleToken = req.body.token;
    

    try {
        const { name, email, picture } = await googleVerify( googleToken );
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if( !usuarioDB ){
            // Si no existe el usuario.
            usuario = new Usuario({
                name, email,
                //Al grabar sin hash nunca podremos entrar ya que al entrar se le hara el hash y no hará match
                password: '@@@',        
                img: picture,
                google: true
            });
    
            // Guardar en DB
            await usuario.save();
        }else if( !usuarioDB.google ){
            //existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            // password: '@@@' -> Si no le cambiamos la contraseña el usuario tendrá los dos métodos de autenticacion
            await usuario.save();            
        }else{
            //el usuario ya existe en la BD
            usuario = usuarioDB;
        }
       
        //Fernando tenia aqui la grabación, pero entonces graba sienmpre en la BD aunque ya este autenticado.
        // Generar el JWT de nuestra aplicación
        const token = await generarJWT( usuario.id )

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuarioDB.role )
        });      


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'El token no es válido'
        });
    }
}



module.exports = {
    loginUsuario,
    renewToken,
    googleSignIn
}