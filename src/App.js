import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import { LayoutDashboard, FilePlus, ListOrdered, ClipboardList } from 'lucide-react'; // Icons for better UI

function App() {
  return (
    <Router>
      <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        
        {/* Sidebar - Clean & Professional */}
        <nav className="bg-dark text-white p-4 shadow-lg" style={{ width: '280px', position: 'sticky', top: 0, height: '100 vh' }}>
          <div className="mb-5 px-2">
            <h3 className="fw-black mb-1 text-success" style={{ letterSpacing: '-1px' }}>HealthyChef</h3>
            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>MultiSpan ERP Solution</small>
          </div>

          <ul className="nav flex-column gap-3">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white-50 d-flex align-items-center gap-2 hover-white">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/create" className="nav-link text-white-50 d-flex align-items-center gap-2 hover-white">
                <FilePlus size={18} /> Create Invoice
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/list" className="nav-link text-white-50 d-flex align-items-center gap-2 hover-white">
                <ListOrdered size={18} /> Invoice List
              </Link>
            </li>
            <li className="nav-item border-top border-secondary pt-3 mt-2">
              <Link to="/inventory" className="nav-link text-white-50 d-flex align-items-center gap-2 hover-white">
                <ClipboardList size={18} /> Inventory Stock
              </Link>
            </li>
          </ul>

          {/* Footer inside sidebar */}
          <div className="position-absolute bottom-0 mb-4 px-2">
             <div className="badge bg-success-subtle text-success p-2 rounded-pill small">v1.0.4 - Live</div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow-1 p-5 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<InvoiceForm />} />
            <Route path="/edit/:id" element={<InvoiceForm />} />
            <Route path="/list" element={<InvoiceList />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </main>
      </div>
      
      {/* Inline CSS for Sidebar Hover Effect */}
      <style>{`
        .hover-white:hover {
          color: #fff !important;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          transition: 0.3s;
        }
        .fw-black { font-weight: 900; }
      `}</style>
    </Router>
  );
}

export default App;