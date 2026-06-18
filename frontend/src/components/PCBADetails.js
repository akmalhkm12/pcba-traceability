import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pcbaAPI } from '../services/api';

function PCBADetails() {
  const { identifier } = useParams();
  const [pcba, setPCBA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPCBADetails = useCallback(async () => {
    try {
      const response = await pcbaAPI.getPCBA(identifier);
      setPCBA(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`PCBA "${identifier}" not found`);
      } else {
        setError('Failed to load PCBA details');
      }
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    loadPCBADetails();
  }, [loadPCBADetails]);

  const getStatusBadge = (status) => {
    const classes = {
      passed: 'status-badge status-passed',
      failed: 'status-badge status-failed',
      pending: 'status-badge status-pending'
    };
    return <span className={classes[status] || classes.pending}>{status.toUpperCase()}</span>;
  };

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">{error}</div>
        <Link to="/"><button className="btn btn-primary">Back to Dashboard</button></Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>PCBA Details</h1>
        <Link to="/"><button className="btn btn-secondary">Back to Dashboard</button></Link>
      </div>

      <div className="card">
        <h2>General Information</h2>
        <table className="table">
          <tbody>
            <tr>
              <th>Serial Number</th>
              <td>{pcba.serial_number}</td>
            </tr>
            <tr>
              <th>Board Type</th>
              <td>{pcba.board_type}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{getStatusBadge(pcba.status)}</td>
            </tr>
            <tr>
              <th>Created</th>
              <td>{new Date(pcba.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Last Updated</th>
              <td>{new Date(pcba.updated_at).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="details-section">
          <h3>Assembly Records ({pcba.assembly_records?.length || 0})</h3>
          {pcba.assembly_records && pcba.assembly_records.length > 0 ? (
            pcba.assembly_records.map(record => (
              <div key={record.id} className="record-item">
                <h4>{record.process_stage}</h4>
                <p><strong>Operator:</strong> {record.operator_name}</p>
                <p><strong>Timestamp:</strong> {new Date(record.timestamp).toLocaleString()}</p>
                {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
              </div>
            ))
          ) : (
            <p>No assembly records yet. <Link to="/assembly">Add assembly record</Link></p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="details-section">
          <h3>Test Records ({pcba.test_records?.length || 0})</h3>
          {pcba.test_records && pcba.test_records.length > 0 ? (
            pcba.test_records.map(record => (
              <div key={record.id} className="record-item" style={{
                borderLeftColor: record.test_result === 'pass' ? '#27ae60' : '#e74c3c'
              }}>
                <h4>{record.test_type} - {record.test_result.toUpperCase()}</h4>
                <p><strong>Operator:</strong> {record.operator_name}</p>
                <p><strong>Timestamp:</strong> {new Date(record.timestamp).toLocaleString()}</p>
                {record.measured_value !== null && (
                  <p>
                    <strong>Measured:</strong> {record.measured_value} {record.unit}
                    {record.expected_value !== null && ` (Expected: ${record.expected_value} ${record.unit})`}
                  </p>
                )}
                {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
              </div>
            ))
          ) : (
            <p>No test records yet. <Link to="/testing">Add test record</Link></p>
          )}
        </div>
      </div>

      {pcba.components && pcba.components.length > 0 && (
        <div className="card">
          <div className="details-section">
            <h3>Components ({pcba.components.length})</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Value</th>
                  <th>Lot Code</th>
                  <th>Supplier</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {pcba.components.map(component => (
                  <tr key={component.id}>
                    <td>{component.component_name}</td>
                    <td>{component.component_value || '-'}</td>
                    <td>{component.lot_code || '-'}</td>
                    <td>{component.supplier || '-'}</td>
                    <td>{new Date(component.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PCBADetails;
