import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pcbaAPI } from '../services/api';
import { formatToMalaysiaTime } from '../utils/timeFormat';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ marginBottom: 0 }}>Recent PCBAs</h2>
          {statusFilter && (
            <button className="btn btn-secondary" onClick={() => setStatusFilter(null)}>
              Clear Filter
            </button>
          )}
        </div>

        {pcbas.length > 0 && (
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Search by serial number or board type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
            />
            {(searchQuery || statusFilter) && (
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {statusFilter && <span>Showing <strong>{statusFilter.toUpperCase()}</strong> PCBAs • </span>}
                Found {filteredPCBAs.length} result{filteredPCBAs.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {pcbas.length === 0 ? (
          <p>No PCBAs found. <Link to="/create">Create your first PCBA</Link></p>
        ) : filteredPCBAs.length === 0 ? (
          <p>No PCBAs match your search. <button className="btn btn-secondary" onClick={() => setSearchQuery('')}>Clear Search</button></p>
        ) : (
          <ul className="pcba-list">
            {filteredPCBAs.map(pcba => (
              <li key={pcba.id} className="pcba-item">
                <div className="pcba-info">
                  <h3>{pcba.serial_number}</h3>
                  <p>Board Type: {pcba.board_type} | Created: {formatToMalaysiaTime(pcba.created_at)}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {getStatusBadge(pcba.status)}
                  <Link to={`/pcba/${encodeURIComponent(pcba.serial_number)}`}>
                    <button className="btn btn-primary">View Details</button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
