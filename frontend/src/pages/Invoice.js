import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Invoice.css';

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInvoice = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/orders/invoice/${orderId}`);
      setInvoice(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice');
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handlePrint = () => {
    // Add some debugging for print
    console.log('🖨️ Print initiated for invoice:', invoice?.invoiceNumber);
    
    // Add a slight delay to ensure styles are loaded
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const downloadPDF = () => {
    // In a real application, you would generate a PDF here
    // For now, we'll simulate the download
    const element = document.createElement('a');
    const file = new Blob([generatePDFContent()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${invoice.invoiceNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generatePDFContent = () => {
    if (!invoice) return '';
    
    return `
INVENTORY PRO - INVOICE

Invoice Number: ${invoice.invoiceNumber}
Order Date: ${new Date(invoice.orderDate).toLocaleDateString()}

Customer Information:
Name: ${invoice.customerName}
Email: ${invoice.customerEmail}

Items:
${invoice.items.map(item => 
  `${item.name} - Qty: ${item.quantity} x $${item.price} = $${item.total}`
).join('\n')}

Subtotal: $${invoice.subtotal}
Tax: $${invoice.tax}
Total: $${invoice.total}

Status: ${invoice.status}

Thank you for your business!
`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Invoice</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="error-container">
        <h2>Invoice Not Found</h2>
        <p>The requested invoice could not be found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="invoice-container">
      {/* Print/Download Actions */}
      <div className="invoice-actions no-print">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <div className="action-buttons">
          <button onClick={handlePrint} className="print-btn">
            🖨️ Print
          </button>
          <button onClick={downloadPDF} className="download-btn">
            📄 Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="invoice-content">
        {/* Header */}
        <div className="invoice-header">
          <div className="company-info">
            <h1>InventoryPro</h1>
            <p>Professional Inventory Management System</p>
            <p>📧 support@inventorypro.com</p>
            <p>📞 (555) 123-4567</p>
          </div>
          <div className="invoice-title">
            <h2>INVOICE</h2>
            <div className="invoice-number">#{invoice.invoiceNumber}</div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="invoice-details">
          <div className="invoice-info">
            <h3>Invoice Details</h3>
            <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
            <p><strong>Order Date:</strong> {new Date(invoice.orderDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> 
              <span className={`status-badge ${invoice.status}`}>
                {invoice.status}
              </span>
            </p>
          </div>
          
          <div className="customer-info">
            <h3>Bill To</h3>
            <p><strong>{invoice.customerName}</strong></p>
            <p>{invoice.customerEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-items">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${parseFloat(item.price).toFixed(2)}</td>
                  <td>${parseFloat(item.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="invoice-totals">
          <div className="totals-table">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="total-row">
                <span>Tax:</span>
                <span>${parseFloat(invoice.tax).toFixed(2)}</span>
              </div>
            )}
            <div className="total-row total-final">
              <span>Total:</span>
              <span>${parseFloat(invoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer">
          <div className="footer-section">
            <h4>Payment Information</h4>
            <p>Payment was processed via online checkout.</p>
            <p>Thank you for your business!</p>
          </div>
          
          <div className="footer-section">
            <h4>Questions?</h4>
            <p>Contact us at support@inventorypro.com</p>
            <p>Or call (555) 123-4567</p>
          </div>
        </div>

        {/* Print Footer */}
        <div className="print-footer">
          <p>Generated on {new Date().toLocaleDateString()}</p>
          <p>This is an electronic invoice from InventoryPro</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;