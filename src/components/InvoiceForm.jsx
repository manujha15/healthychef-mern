import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Send, FileText, ArrowLeft, RefreshCw, User, Phone, Mail } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import InvoicePreview from './InvoicePreview'; 

const InvoiceForm = ({ onSaveSuccess }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [clientName, setClientName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [items, setItems] = useState([{ productId: '', description: '', variant: '', quantity: 1, price: 0, gst: 0, discount: 0, total: 0 }]);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef();

    useEffect(() => {
        const initialization = async () => {
            setLoading(true);
            try {
                const prodRes = await axios.get('http://127.0.0.1:5000/api/product/list');
                setProductList(prodRes.data);

                if (id) {
                    const invRes = await axios.get(`http://127.0.0.1:5000/api/invoice/${id}`);
                    const data = invRes.data;
                    
                    if (data) {
                        setClientName(data.clientName || '');
                        setMobile(data.mobile || '');
                        setEmail(data.email || '');
                        setAddress(data.address || '');
                        setInvoiceNumber(data.invoiceNumber || '');
                        setItems(data.items && data.items.length > 0 ? data.items : items);
                    }
                }
            } catch (err) {
                console.error("Initialization Error:", err);
            } finally {
                setLoading(false);
            }
        };
        initialization();
    }, [id]);

    const calculateRowTotal = (price, qty, gst, disc) => {
        const basePrice = Number(price) * Number(qty);
        const discountAmt = (basePrice * Number(disc)) / 100;
        const priceAfterDiscount = basePrice - discountAmt;
        const gstAmt = (priceAfterDiscount * Number(gst)) / 100;
        return Number((priceAfterDiscount + gstAmt).toFixed(2));
    };

    const handleProductSelect = (index, prodId) => {
        const selected = productList.find(p => p.id === parseInt(prodId) || p._id === prodId);
        if (selected) {
            const newItems = [...items];
            newItems[index] = {
                ...newItems[index],
                productId: prodId,
                description: selected.name,
                variant: selected.variant || '',
                price: selected.price,
                gst: selected.gst,
                discount: 0,
                total: calculateRowTotal(selected.price, newItems[index].quantity, selected.gst, 0)
            };
            setItems(newItems);
        }
    };

    const handleFieldChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value === '' ? 0 : Number(value);
        const item = newItems[index];
        item.total = calculateRowTotal(item.price, item.quantity, item.gst, item.discount);
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { productId: '', description: '', variant: '', quantity: 1, price: 0, gst: 0, discount: 0, total: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const subTotal = items.reduce((acc, item) => acc + (Number(item.total) || 0), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Basic Validation
        if (items.some(item => !item.productId || item.quantity <= 0)) {
            alert("Please select a product for all rows!");
            return;
        }

        // 2. Direct Logic for Invoice Number (Avoiding Async state lag)
        let finalInvoiceNo = invoiceNumber; 
        if (!finalInvoiceNo || finalInvoiceNo.trim() === '') {
            const year = new Date().getFullYear();
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            finalInvoiceNo = `HC/${year}/${randomSuffix}`;
            setInvoiceNumber(finalInvoiceNo); // UI update ke liye
        }

        // 3. Payload Construction (Ensuring correct data types)
        const invoiceData = {
            invoiceNumber: finalInvoiceNo, 
            clientName: clientName,
            mobile: mobile,
            email: email,
            address: address,
            items: items.map(item => ({
                productId: String(item.productId),
                description: item.description,
                quantity: Number(item.quantity),
                price: Number(item.price),
                gst: Number(item.gst),
                discount: Number(item.discount),
                total: Number(item.total)
            })),
            totalAmount: Number(subTotal.toFixed(2)),
            createdAt: new Date()
        };

        console.log("Sending to Backend:", invoiceData);

        try {
            setLoading(true);
            if (id) {
                await axios.put(`http://127.0.0.1:5000/api/invoice/update/${id}`, invoiceData);
            } else {
                await axios.post('http://127.0.0.1:5000/api/invoice/add', invoiceData);
            }
            alert("HealthyChef Invoice Saved! ✅");
            navigate('/list');
        } catch (err) {
            console.error("Full Error Object:", err.response?.data);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || "Server Connection Failed";
            alert(`Save Fail: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        const element = componentRef.current;
        const options = {
            margin: 10,
            filename: `HealthyChef_${clientName || 'Invoice'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element).save();
    };

    if (loading) return (
        <div className="text-center p-5 mt-5">
            <RefreshCw className="spinner-border text-success" size={40} />
            <p className="mt-3 fw-bold text-muted">Preparing HealthyChef Kitchen...</p>
        </div>
    );

    return (
        <div className="container mt-4 mb-5">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <button type="button" onClick={() => navigate('/list')} className="btn btn-link text-white me-2 p-0">
                            <ArrowLeft size={20} />
                        </button>
                        <h5 className="mb-0 fw-bold">{id ? `Edit Bill: ${invoiceNumber}` : 'New HealthyChef Bill'}</h5>
                    </div>
                </div>

                <div className="card-body p-4 bg-light bg-opacity-50">
                    <form onSubmit={handleSubmit}>
                        {/* Client Info */}
                        <div className="row g-3 mb-4 p-3 bg-white rounded-3 shadow-sm mx-0">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-muted text-uppercase">Client Name</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0"><User size={16} className="text-success"/></span>
                                    <input type="text" className="form-control bg-light border-start-0" value={clientName} onChange={(e) => setClientName(e.target.value)} required placeholder="e.g. Rahul Sharma" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-muted text-uppercase">Mobile</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0"><Phone size={16} className="text-success"/></span>
                                    <input type="text" className="form-control bg-light border-start-0" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit number" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-muted text-uppercase">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-success"/></span>
                                    <input type="email" className="form-control bg-light border-start-0" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" />
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-dark fw-bold mb-0">BILLING ITEMS</h6>
                            <button type="button" onClick={addItem} className="btn btn-sm btn-success rounded-pill px-3 shadow-sm">
                                <Plus size={16} className="me-1" /> Add Item
                            </button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="row g-2 mb-3 align-items-end p-3 bg-white rounded-3 mx-0 border-start border-success border-4 shadow-sm">
                                <div className="col-md-3">
                                    <label className="small fw-bold text-muted">Item Description</label>
                                    <select className="form-select border-0 bg-light" value={item.productId || ""} onChange={(e) => handleProductSelect(index, e.target.value)} required>
                                        <option value="">-- Choose Product --</option>
                                        {productList.map(p => <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-1">
                                    <label className="small fw-bold text-muted">Qty</label>
                                    <input type="number" className="form-control border-0 bg-light" value={item.quantity} onChange={(e) => handleFieldChange(index, 'quantity', e.target.value)} min="1" />
                                </div>
                                <div className="col-md-2">
                                    <label className="small fw-bold text-muted">Price</label>
                                    <input type="text" className="form-control border-0 bg-white fw-bold" value={`₹${item.price}`} readOnly />
                                </div>
                                <div className="col-md-1">
                                    <label className="small fw-bold text-muted text-center d-block">GST%</label>
                                    <input type="text" className="form-control border-0 bg-light text-center" value={`${item.gst}%`} readOnly />
                                </div>
                                <div className="col-md-2">
                                    <label className="small fw-bold text-danger text-center d-block">Disc%</label>
                                    <input type="number" className="form-control border-0 bg-light text-danger fw-bold text-center" value={item.discount} onChange={(e) => handleFieldChange(index, 'discount', e.target.value)} />
                                </div>
                                <div className="col-md-2">
                                    <label className="small fw-bold text-muted text-end d-block">Total</label>
                                    <input type="text" className="form-control border-0 bg-white text-end fw-bold text-success" value={`₹${Number(item.total).toFixed(2)}`} readOnly />
                                </div>
                                <div className="col-md-1 text-end">
                                    <button type="button" onClick={() => removeItem(index)} className="btn btn-outline-danger border-0 btn-sm">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Totals & Actions */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 pt-4 border-top">
                            <div className="mb-3 mb-md-0">
                                <span className="text-muted small fw-bold text-uppercase">Final Amount</span>
                                <h2 className="fw-black text-success mb-0">₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                            </div>
                            <div className="gap-3 d-flex">
                                <button type="button" onClick={downloadPDF} className="btn btn-outline-dark btn-lg px-4 rounded-3 fw-bold">
                                    <FileText size={20} className="me-2"/> Export PDF
                                </button>
                                <button type="submit" disabled={loading} className="btn btn-success btn-lg px-5 shadow rounded-3 fw-bold">
                                    <Send size={20} className="me-2"/> {id ? 'Update Bill' : 'Confirm & Save'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* PDF Preview Container */}
            <div style={{ position: 'absolute', left: '-9999px' }}>
                <div ref={componentRef}>
                    <InvoicePreview 
                        clientName={clientName} 
                        mobile={mobile} 
                        email={email} 
                        address={address}
                        items={items} 
                        subTotal={subTotal} 
                        invoiceNumber={invoiceNumber || "DRAFT"}
                    />
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;