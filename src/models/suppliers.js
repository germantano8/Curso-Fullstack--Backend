const mongoose = require('mongoose');

const suppliersSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Suppliers', suppliersSchema);