import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pcbaAPI } from '../services/api';

function AssemblyProcess() {
  const [formData, setFormData] = useState({
    serial_number: '',
    process_stage: '',
    operator_name: '',
    notes: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const processStages = [
    'PCB Inspection',
    'Solder Paste Application',
    'Component Placement',
    'Reflow Soldering',
    'AOI (Automated Optical Inspection)',
    'Manual Inspection',
    'Through-Hole Assembly',
    'Wave Soldering',
    'Cleaning',
    'Conformal Coating',
    'Final Assembly',
    'Quality Check'
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
      // First, get the PCBA to ensure it exists and get its ID
      const pcbaResponse = await pcbaAPI.getPCBA(formData.serial_number);
      const pcbaId = pcbaResponse.data.id;

      // Create assembly record
      await pcbaAPI.createAssemblyRecord({
        pcba_id: pcbaId,
        process_stage: formData.process_stage,
        operator_name: formData.operator_name,
        notes: formData.notes
      });

      setMessage({ type: 'success', text: 'Assembly record added successfully!' });

      // Reset form
      setFormData({
        serial_number: formData.serial_number,
        process_stage: '',
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
        setMessage({ type: 'error', text: 'Failed to add assembly record. Please try again.' });
      }
    }
  };

  return (
    <div className="card">
      <h2>Assembly Process Tracking</h2>

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
          <label>Process Stage*</label>
          <select
            name="process_stage"
            value={formData.process_stage}
            onChange={handleChange}
            required
          >
            <option value="">Select process stage...</option>
            {processStages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
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
            placeholder="Optional notes about this process step"
          />
        </div>

        <button type="submit" className="btn btn-success">Record Assembly Step</button>
      </form>
    </div>
  );
}

export default AssemblyProcess;
