const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    image:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    idSupplier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Suppliers",
        required: true
    }
});

module.exports = mongoose.model('Products', productSchema);