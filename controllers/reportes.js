const { response } = require('express');
const Reporte = require('../models/reporte');

const crearReporte = async (req, res = response) => {

    
}

const allReportes = async (req, res = response) => {

    try {
        const reportes = await Reporte.find();
        reportes.reverse();

        res.json({
            ok: true,
            reportes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const filtrarReporte = async (req, res = response) => {
    
    const {numero} = req.body;

    try {
        const reporte = await Reporte.find({numero, eliminado: false});
        reporte.reverse();

        res.json({
            ok: true,
            reporte
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const deleteReporte = async (req, res = response) => {
    
    const {id} = req.params;
    const reporte = await Reporte.findByIdAndUpdate(id, {eliminado: true});
    res.json({reporte});
    
}

const actualizarEstado = async (req, res = response) => {
    
    const {id} = req.params;
    const reporte = await Reporte.findByIdAndUpdate(id, {estado: true});
    res.json({
        ok: true,
        reporte
    });
    
}

module.exports = {
    crearReporte,
    allReportes,
    filtrarReporte,
    deleteReporte,
    actualizarEstado
}