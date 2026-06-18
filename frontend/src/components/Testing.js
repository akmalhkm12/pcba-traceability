import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pcbaAPI } from '../services/api';

function Testing() {
  const [formData, setFormData] = useState({
    serial_number: '',
    test_type: '',
    test_result: '',
    measured_value: '',
    expected_value: '',
    unit: '',
    operator_name: '',
    notes: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const testTypes = [
    'Power-On Test',
    'Voltage Test',
    'Current Test',
    'Functional Test',
    'ICT (In-Circuit Test)',
    'Boundary Scan',
    'Flying Probe Test',
    'Burn-In Test',
    'Environmental Test',
    'EMC Test',
    'Signal Integrity Test',
    'Final QC Test'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get PCBA ID
      const pcbaResponse = await pcbaAPI.getPCBA(formData.serial_number);
      const pcbaId = pcbaResponse.data.id;

      // Create test record
      await pcbaAPI.createTestRecord({
        pcba_id: pcbaId,
        test_type: formData.test_type,
        test_result: formData.test_result,
        measured_value: formData.measured_value ? parseFloat(formData.measured_value) : null,
        expected_value: formData.expected_value ? parseFloat(formData.expected_value) : null,
        unit: formData.unit,
        operator_name: formData.operator_name,
        notes: formData.notes
      });

      setMessage({
        type: 'success',
        text: `Test recorded successfully! Result: ${formData.test_result.toUpperCase()}`
      });

      // Reset form except serial number and operator
      setFormData({
        serial_number: formData.serial_number,
        test_type: '',
        test_result: '',
        measured_value: '',
        expected_value: '',
        unit: '',
        operator_name: formData.operator_name,
        notes: ''
      });

      setTimeout(() => {
        navigate(`/pcba/${formData.serial_number}`);
      }, 1500);
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage({ type: 'error', text: 'PCBA not found. Please check the serial number.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to record test. Please try again.' });
      }
    }
  };

  return (
    <div className="card">
      <h2>Testing & Quality Control</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>PCBA Serial Number*</label>
          <input
            type="text"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            placeholder="Scan or enter serial number"
            required
          />
        </div>

        <div className="form-group">
          <label>Test Type*</label>
          <select
            name="test_type"
            value={formData.test_type}
            onChange={handleChange}
            required
          >
            <option value="">Select test type...</option>
            {testTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Test Result*</label>
          <select
            name="test_result"
            value={formData.test_result}
            onChange={handleChange}
            required
          >
            <option value="">Select result...</option>
            <option value="pass">PASS</option>
            <option value="fail">FAIL</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Measured Value</label>
            <input
              type="number"
              step="any"
              name="measured_value"
              value={formData.measured_value}
              onChange={handleChange}
              placeholder="e.g., 5.02"
            />
          </div>

          <div className="form-group">
            <label>Expected Value</label>
            <input
              type="number"
              step="any"
              name="expected_value"
              value={formData.expected_value}
              onChange={handleChange}
              placeholder="e.g., 5.00"
            />
          </div>

          <div className="form-group">
            <label>Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g., V, A, Ω"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Operator Name*</label>
          <input
            type="text"
            name="operator_name"
            value={formData.operator_name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional test notes or observations"
          />
        </div>

        <button type="submit" className="btn btn-success">Record Test Result</button>
      </form>
    </div>
  );
}

export default Testing;
