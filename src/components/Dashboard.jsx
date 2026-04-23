import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, FileText, AlertTriangle, ChefHat, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    totalCount: 0, 
    totalAmount: 0, 
    recentInvoices: [],
    lowStockCount: 0,
    chartData: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, productRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/invoice/reports/sales'),
          axios.get('http://127.0.0.1:5000/api/product/list')
        ]);

        const data = summaryRes.data;
        const products = productRes.data;

        // Backend se aaye invoices ko chart ke liye prepare karein
        const formattedChartData = (data.invoices || []).slice(0, 7).map(inv => ({
          name: inv.clientName ? inv.clientName.substring(0, 8) : "Guest",
          total: Number(inv.totalAmount) || 0
        }));

        setStats({
          totalCount: data.count || 0,
          totalAmount: data.revenue || 0,
          recentInvoices: data.invoices || [],
          lowStockCount: products.filter(p => p.stock < 10).length,
          chartData: formattedChartData
        });
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-success mb-3" role="status"></div>
        <div className="text-success fw-bold">Cooking HealthyChef Insights...</div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4 mt-4 mb-5" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-black mb-1" style={{ color: '#1b4d3e', letterSpacing: '-1px' }}>
            HealthyChef <span className="text-success text-opacity-75">Analytics</span>
          </h2>
          <p className="text-muted mb-0 small">Dashboard / Business Overview</p>
        </div>
        <div className="bg-white p-2 px-3 rounded-pill shadow-sm small fw-bold text-success border border-success border-opacity-10">
          <TrendingUp size={16} className="me-2" /> Live System Status
        </div>
      </div>
      
      {/* Stat Cards Section */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-white position-relative overflow-hidden" 
               style={{ background: 'linear-gradient(45deg, #1b4d3e 0%, #27ae60 100%)' }}>
            <p className="small text-uppercase fw-bold opacity-75 mb-1">Cumulative Revenue</p>
            <h2 className="fw-bold mb-0">₹{stats.totalAmount.toLocaleString('en-IN')}</h2>
            <div className="mt-2 small opacity-75"><ArrowUpRight size={14} className="me-1" /> Real-time Earnings</div>
            <IndianRupee className="position-absolute end-0 bottom-0 m-3 opacity-10" size={80} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <p className="small text-uppercase fw-bold text-muted mb-1">Orders Processed</p>
            <h2 className="fw-bold mb-0 text-dark">{stats.totalCount} <span className="fs-6 fw-normal text-muted">Invoices</span></h2>
            <div className="mt-2 small text-success"><TrendingUp size={14} className="me-1" /> Syncing with MongoDB</div>
            <FileText className="position-absolute end-0 bottom-0 m-3 text-success opacity-10" size={60} />
          </div>
        </div>

        <div className="col-md-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-5 ${stats.lowStockCount > 0 ? 'border-danger' : 'border-success'}`}>
            <p className="small text-uppercase fw-bold text-muted mb-1">Kitchen Status</p>
            <h2 className={`fw-bold mb-0 ${stats.lowStockCount > 0 ? 'text-danger' : 'text-success'}`}>
              {stats.lowStockCount > 0 ? `${stats.lowStockCount} Items Low` : 'All Systems Go'}
            </h2>
            <p className="mt-2 small text-muted mb-0">{stats.lowStockCount > 0 ? 'Action required in Inventory' : 'No Low Stock Alerts'}</p>
            <AlertTriangle className={`position-absolute end-0 bottom-0 m-3 opacity-10 ${stats.lowStockCount > 0 ? 'text-danger' : 'text-success'}`} size={60} />
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Visual Analytics: Revenue Trend Chart */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="fw-bold mb-0 text-dark">Revenue Trend</h5>
            </div>
            <div className="card-body">
              {/* Important: Fixed Height for Recharts */}
              <div style={{ width: '100%', height: 300 }}> 
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip cursor={{fill: '#f8f9fa'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="total" fill="#27ae60" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Master Operations */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white h-100 position-relative">
            <h5 className="fw-bold mb-4 d-flex align-items-center">
              <ChefHat className="me-2 text-success" /> Master Operations
            </h5>
            <div className="d-grid gap-3 mb-4">
              <button className="btn btn-success p-3 rounded-3 fw-bold border-0 d-flex justify-content-between align-items-center shadow-sm" onClick={() => window.location.href='/billing'}>
                Create New Invoice <ArrowUpRight size={18} />
              </button>
              <button className="btn btn-outline-light p-3 rounded-3 text-start border-secondary opacity-75" onClick={() => window.location.href='/inventory'}>
                📦 Kitchen Stock Management
              </button>
            </div>
            <div className="p-3 rounded-3" style={{ backgroundColor: '#2d3436' }}>
              <div className="d-flex align-items-center mb-2">
                <span className="p-1 bg-success rounded-circle me-2"></span>
                <span className="small text-success fw-bold">Stock Intelligence</span>
              </div>
              <p className="small text-white-50 mb-0">System automatically detects low stock levels based on your daily meal frequency.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table: Recent Order History */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Recent Order History</h5>
              <button className="btn btn-link text-success fw-bold text-decoration-none small" onClick={() => window.location.href='/invoices'}>View All</button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th className="border-0">CLIENT / CONTACT</th>
                    <th className="border-0">BILLING AMOUNT</th>
                    <th className="border-0 text-center">FULFILLMENT</th>
                    <th className="border-0 text-end">ISSUED ON</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInvoices.length > 0 ? (
                    stats.recentInvoices.map((inv) => (
                      <tr key={inv._id}>
                        <td className="border-0 py-3">
                          <div className="fw-bold text-dark text-capitalize">{inv.clientName}</div>
                          <div className="small text-muted">{inv.mobile || 'Guest'}</div>
                        </td>
                        <td className="border-0 py-3">
                          <div className="fw-bold" style={{ color: '#1b4d3e' }}>₹{(inv.totalAmount || 0).toLocaleString('en-IN')}</div>
                        </td>
                        <td className="border-0 py-3 text-center">
                          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-medium" style={{ fontSize: '11px' }}>
                            Success
                          </span>
                        </td>
                        <td className="border-0 py-3 text-end text-muted small">
                          {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">No invoices found. Start billing to see data!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;