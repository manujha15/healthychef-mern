import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertCircle, Plus, Minus, Search, RefreshCcw } from 'lucide-react';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
    try {
        setLoading(true);
        // Ise 'localhost' kar do
        const res = await axios.get('http://localhost:5000/api/product/list'); 
        setProducts(res.data);
        setLoading(false);
    } catch (err) {
        console.error("Fetch error", err);
        setLoading(false);
    }
};

    useEffect(() => { fetchProducts(); }, []);

   const handleStockChange = async (id, currentStock, change) => {
    const newStock = Number(currentStock) + change;
    if (newStock < 0) return;

    try {
        // Dhyan rakhein URL singular hai '/api/product/update/'
        await axios.put(`http://localhost:5000/api/product/update/${id}`, { 
            stock: newStock 
        });

        // UI update
        setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
    } catch (err) {
        console.error("Update failed:", err.response);
        alert("Server Error 404: Route not found. Ek baar backend restart karke dekho.");
    }
};

    // --- YEH LINE MISSING THI ---
    const filteredProducts = products.filter(p => 
        p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="p-5 text-center">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-2 fw-bold text-success">Syncing Kitchen Inventory...</p>
        </div>
    );

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-black text-dark mb-0">Kitchen <span className="text-success">Inventory</span></h2>
                    <p className="text-muted small">Real-time stock management</p>
                </div>
                <button className="btn btn-outline-dark rounded-pill px-4" onClick={fetchProducts}>
                    <RefreshCcw size={16} className="me-2" /> Refresh
                </button>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-8">
                    <div className="input-group shadow-sm rounded-4 overflow-hidden border-0">
                        <span className="input-group-text bg-white border-0"><Search size={18} className="text-muted"/></span>
                        <input 
                            type="text" className="form-control border-0 p-3" 
                            placeholder="Search by dish name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bg-white p-3 rounded-4 shadow-sm border-start border-5 border-success d-flex align-items-center">
                        <Package className="text-success me-3" />
                        <div>
                            <h5 className="mb-0 fw-bold">{products.length}</h5>
                            <small className="text-muted fw-bold">Active SKUs</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr className="small text-muted text-uppercase fw-bold">
                                <th className="px-4 py-3">Item Info</th>
                                <th>Price</th>
                                <th className="text-center">Stock Management</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p._id}>
                                    <td className="px-4 py-3">
                                        <div className="fw-bold text-dark">{p.name}</div>
                                        <div className="small text-muted">{p.variant}</div>
                                    </td>
                                    <td className="fw-bold">₹{p.price}</td>
                                    <td className="text-center">
                                        <div className="d-inline-flex align-items-center bg-light rounded-pill p-1 border">
                                            <button 
                                                className="btn btn-sm btn-white rounded-circle shadow-sm border"
                                                onClick={() => handleStockChange(p._id, p.stock, -1)}
                                            >
                                                <Minus size={14} className="text-danger" />
                                            </button>
                                            
                                            {/* YEH WALI LINE CHECK KARO - Number dikhna chahiye */}
                                            <span className="mx-3 fw-bold fs-5" style={{ minWidth: '30px' }}>
                                                {p.stock !== undefined ? p.stock : 0} 
                                            </span>
                                            
                                            <button 
                                                className="btn btn-sm btn-white rounded-circle shadow-sm border"
                                                onClick={() => handleStockChange(p._id, p.stock, 1)}
                                            >
                                                <Plus size={14} className="text-success" />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        {p.stock < 10 ? (
                                            <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill small">
                                                <AlertCircle size={12} className="me-1"/> Low Stock
                                            </span>
                                        ) : (
                                            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill small">
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;