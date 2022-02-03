const {Schema, model} = require('mongoose');

const AdminSchema = Schema({

    usuario: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },

});

AdminSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});


module.exports = model('Admin', AdminSchema);