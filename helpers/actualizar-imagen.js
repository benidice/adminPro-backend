const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


const atcualizarImagen = async ( tipo, id, path, nombreArchivo ) => {

    let modelo = {};

    switch ( tipo ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            break;
        case 'medicos':
            modelo = await Medico.findById(id);
            break;            
        case 'hospitales':
            modelo = await Hospital.findById(id);
        break;
        default:
            return false;
            break;
    }
    return ( actualizarImagen( modelo, path, nombreArchivo)) ? true : false;
}


const actualizarImagen = async ( modelo, path, nombreArchivo ) => {
    if( !modelo ){
        console.log('No se econtro ningún item por id');
        return false;
    }
    //Verificamos si ya dispone de una imagen - de ser asi hay que borrarla
    const pathViejo = `${path}/${modelo.img}`;
    borrarImagen( pathViejo );

    modelo.img = nombreArchivo;     //Añadimos el nombre al modelo
    await modelo.save();            //Actualizamos la findById
    return true;
}

//Borramos la imagen
const borrarImagen = ( path ) => {
    if( fs.existsSync(path)){
        fs.unlinkSync( path ); 
    }
}


module.exports = {
    atcualizarImagen
}