import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pcbaAPI } from '../services/api';

function CreatePCBA() {
  const [formData, setFormData] = useState({
    serial_number: '',
    board_type: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await pcbaAPI.createPCBA(formData);
      setMessage({ type: 'success', text: `PCBA created successfully! Serial: ${response.data.serial_number}` });
      setTimeout(() => {
        navigate(`/pcba/${encodeURIComponent(response.data.serial_number)}`);
      }, 1500);
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage({ type: 'error', text: 'Serial number already exists!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to create PCBA. Please try again.' });
      }
    }
  };

  const generateSerialNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    setFormData({
      ...formData,
      serial_number: `PCB-${timestamp}-${random}`
    });
  };

  return (
    <div className="card">
      <h2>Create New PCBA</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Serial Number*</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="e.g., PCB-2024-001"
              required
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-secondary" onClick={generateSerialNumber}>
              Generate
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Board Type*</label>
          <input
            type="text"
            name="board_type"
            value={formData.board_type}
            onChange={handleChange}
            placeholder="e.g., Main Controller v2.0"
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Create PCBA</button>
      </form>
    </div>
  );
}

export default CreatePCBA;
