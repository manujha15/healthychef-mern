const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes Import
const productRoutes = require('./routes/product');
const invoiceRoutes = require("./routes/invoiceRoutes");
const app = express();

// 1. Middlewares: Must come before routes
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true
}));

app.use(express.json()); 

// 2. API Routes
app.use('/api/product', productRoutes);
app.use("/api/invoice", invoiceRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected... ✅"))
    .catch(err => console.log("MongoDB Error: ", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT} 🚀`));