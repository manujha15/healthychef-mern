import React, { useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import InvoicePreview from './InvoicePreview'; // Ensure correct path

const InvoicePreviewModal = ({ show, onClose, invoiceData }) => {
    const componentRef = useRef();

    if (!show || !invoiceData) return null;

    const handleDownloadPDF = () => {
        const element = componentRef.current;
        const options = {
            margin: 10,
            filename: `HealthyChef_${invoiceData.clientName || 'Bill'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element).save();
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4">
                    {/* Header */}
                    <div className="modal-header bg-dark text-white border-0">
                        <h5 className="modal-title fw-bold">Invoice Preview - {invoiceData.invoiceNumber}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    {/* Modal Body: Iske andar ka design change kiya hai */}
                    <div className="modal-body p-0 bg-light" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                        <div ref={componentRef} className="bg-white mx-auto shadow-sm my-3" style={{ width: '95%', minHeight: '297mm' }}>
                            {/* Hum InvoicePreview component ko reuse kar rahe hain taaki branding ek jaisi rahe */}
                            <InvoicePreview 
                                clientName={invoiceData.clientName}
                                mobile={invoiceData.mobile}
                                email={invoiceData.email}
                                address={invoiceData.address}
                                items={invoiceData.items}
                                subTotal={invoiceData.totalAmount || invoiceData.subTotal}
                                invoiceNumber={invoiceData.invoiceNumber}
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="modal-footer bg-white border-top shadow-sm">
                        <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={onClose}>
                            <X size={18} className="me-2" /> Close
                        </button>
                        <button className="btn btn-success px-4 rounded-pill fw-bold" onClick={handleDownloadPDF}>
                            <Download size={18} className="me-2" /> Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreviewModal;