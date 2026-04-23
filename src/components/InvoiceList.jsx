import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Trash2, Search, RefreshCw, Eye, Download, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import InvoicePreviewModal from './InvoicePreviewModal';
import InvoicePreview from './InvoicePreview'; 

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [downloadingInv, setDownloadingInv] = useState(null); 
  
  const navigate = useNavigate();
  const pdfComponentRef = useRef();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
  setLoading(true);
  try {
    // Is URL ko change karo
    const res = await axios.get('http://127.0.0.1:5000/api/invoice/reports/sales');
    
    // Kyunki backend ab object bhej raha hai { count, revenue, invoices }
    // Toh humein res.data.invoices lena hoga
    setInvoices(res.data.invoices || []); 
  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        // Backend logic ke hisaab se route sync kiya
        await axios.delete(`http://127.0.0.1:5000/api/invoice/${id}`);
        setInvoices(invoices.filter(inv => inv._id !== id));
        alert("Invoice deleted successfully! ✅");
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Delete failed. Check backend console.");
      }
    }
  };

  const handleEdit = (invoice) => {
    navigate(`/edit/${invoice._id}`);
  };

  const handleDownload = (invoice) => {
    setDownloadingInv(invoice);
    
    setTimeout(() => {
      const element = pdfComponentRef.current;
      const options = {
        margin: 10,
        filename: `HealthyChef_${invoice.clientName}_${invoice.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(options).from(element).save().then(() => {
        setDownloadingInv(null); 
      });
    }, 500);
  };

  const filteredInvoices = invoices.filter(inv =>
    (inv.clientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (inv.invoiceNumber?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-4 mt-4 mb-5">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Invoice History</h2>
          <p className="text-muted small mb-0">Manage and track HealthyChef billing records.</p>
        </div>
        <div className="input-group shadow-sm" style={{ maxWidth: '400px' }}>
          <span className="input-group-text bg-white border-end-0 text-muted">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            className="form-control border-start-0 ps-0 py-2" 
            placeholder="Search by Client or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        {loading ? (
          <div className="p-5 text-center">
            <RefreshCw className="spinner-border text-success mb-3" size={32} />
            <p className="text-muted fw-bold">Fetching HealthyChef Records...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr className="text-muted small">
                  <th className="px-4 py-3 border-0 fw-bold">INVOICE ID</th>
                  <th className="py-3 border-0 fw-bold">CLIENT NAME</th>
                  <th className="py-3 border-0 fw-bold">DATE</th>
                  <th className="py-3 border-0 fw-bold text-end">AMOUNT</th>
                  <th className="px-4 py-3 border-0 fw-bold text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="border-bottom border-light">
                    <td className="px-4 py-3">
                      <span className="badge bg-success bg-opacity-10 text-success border px-2 py-2 fw-bold">
                        {inv.invoiceNumber}
                      </span>
                    </td>
                    <td className="py-3">
                        <div className="fw-bold text-dark text-capitalize">{inv.clientName}</div>
                        <div className="x-small text-muted">{inv.mobile}</div>
                    </td>
                    <td className="py-3 text-muted small">
                      {new Date(inv.date || inv.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 text-end fw-bold text-dark">
                       ₹{Number(inv.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {/* Preview Button */}
                        <button onClick={() => setSelectedInvoice(inv)} className="btn btn-sm btn-light border-0 shadow-sm p-2 text-primary" title="View">
                          <Eye size={18} />
                        </button>
                        
                        {/* Edit Button */}
                        <button onClick={() => handleEdit(inv)} className="btn btn-sm btn-light border-0 shadow-sm p-2 text-warning" title="Edit">
                          <Edit3 size={18} />
                        </button>

                        {/* Download Button */}
                        <button onClick={() => handleDownload(inv)} className="btn btn-sm btn-light border-0 shadow-sm p-2 text-success" title="Download">
                          <Download size={18} />
                        </button>

                        {/* Delete Button */}
                        <button onClick={() => handleDelete(inv._id)} className="btn btn-sm btn-light border-0 shadow-sm p-2 text-danger" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="text-center p-5 text-muted">No invoices found for HealthyChef.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- View Modal: Prop name 'invoiceData' fix kiya --- */}
      {selectedInvoice && (
        <InvoicePreviewModal 
            show={!!selectedInvoice} 
            onClose={() => setSelectedInvoice(null)} 
            invoiceData={selectedInvoice} 
        />
      )}

      {/* --- Hidden Component for PDF --- */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
        <div ref={pdfComponentRef}>
          {downloadingInv && (
            <InvoicePreview 
              clientName={downloadingInv.clientName} 
              mobile={downloadingInv.mobile} 
              email={downloadingInv.email} 
              address={downloadingInv.address}
              items={downloadingInv.items} 
              subTotal={downloadingInv.totalAmount} 
              invoiceNumber={downloadingInv.invoiceNumber}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;