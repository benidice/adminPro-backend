const { response } = require('express');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');



const getMedicos = async(req, res = response) => {

    try {
        //Con las llaves le indicamos un filtro
        const medicos = await Medico.find()
            .populate('usuario', 'name img')
            .populate( 'hospital', 'name img');
        return res.json({ ok: true, medicos });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    // Desestructuramos para recoger el id del usuario, ya que lo hemos hecho obligatorio en el módelo
    // El modelo ya filtrará los datos que no necesita
    const medico = new Medico ({
        usuario: uid,
        hospital: req.body.hospital_id,
        ...req.body
    });

    try {
        
        const existeH = await Medico.findOne( { name: medico.name} );
        if(  existeH ) {
            return res.status(400).json({
                ok: false,
                msg: 'El medico ya existe'
            });
        }

        const medicoDB = await medico.save();
   
        // Respuesta del servicio
        return res.json({
            ok: true,
            medico: medicoDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const actualizarMedico = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const dbUser = await Usuario.findOne({ email });
        if(  !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

   
        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const eliminarMedico = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const dbUser = await Usuario.findOne({ email });
        if(  !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

   
        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const __Medico = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const dbUser = await Usuario.findOne({ email });
        if(  !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

   
        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const _Medico = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const dbUser = await Usuario.findOne({ email });
        if(  !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

   
        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}





module.exports = {
    crearMedico,
    actualizarMedico,
    eliminarMedico,
    getMedicos
}