const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { query } = require('express-validator');



const getUsuarios = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    //Con las llaves le indicamos un filtro
    const [ usuarios, total ] = await Promise.all( [
        Usuario
         .find({}, 'nombre email role google img')
         .skip( desde )
         .limit ( limite ),

        Usuario.countDocuments()
    ]);
    
    return res.status(200).json({
        ok: true,
        usuarios,
        total
    }); 

}


const crearUsuario = async(req, res = response) => {

    const { email, name, password } = req.body;

    try {
        // Verificar el email
        const usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con el email introducido'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        // Hashear la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        // Generar el JWT
        const token = await generarJWT( dbUser.id, name );

        // Crear usuario de DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }

}



const actualizarUsuario = async(req, res = response) => {

    //TODO: Validar token 
    const id = req.params.id;

    try {

        const dbUser = await Usuario.findById(id);
        if ( !dbUser ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id enviado'
            });
        }

        // Actualizaciones - Eliminamos aquello que no queremos que se actualze
        const { password, google, email, ...campos} = req.body;

        if ( dbUser.email !== email ){   //Si no actualiza el email, lo borramos
            const emailExists = await Usuario.findOne({ email });
            if( emailExists ){
                return res.status(400).json({
                    ok: false,
                    msg: 'el correo ya esta registrado por otro usuario'
                })
            }
        }

        campos.email = email;   //Si no choca con otro email lo añadimos a los campos a actualizar

        //Con new en true regresa el usuario actulizado, en caso contrario, los datos anteriores
        const usuarioActualizado = await Usuario.findByIdAndUpdate( id, campos, { new: true} );

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            usuario: usuarioActualizado,
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }

}




const eliminarUsuario = async(req, res = response) => {

    const id = req.params.id;

    try {
        const dbUser = await Usuario.findById(id);
        if ( !dbUser ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el id enviado'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndDelete( id );
        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            msg: `Usuario ${dbUser.name} ha sido eliminado.`
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}




const revalidarToken = async(req, res = response ) => {

    const { uid } = req;

    // Leer BD
    const dbUser = await Usuario.findById(uid);

    // Generar el JWT
    const token = await generarJWT( uid );

    return res.json({
        ok: true,
        uid, 
        name: dbUser.name,
        email: dbUser.email,
        token
    });

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    revalidarToken
}