import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Admin.css';

function AdminReports() {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/admin/missing-products',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/missing-products/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="admin-reports">
      <h1>Missing Product Reports</h1>

      {reports.length === 0 ? (
        <div className="empty-state">
          <p>No pending missing product reports</p>
        </div>
      ) : (
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Requested Quantity</th>
                <th>Customer</th>
                <th>Request Count</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td><strong>{report.productName}</strong></td>
                  <td>{report.requestedQuantity}</td>
                  <td>{report.customerName}</td>
                  <td>
                    <span className="badge-count">{report.requestCount}</span>
                  </td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${report.status}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-success"
                      onClick={() => updateStatus(report.id, 'restocked')}
                    >
                      Restocked
                    </button>
                    <button 
                      className="btn-dismiss"
                      onClick={() => updateStatus(report.id, 'dismissed')}
                    >
                      Dismiss
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminReports;
