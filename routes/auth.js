/*
    path: api/login
*/

const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renovarToken, admin, adminnew, renovarAdminToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('numero', 'El numero es obligatorio y tiene que ser 10 digitos').not().isEmpty().isLength({min: 9, max: 11}),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
],crearUsuario);

router.post('/', [
    check('numero', 'El numero es obligatorio y tiene que ser 10 digitos').not().isEmpty().isLength({min: 9, max: 11}),
    check('password', 'El password es obligatorio').not().isEmpty().isLength({min: 4}),
    validarCampos
],login);

router.post('/admin', [
    check('usuario', 'El usuario es obligatorio').not().isEmpty().isLength({min: 4}),
    check('password', 'La contraseña es obligatoria').not().isEmpty().isLength({min: 4}),
    validarCampos
],admin);

router.post('/adminnew', [
    check('usuario', 'El usuario es obligatorio').not().isEmpty().isLength({min: 4}),
    check('password', 'La contraseña es obligatoria').not().isEmpty().isLength({min: 4}),
    validarCampos
],adminnew);

//validarJWT
router.get('/renovar', validarJWT, renovarToken);
router.get('/adminrenovar', validarJWT, renovarAdminToken);



module.exports = router;