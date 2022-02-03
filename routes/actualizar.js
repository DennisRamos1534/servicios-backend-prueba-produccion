/**
 *     Path: api/actualizar
 */

 const {Router} = require('express');
 const { check } = require('express-validator');
const { actualizarUsuario } = require('../controllers/actualizar');
 const { validarCampos, existeUsuarioPorNumero} = require('../middlewares/validar-campos');
 
 const router = Router();
 
 
 router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('password', 'La Contraseña es obligatoria').not().isEmpty(),
   //  check('numero').custom(existeUsuarioPorNumero),
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('numero', 'El numero es obligatorio y tiene que ser 10 digitos').not().isEmpty(),
    validarCampos
 ],actualizarUsuario);

 
 module.exports = router;