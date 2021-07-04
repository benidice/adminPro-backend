const { response } = require('express');
const { populate } = require('../models/hospital');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');



const getHospitales = async(req, res = response) => {

    
    try {
        //Con las llaves le indicamos un filtro
        const hospitales = await Hospital.find()
                .populate('usuario', 'name img');
        return res.json({ ok: true, hospitales });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    // Desestructuramos para recoger el id del usuario, ya que lo hemos hecho obligatorio en el módelo
    // El modelo ya filtrará los datos que no necesita
    const hospital = new Hospital ({
        usuario: uid,
        ...req.body
    });

    try {
        
        const existeH = await Hospital.findOne( { name: hospital.name} );
        if(  existeH ) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital ya existe'
            });
        }

        const hospitalDB = await hospital.save();
   
        // Respuesta del servicio
        return res.json({
            ok: true,
            hospital: hospitalDB
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const actualizarHospital = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;        //Tenemos el uid pq pasamos por la verificación del JWT

    try {
      
        const hospital = await Hospital.findById( id );
        if(  !hospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }
  
        const cambiosHospital = {
            ...req.body,
            usuario: uid        // Guardamos el ultimo usuario que lo modifica
        };

        const hopitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true });

        // Respuesta del servicio
        return res.json({
            ok: true,
            hospital: hopitalActualizado
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const eliminarHospital = async(req, res = response) => {

    const id = req.params.id;

    try {
      
        const hospital = await Hospital.findById( id );
        if(  !hospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }
  
        await Hospital.findByIdAndDelete( id );

        // Respuesta del servicio
        return res.json({ ok: true, msg: 'Hospital eliminado' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}






module.exports = {
    crearHospital,
    actualizarHospital,
    eliminarHospital,
    getHospitales
}