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


    const id = req.params.id;
    const uid = req.uid;        //Tenemos el uid pq pasamos por la verificación del JWT

    try {
      
        const medico = await Medico.findById( id );
        if(  !medico ) {
            return res.status(400).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }
  
        const cambiosMedico = {
            hospital: req.body.hospital_id,
            ...req.body,
            usuario: uid        // Guardamos el ultimo usuario que lo modifica
        };

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true });

        // Respuesta del servicio
        return res.json({
            ok: true,
            medico: medicoActualizado
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

    const id = req.params.id;

    try {
      
        const medico = await Medico.findById( id );
        if(  !medico ) {
            return res.status(400).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }
  
        await Medico.findByIdAndDelete( id );

        // Respuesta del servicio
        return res.json({ ok: true, msg: 'Medico eliminado' });

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