const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    mobile: String,
    email: String,
    address: String,
    // models/Invoice.js mein items array ke andar badlav karein:
items: [
    {
        productId: { type: String, required: true }, // ObjectId ki jagah String kar dein
        description: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        gst: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true }
    }
],
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);