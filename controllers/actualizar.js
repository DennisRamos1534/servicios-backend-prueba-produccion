const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const actualizarUsuario = async (req, res = response) => {

    const {id} = req.params;
    const {password, ...resto} = req.body;

    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'Actualizar Registro',
        usuario
    });
}

module.exports = {
    actualizarUsuario
}