const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');



const getTodo = async(req, res = response) => {

    // Aqui no es necesario poner un valor opcionial, ya que si n viene la ruta no es válida.
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );
    
    const limite = Number(req.query.limite) || 5;
    

    //Con las llaves le indicamos un filtro
    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario
            .find( { name: regex })
            .limit ( limite ),
    
        Medico
            .find( { name: regex } )
            .limit ( limite ),
    
        Hospital
            .find( { name: regex } )
            .limit ( limite ),
    ]);
    
    return res.status(200).json({
        ok: true,
        usuarios,
        medicos,
        hospitales,
        busqueda
    }); 

}


const getDocsColeccion = async(req, res = response) => {

    const coleccion = req.params.coleccion;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i' );
    
    const limite = Number(req.query.limite) || 5;
    
    let data = [];

    switch ( coleccion ) {
        case 'usuarios':
            data = await Usuario.find( { name: regex }).limit ( limite );
            break;
            
        case 'medicos':
            data = await Medico.find( { name: regex })
            .populate('usuario', 'name img')
            .limit ( limite );
            break;
            
        case 'hospitales':
            data = await Hospital.find( { name: regex })                    
            .populate('usuario', 'name img')
            .populate('hospital', 'name img')
            .limit ( limite );
        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'No hay ninguna collección con el valor de la tabla'
            }); 
            break;
    }

    
    return res.status(200).json({ ok: true, data }); 

}



module.exports = {
    getTodo,
    getDocsColeccion
}