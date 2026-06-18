# PCBA Traceability System

A comprehensive web-based traceability system for Printed Circuit Board Assembly (PCBA) designed for small-scale prototype and lab operations.

## 🚀 Quick Deploy (Make It Accessible to Everyone)

Want everyone on your team to access this from their own laptops anywhere?

**👉 See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step deployment guide (20-30 minutes)**

The guide covers FREE deployment to cloud services with no credit card required!

---

## Features

- **Assembly Process Tracking**: Record each assembly step with operator names, timestamps, and notes
- **Testing & QC Records**: Document test results with measured values, pass/fail status, and detailed notes
- **Barcode/QR Scanning**: Built-in camera-based scanning for quick PCBA lookup
- **Dashboard**: Real-time statistics and overview of all PCBAs
- **Complete Traceability**: Full history of each board from creation to final testing

## Technology Stack

### Backend
- Node.js with Express
- SQLite database (better-sqlite3)
- RESTful API

### Frontend
- React 18
- React Router for navigation
- html5-qrcode for scanning functionality
- Axios for API communication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

### 1. Install Backend Dependencies

```bash
cd pcba-traceability/backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd pcba-traceability/frontend
npm install
```

## Running the Application

### Start Backend Server

```bash
cd pcba-traceability/backend
npm start
```

The backend will run on `http://localhost:3001`

For development with auto-reload:
```bash
npm run dev
```

### Start Frontend Application

In a new terminal:

```bash
cd pcba-traceability/frontend
npm start
```

The frontend will automatically open at `http://localhost:3000`

## Usage Guide

### 1. Creating a PCBA

1. Navigate to **Create PCBA** from the main menu
2. Enter a unique serial number (or use the Generate button)
3. Specify the board type
4. Click **Create PCBA**

### 2. Recording Assembly Steps

1. Go to **Assembly** from the main menu
2. Enter or scan the PCBA serial number
3. Select the process stage (e.g., Component Placement, Reflow Soldering)
4. Enter operator name
5. Add optional notes
6. Click **Record Assembly Step**

### 3. Recording Test Results

1. Navigate to **Testing**
2. Enter or scan the PCBA serial number
3. Select test type (e.g., Functional Test, Voltage Test)
4. Choose Pass/Fail result
5. Optionally enter measured values, expected values, and units
6. Enter operator name and notes
7. Click **Record Test Result**

### 4. Scanning PCBAs

1. Go to **Scanner**
2. Allow camera access when prompted
3. Point camera at QR code or barcode
4. System will automatically navigate to PCBA details

Alternatively, use the manual entry field to look up by serial number.

### 5. Viewing PCBA Details

- Click on any PCBA from the Dashboard
- Or use the Scanner to look up by serial number
- View complete history including:
  - General information and status
  - All assembly records
  - All test records
  - Component tracking (if applicable)

## Database Schema

### PCBAs Table
- `id`: Unique UUID
- `serial_number`: Unique serial number
- `board_type`: Type/model of the board
- `status`: pending/passed/failed
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Assembly Records Table
- `id`: Auto-increment ID
- `pcba_id`: Foreign key to PCBAs
- `process_stage`: Assembly stage name
- `operator_name`: Name of operator
- `notes`: Optional notes
- `timestamp`: When recorded

### Test Records Table
- `id`: Auto-increment ID
- `pcba_id`: Foreign key to PCBAs
- `test_type`: Type of test performed
- `test_result`: pass/fail
- `measured_value`: Actual measurement
- `expected_value`: Expected measurement
- `unit`: Unit of measurement
- `operator_name`: Name of operator
- `notes`: Optional notes
- `timestamp`: When recorded

### Components Table
- `id`: Auto-increment ID
- `pcba_id`: Foreign key to PCBAs
- `component_name`: Component identifier
- `component_value`: Component value/rating
- `lot_code`: Manufacturer lot code
- `supplier`: Supplier name
- `timestamp`: When added

## API Endpoints

### PCBA Operations
- `POST /api/pcbas` - Create new PCBA
- `GET /api/pcbas` - Get all PCBAs
- `GET /api/pcbas/:identifier` - Get PCBA by ID or serial number
- `PATCH /api/pcbas/:id` - Update PCBA status

### Assembly Records
- `POST /api/assembly-records` - Create assembly record
- `GET /api/assembly-records/:pcba_id` - Get assembly records for PCBA

### Test Records
- `POST /api/test-records` - Create test record
- `GET /api/test-records/:pcba_id` - Get test records for PCBA

### Components
- `POST /api/components` - Add component

### Statistics
- `GET /api/statistics` - Get dashboard statistics

## Customization

### Adding Process Stages

Edit `frontend/src/components/AssemblyProcess.js` and modify the `processStages` array:

```javascript
const processStages = [
  'Your Custom Stage 1',
  'Your Custom Stage 2',
  // ...
];
```

### Adding Test Types

Edit `frontend/src/components/Testing.js` and modify the `testTypes` array:

```javascript
const testTypes = [
  'Your Custom Test 1',
  'Your Custom Test 2',
  // ...
];
```

## Troubleshooting

### Camera not working for scanning
- Ensure you're using HTTPS or localhost
- Grant camera permissions in your browser
- Check browser compatibility (Chrome/Firefox recommended)

### Backend connection errors
- Verify backend is running on port 3001
- Check for CORS issues in browser console
- Ensure SQLite database file has proper permissions

### Database file location
The SQLite database is created at `backend/pcba_traceability.db`

## Security Considerations

This system is designed for local/lab use. For production deployment:
- Add authentication and authorization
- Implement HTTPS
- Add input validation and sanitization
- Consider using PostgreSQL/MySQL for better concurrency
- Add backup and recovery procedures

## Future Enhancements

- User authentication and role-based access
- Advanced reporting and analytics
- Export to PDF/Excel
- Email notifications
- Integration with ERP systems
- Mobile app version
- Multi-location support

## License

This is a sample implementation. Modify as needed for your specific requirements.

## Support

For issues or questions, please refer to the documentation or modify the code to suit your needs.
