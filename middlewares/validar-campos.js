const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario');

const validarCampos = (req, res, next) => {
 
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    next();
}


const existeUsuarioPorNumero = async (numero) => {

    // verificiar
    const existeUsuario = await Usuario.findOne({numero});
    if(existeUsuario) {
        throw new Error(`El numero ${numero} ya existe en otra cuenta`);
    }
}


module.exports = {
    validarCampos,
    existeUsuarioPorNumero
}