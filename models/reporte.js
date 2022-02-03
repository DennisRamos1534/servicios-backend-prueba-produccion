const {Schema, model} = require('mongoose');

const ReporteSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true,
    },
    urlImagen: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    tipoServicio: {
        type: String,
        required: true,
    },
    eliminado: {
        type: Boolean,
        required: true,
    },
    estado: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true
});

ReporteSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});


module.exports = model('Reporte', ReporteSchema);