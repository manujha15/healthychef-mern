import React from 'react';

const InvoicePreview = ({ clientName, mobile, email, address, items = [], subTotal = 0, invoiceNumber }) => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    
    // Exact Calculations
    const totalBasePrice = items.reduce((acc, i) => acc + (Number(i.price) * Number(i.quantity)), 0);
    const totalDiscountAmt = items.reduce((acc, i) => acc + (Number(i.price) * Number(i.quantity) * (Number(i.discount) || 0) / 100), 0);
    const totalGstAmt = items.reduce((acc, i) => {
        const afterDiscount = (Number(i.price) * Number(i.quantity)) - (Number(i.price) * Number(i.quantity) * (Number(i.discount) || 0) / 100);
        return acc + (afterDiscount * (Number(i.gst) || 0) / 100);
    }, 0);

    return (
        <div id="invoice-download-area" style={{ 
            padding: '40px', 
            fontFamily: "'Segoe UI', Roboto, Arial, sans-serif", 
            color: '#1e293b', 
            backgroundColor: '#ffffff', 
            width: '720px', 
            margin: '0 auto',
            boxSizing: 'border-box',
            border: '1px solid #e2e8f0'
        }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', backgroundColor: '#10b981', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff', fontSize: '22px', fontWeight: 'bold' }}>H</div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>HealthyChef</h1>
                            <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Organic Kitchen & Catering</p>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '1px' }}>TAX INVOICE</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>#{invoiceNumber || 'HC-2026-001'}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{today}</p>
                </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                <div>
                    <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '6px' }}>Customer Details</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{clientName || "Valued Customer"}</p>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
                        {address || "Ahmedabad, Gujarat"}<br />
                        <span style={{ color: '#94a3b8' }}>M:</span> {mobile || "N/A"}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', marginBottom: '6px' }}>Service Provider</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                        <strong>HealthyChef Kitchen</strong><br />
                        Corporate Greens, Ahmedabad<br />
                        <strong>GSTIN:</strong> 24AAACH1234F1Z5
                    </p>
                </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #0f172a' }}>
                        <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Description</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', width: '50px' }}>Qty</th>
                        <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', width: '80px' }}>Rate</th>
                        <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', width: '100px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '15px 8px' }}>
                                <div style={{ fontWeight: '700', fontSize: '13px', color: '#334155' }}>{item.description}</div>
                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>GST {item.gst}% | Disc {item.discount}%</div>
                            </td>
                            <td style={{ padding: '15px 8px', textAlign: 'center', fontSize: '13px' }}>{item.quantity}</td>
                            <td style={{ padding: '15px 8px', textAlign: 'right', fontSize: '13px' }}>₹{item.price}</td>
                            <td style={{ padding: '15px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '700' }}>₹{Number(item.total).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Calculations & Terms */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                {/* Terms & Conditions Section */}
                <div style={{ width: '55%' }}>
                    <p style={{ fontSize: '10px', color: '#0f172a', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Terms & Conditions</p>
                    <ul style={{ padding: '0 0 0 12px', margin: 0, fontSize: '10px', color: '#64748b', lineHeight: '1.6' }}>
                        <li>Payments should be made in favor of "HealthyChef Kitchen".</li>
                        <li>100% payment is required at the time of order placement.</li>
                        <li>Goods once sold or delivered cannot be returned or exchanged.</li>
                        <li>Any disputes shall be subject to Ahmedabad Jurisdiction only.</li>
                        <li>Please check the items & quantity before accepting the delivery.</li>
                    </ul>
                </div>

                {/* Totals */}
                <div style={{ width: '230px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                        <span style={{ color: '#64748b' }}>Subtotal</span>
                        <span style={{ fontWeight: '600' }}>₹{totalBasePrice.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#f59e0b' }}>
                        <span>Discount</span>
                        <span>- ₹{totalDiscountAmt.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px' }}>
                        <span style={{ color: '#64748b' }}>Tax (GST)</span>
                        <span style={{ fontWeight: '600' }}>+ ₹{totalGstAmt.toFixed(2)}</span>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700' }}>GRAND TOTAL</span>
                        <span style={{ fontSize: '18px', fontWeight: '800' }}>₹{Number(subTotal).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            {/* Footer Signature */}
            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '10px', color: '#cbd5e1', fontStyle: 'italic' }}>
                    Thank you for choosing HealthyChef!
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '150px', borderTop: '1px solid #0f172a', marginBottom: '6px' }}></div>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>Authorized Signatory</p>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;