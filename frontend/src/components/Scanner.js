import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

function Scanner() {
  const [scannedData, setScannedData] = useState('');
  const [manualInput, setManualInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText) {
      setScannedData(decodedText);
      scanner.clear();
      navigate(`/pcba/${encodeURIComponent(decodedText)}`);
    }

    function onScanError(error) {
      // Silent error handling
    }

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, [navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      navigate(`/pcba/${encodeURIComponent(manualInput.trim())}`);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Scan QR Code or Barcode</h2>
        <div id="qr-reader" className="scanner-video"></div>
        {scannedData && (
          <div className="alert alert-success">
            Scanned: {scannedData}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Manual Entry</h2>
        <form onSubmit={handleManualSubmit}>
          <div className="form-group">
            <label>Enter Serial Number or Barcode:</label>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g., PCB-2024-001"
            />
          </div>
          <button type="submit" className="btn btn-primary">Look Up</button>
        </form>
      </div>
    </div>
  );
}

export default Scanner;
