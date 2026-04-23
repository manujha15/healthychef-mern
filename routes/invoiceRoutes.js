const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Product = require("../models/product");

// ==========================================
// 1. DASHBOARD SUMMARY STATS 
// (Hamesha /:id se upar rakhein)
// ==========================================
router.get("/stats/summary", async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        const totalInvoices = invoices.length;
        const totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
        const recentInvoices = invoices.slice(0, 5);

        res.json({
            totalInvoices,
            totalRevenue,
            recentInvoices
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 2. SALES REPORTS (Fixes 404 Error)
// (Hamesha /:id se upar rakhein)
// ==========================================
// routes/invoiceRoutes.js

router.get("/reports/sales", async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        
        const totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
        
        // Chart ke liye data ko format kar rahe hain
        const chartData = invoices.slice(-7).map(inv => ({
            name: inv.clientName ? inv.clientName.split(' ')[0] : 'Guest', // Sirf pehla naam
            amount: Number(inv.totalAmount) || 0 // Amount field
        }));

        res.json({
            success: true,
            revenue: Math.round(totalRevenue),
            count: invoices.length,
            invoices: invoices,
            chartData: chartData // Yeh Chart ke liye zaroori hai
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ==========================================
// 3. GET ALL INVOICES
// ==========================================
router.get("/all", async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 4. CREATE INVOICE & UPDATE STOCK
// ==========================================
// ==========================================
// 4. CREATE INVOICE & UPDATE STOCK
// ==========================================
router.post("/add", async (req, res) => {
    try {
        // 1. Yahan 'invoiceNumber' add kijiye destructuring mein
        const { invoiceNumber, clientName, mobile, email, address, items, totalAmount } = req.body;

        // Debugging ke liye (Optional)
        console.log("Saving Invoice No:", invoiceNumber);

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "At least one item is required" });
        }

        // 2. Validation check (Agar invoiceNumber missing hai toh yahi rok do)
        if (!invoiceNumber) {
            return res.status(400).json({ error: "invoiceNumber is required from frontend!" });
        }

        let calculatedTotal = 0;
        const processedItems = items.map(item => {
            const basePrice = Number(item.price) * Number(item.quantity);
            const discountAmt = basePrice * (Number(item.discount || 0) / 100);
            const priceAfterDiscount = basePrice - discountAmt;
            const gstAmt = priceAfterDiscount * (Number(item.gst || 0) / 100);
            const finalItemTotal = priceAfterDiscount + gstAmt;
            
            calculatedTotal += finalItemTotal;
            
            return { 
                ...item, 
                total: finalItemTotal.toFixed(2) 
            }; 
        });

        // 3. New Invoice mein 'invoiceNumber' pass kijiye
        const newInvoice = new Invoice({
            invoiceNumber, // <-- Yeh missing tha aapke purane code mein
            clientName,
            mobile,
            email,
            address,
            items: processedItems,
            totalAmount: totalAmount || Math.round(calculatedTotal) // Frontend wala total ya calculated
        });

        const savedInvoice = await newInvoice.save();

        // Update Stock Logic
        for (const item of items) {
            if (item.productId) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -Math.abs(Number(item.quantity)) } }
                );
            }
        }

        res.status(201).json({ success: true, invoice: savedInvoice });
    } catch (err) {
        console.error("Mongoose Save Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// ==========================================
// 5. GET SINGLE INVOICE (By ID)
// (Ise hamesha niche rakhein taaki reports/stats intercept na ho)
// ==========================================
router.get("/:id", async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 6. DELETE INVOICE
// ==========================================
router.delete("/delete/:id", async (req, res) => {
    try {
        await Invoice.findByIdAndDelete(req.params.id);
        res.json({ message: "Invoice deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;