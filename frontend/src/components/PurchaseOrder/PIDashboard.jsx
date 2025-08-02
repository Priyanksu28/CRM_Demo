import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PIDashboard = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem('token'));

  const fetchPurchaseOrders = async () => {
    if (!token) {
      toast.error('No token found, please log in');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:3000/api/po', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchaseOrders(res.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch POs', error);
      toast.error('Error loading purchase orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [token]);

  // Function to handle PDF download
  const handleDownloadPDF = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/po/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important: to handle the PDF as a file
      });

      // Create a temporary link element to trigger the download
      const fileURL = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `PO_${id}.pdf`; // Set the download file name
      link.click();

      // Clean up
      URL.revokeObjectURL(fileURL);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">PI Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">PI Number</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Grand Total</th>
              <th className="py-2 px-4 border-b">PI</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center">No PI found</td>
              </tr>
            ) : (
              purchaseOrders.map((po) => (
                <tr key={po._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{po.poNumber}</td>
                  <td className="py-2 px-4 border-b">{new Date(po.poDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{po.customerId?.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{po.status}</td>
                  <td className="py-2 px-4 border-b">{po.grandTotal.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleDownloadPDF(po._id)} // Trigger download
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
