const jwt = require('jsonwebtoken');


const generarJWT = ( uid ) => {

    const payload = { uid, };
    
    return new Promise( (resolve, reject) => {

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '12h'
        }, (err, token) => {
    
            if ( err ) {
                // todo MAL
                console.log(err);
                reject(err);
    
            } else {
                // todo BIEN
                resolve( token )
            }
    
        })

    });

}


module.exports = {
    generarJWT
}