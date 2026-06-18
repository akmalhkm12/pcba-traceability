import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pcbaAPI } from '../services/api';
import { exportPCBAsToCSV } from '../utils/csvExport';
import DashboardTable from './DashboardTable';

function Dashboard() {
  const [statistics, setStatistics] = useState({ total: 0, passed: 0, failed: 0, pending: 0 });
  const [pcbas, setPCBAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null); // null, 'passed', 'failed', 'pending'

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, pcbasRes] = await Promise.all([
        pcbaAPI.getStatistics(),
        pcbaAPI.getAllPCBAs()
      ]);
      setStatistics(statsRes.data);
      setPCBAs(pcbasRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      passed: 'status-badge status-passed',
      failed: 'status-badge status-failed',
      pending: 'status-badge status-pending'
    };
    return <span className={classes[status] || classes.pending}>{status.toUpperCase()}</span>;
  };

  // Filter PCBAs based on search query and status filter
  const filteredPCBAs = pcbas.filter(pcba => {
    // Search filter
    const matchesSearch = !searchQuery ||
      pcba.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pcba.board_type.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = !statusFilter || pcba.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusFilter = (status) => {
    if (statusFilter === status) {
      // If clicking the same filter, clear it
      setStatusFilter(null);
    } else {
      setStatusFilter(status);
    }
  };

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

      <div className="stats-grid">
        <div
          className="stat-card"
          onClick={() => setStatusFilter(null)}
          style={{
            cursor: 'pointer',
            border: statusFilter === null ? '2px solid #3498db' : '2px solid transparent',
            transform: statusFilter === null ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.2s'
          }}
        >
          <h3>Total PCBAs</h3>
          <div className="stat-value">{statistics.total}</div>
        </div>
        <div
          className="stat-card"
          onClick={() => handleStatusFilter('passed')}
          style={{
            cursor: 'pointer',
            border: statusFilter === 'passed' ? '2px solid #27ae60' : '2px solid transparent',
            transform: statusFilter === 'passed' ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.2s'
          }}
        >
          <h3>Passed</h3>
          <div className="stat-value" style={{ color: '#27ae60' }}>{statistics.passed}</div>
        </div>
        <div
          className="stat-card"
          onClick={() => handleStatusFilter('failed')}
          style={{
            cursor: 'pointer',
            border: statusFilter === 'failed' ? '2px solid #e74c3c' : '2px solid transparent',
            transform: statusFilter === 'failed' ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.2s'
          }}
        >
          <h3>Failed</h3>
          <div className="stat-value" style={{ color: '#e74c3c' }}>{statistics.failed}</div>
        </div>
        <div
          className="stat-card"
          onClick={() => handleStatusFilter('pending')}
          style={{
            cursor: 'pointer',
            border: statusFilter === 'pending' ? '2px solid #f39c12' : '2px solid transparent',
            transform: statusFilter === 'pending' ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.2s'
          }}
        >
          <h3>Pending</h3>
          <div className="stat-value" style={{ color: '#f39c12' }}>{statistics.pending}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ marginBottom: 0 }}>PCBA Records</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {statusFilter && (
              <button className="btn btn-secondary" onClick={() => setStatusFilter(null)} style={{ padding: '0.6rem 1.2rem' }}>
                Clear Filter
              </button>
            )}
            {filteredPCBAs.length > 0 && (
              <button
                className="export-btn"
                onClick={() => exportPCBAsToCSV(filteredPCBAs)}
              >
                📊 Export to CSV
              </button>
            )}
          </div>
        </div>

        {pcbas.length > 0 && (
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="🔍 Search by serial number or board type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
            />
            {(searchQuery || statusFilter) && (
              <p style={{ color: 'var(--medium-gray)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {statusFilter && <span>Showing <strong>{statusFilter.toUpperCase()}</strong> PCBAs • </span>}
                Found {filteredPCBAs.length} result{filteredPCBAs.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {pcbas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--medium-gray)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No PCBAs found in the system.</p>
            <Link to="/create">
              <button className="btn btn-success">Create Your First PCBA</button>
            </Link>
          </div>
        ) : filteredPCBAs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--medium-gray)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No PCBAs match your search criteria.</p>
            <button className="btn btn-secondary" onClick={() => {
              setSearchQuery('');
              setStatusFilter(null);
            }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <DashboardTable pcbas={filteredPCBAs} getStatusBadge={getStatusBadge} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
