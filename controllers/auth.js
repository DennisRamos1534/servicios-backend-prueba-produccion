const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const Admin = require('../models/admin');
const { generarJWT, generarAdminJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const {numero, password} = req.body;

    try {
        
        const existeNumero = await Usuario.findOne({numero});
        if(existeNumero) {
            return res.status(400).json({
                ok: false,
                msg: 'El número ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const login = async(req, res = response) => {

    const {numero, password} = req.body;

    try {
        
        const usuarioDB = await Usuario.findOne({numero});
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Numero no encontrado'
            })
        }

        // Validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renovarToken = async(req, res = response) => {

    const uid = req.uid;
    // Generar JWT
    const token = await generarJWT(uid);
    // Obtener el usuario por ID
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        usuario,
        token
    });
}

const renovarAdminToken = async(req, res = response) => {

    const uid = req.uid;
    // Generar JWT
    const token = await generarAdminJWT(uid);
    // Obtener el usuario por ID
    const admin = await Admin.findById(uid);


    res.json({
        ok: true,
        admin,
        token
    });
}

const adminnew = async (req, res = response) => {

    const {usuario, password} = req.body;

    try {
        
        const existeUsuario = await Admin.findOne({usuario});
        if(existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya esta registrado'
            });
        }

        const admin = new Admin(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        admin.password = bcrypt.hashSync(password, salt);

        await admin.save();

        // Generar mi JWT
        const token = await generarAdminJWT(admin.id);

        res.json({
            ok: true,
            admin,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const admin = async(req, res = response) => {

    const {usuario, password} = req.body;

    try {
        
        const adminDB = await Admin.findOne({usuario});
        if(!adminDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        // Validar el password
        const validPassword = bcrypt.compareSync(password, adminDB.password);
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            })
        }

        // Generar JWT
        const token = await generarAdminJWT(adminDB.id);

        res.json({
            ok: true,
            admin: adminDB,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    crearUsuario,
    login,
    renovarToken,
    renovarAdminToken,
    adminnew,
    admin
}