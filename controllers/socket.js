const Usuario = require('../models/usuario');

const usuarioConectado = async (uid = '') => {

    const usuario = await Usuario.findById(uid);
    
    return usuario;
}

module.exports = {
    usuarioConectado
}