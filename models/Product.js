const mongoose = require('mongoose');
// models folder ke andar product.js file ko import karo
const Product = require('../models/product');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    variant: { type: String },
    price: { type: Number, required: true },
    gst: { type: Number, default: 5 },
    stock: { type: Number, default: 0 }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);