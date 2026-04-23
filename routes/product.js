const express = require('express');
const router = express.Router();

// PATH CHECK: Agar aapki file ka naam models/product.js (small p) hai 
// toh niche 'Product' ko 'product' kar dena.
const Product = require('../models/Product'); 

// GET: List all products
router.get('/list', async (req, res) => {
    try {
        let products = await Product.find();
        if (products.length === 0) {
            const initialFoodItems = [
                { name: "Paneer Butter Masala", variant: "Full", price: 320, gst: 5, stock: 50 },
                { name: "Dal Tadka", variant: "Half", price: 180, gst: 5, stock: 60 },
                { name: "Butter Kulcha", variant: "Per Pc", price: 45, gst: 5, stock: 200 }
            ];
            products = await Product.insertMany(initialFoodItems);
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products", error: err.message });
    }
});

// PUT: Update Stock
router.put('/update/:id', async (req, res) => {
    try {
        const { stock } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: { stock: Number(stock) } },
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;