import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatToMalaysiaTime } from '../utils/timeFormat';

function DashboardTable({ pcbas, getStatusBadge }) {
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Sorting logic
  const sortedPCBAs = [...pcbas].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedPCBAs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPCBAs = sortedPCBAs.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <label style={{ marginRight: '0.5rem', fontWeight: 600 }}>Show:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '2px solid var(--border-color)' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span style={{ marginLeft: '0.5rem', color: 'var(--medium-gray)' }}>entries per page</span>
        </div>
        <div className="pagination-info">
          Showing {startIndex + 1} to {Math.min(endIndex, sortedPCBAs.length)} of {sortedPCBAs.length} entries
        </div>
      </div>

      <table className="professional-table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort('serial_number')}>
              Serial Number{getSortIndicator('serial_number')}
            </th>
            <th className="sortable" onClick={() => handleSort('board_type')}>
              Board Type{getSortIndicator('board_type')}
            </th>
            <th className="sortable" onClick={() => handleSort('status')}>
              Status{getSortIndicator('status')}
            </th>
            <th className="sortable" onClick={() => handleSort('created_at')}>
              Created{getSortIndicator('created_at')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPCBAs.map(pcba => (
            <tr key={pcba.id}>
              <td style={{ fontWeight: 600 }}>{pcba.serial_number}</td>
              <td>{pcba.board_type}</td>
              <td>{getStatusBadge(pcba.status)}</td>
              <td>{formatToMalaysiaTime(pcba.created_at)}</td>
              <td>
                <Link to={`/pcba/${encodeURIComponent(pcba.serial_number)}`}>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    View Details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {renderPaginationButtons()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      )}
    </>
  );
}

export default DashboardTable;
