const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const { atcualizarImagen } = require('../helpers/actualizar-imagen');



const fileUpload = async(req, res = response) => {

    // Aqui no es necesario poner un valor opcionial, ya que si n viene la ruta no es válida.
    const {tipo, id} = req.params;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if( !tiposValidos.includes(tipo) ){
        return res.status(400).json({
            ok: false,
            msg: 'El tipo no coincide con ninguna colección permitida'
        });
    }
    
    //Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'no hay ningún archivo'
        });
      }
    
    // Procesar la imagen
    const file = req.files.imagen;  //imagen es el nombre del campo que enviamos
    const nombreCortado = file.name.split('.');  // nombreLoQueSea.1.2.jpg
    const extensionArchivo = nombreCortado[nombreCortado.length - 1 ];

    // Validar Extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
    if( !extensionesValidas.includes(extensionArchivo) ){
        return res.status(400).json({
            ok: false,
            msg: 'La extensión del fichero no coincide con una extensión permitida'
        });
    }

    // Generar el nombre del archivo - debe de ser único para no machacar otros ficheros
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //Path para guardar la imagen
    const pathFile = `./uploads/${tipo}`;
    //Mover la imagen .mv()
    file.mv( `${pathFile}/${nombreArchivo}`, (err) => {
        if (err){
            return res.status(500).json({
                ok: false, mgs: 'Error al mover la imagen'
            });
        }

        //Acutlizar BD
        atcualizarImagen( tipo, id, pathFile, nombreArchivo );

        res.json({ ok: true,  nombreArchivo }); 
    });


}




const getFile = ( req, res = response ) => {

    const {tipo, file } = req.params;

    let pathFile = path.join( __dirname, `../uploads/${tipo}/${file}`);
    
    if( !fs.existsSync( pathFile) ){
        pathFile = path.join( __dirname, `../uploads/no-img.jpg`);
    }

    res.sendFile( pathFile );
}

module.exports = {
    fileUpload,
    getFile
}