import React, { useState } from 'react';
import axios from 'axios';
import { Download, Filter, FileSpreadsheet, PieChart } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [dates, setDates] = useState({ start: '', end: '' });

    const fetchReport = async () => {
        const res = await axios.get(`http://127.0.0.1:5000/api/invoice/reports/sales?startDate=${dates.start}&endDate=${dates.end}`);
        setReportData(res.data);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("HealthyChef - Sales Report", 20, 10);
        doc.autoTable({
            head: [['Date', 'Client', 'Amount', 'Status']],
            body: reportData.invoices.map(inv => [
                new Date(inv.createdAt).toLocaleDateString(),
                inv.clientName,
                `Rs. ${inv.totalAmount}`,
                inv.status
            ]),
        });
        doc.save(`Report_${dates.start}_to_${dates.end}.pdf`);
    };

    return (
        <div className="container mt-4">
            <h2 className="fw-black mb-4">Sales <span className="text-success">Intelligence</span></h2>
            
            {/* Filter Bar */}
            <div className="card border-0 shadow-sm p-4 mb-4">
                <div className="row align-items-end">
                    <div className="col-md-4">
                        <label className="small fw-bold">From Date</label>
                        <input type="date" className="form-control" onChange={e => setDates({...dates, start: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <label className="small fw-bold">To Date</label>
                        <input type="date" className="form-control" onChange={e => setDates({...dates, end: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-success w-100 fw-bold" onClick={fetchReport}>
                            <Filter size={18} className="me-2"/> Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {reportData && (
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card border-0 bg-dark text-white p-4 rounded-4 shadow">
                            <h6 className="opacity-75">Net Revenue</h6>
                            <h1 className="fw-black">₹{reportData.revenue}</h1>
                            <p className="mb-0 text-success small">Generated from {reportData.count} orders</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card border-0 bg-white p-4 rounded-4 shadow h-100">
                            <h6 className="text-muted">GST Collected (Estimate)</h6>
                            <h2 className="fw-bold text-dark">₹{reportData.taxEstimate}</h2>
                            <button className="btn btn-outline-dark btn-sm mt-2" onClick={exportToPDF}>
                                <Download size={14} className="me-2"/> Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;