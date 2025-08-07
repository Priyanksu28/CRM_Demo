import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PIDashboard = () => {
  const [proformaInvoices, setProformaInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem('token'));

  const fetchProformaInvoices = async () => {
    if (!token) {
      toast.error('No token found, please log in');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:3000/api/pi', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProformaInvoices(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch PIs', error);
      toast.error('Error loading proforma invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProformaInvoices();
  }, [token]);

  const handleDownloadPDF = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/pi/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const fileURL = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `PI_${id}.pdf`;
      link.click();

      URL.revokeObjectURL(fileURL);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PI PDF');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Proforma Invoice Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">PI Number</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Grand Total</th>
              <th className="py-2 px-4 border-b">Download</th>
            </tr>
          </thead>
          <tbody>
            {proformaInvoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center">No Proforma Invoices found</td>
              </tr>
            ) : (
              proformaInvoices.map((pi) => (
                <tr key={pi._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{pi.piNumber}</td>
                  <td className="py-2 px-4 border-b">{new Date(pi.piDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{pi.customerId?.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pi.status}</td>
                  <td className="py-2 px-4 border-b">₹{pi.grandTotal.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDownloadPDF(pi._id)}
                      className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Download PI
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PIDashboard;
