import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const QuotationDashboard = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('token'));

  const fetchQuotations = async () => {
    if (!token) {
      toast.error('No token found, please log in');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/quotation', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuotations(res.data);
    } catch (err) {
      console.error('Failed to fetch quotations', err);
      toast.error('Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return toast.error('No token found');
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/quotation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Quotation deleted');
      fetchQuotations(); // refresh list
    } catch (err) {
      console.error('Failed to delete quotation', err);
      toast.error('Failed to delete quotation');
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/quotation/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for binary data
      });

      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `Quotation_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Download started');
    } catch (error) {
      console.error('Download failed', error);
      toast.error('Failed to download PDF');
    }
  };

const handleConvertToPI = async (quotationId) => {
  try {
    const res = await axios.post(
      `http://localhost:3000/api/quotation/${quotationId}/convert-to-pi`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Quotation converted to Proforma Invoice!');
    navigate('/employee-dashboard/pi'); // Redirect to PI dashboard
  } catch (error) {
    console.error('Conversion failed', error);
    if (error.response) {
      toast.error(`Failed: ${error.response?.data?.error}`);
    } else {
      toast.error('Failed to convert to Proforma Invoice');
    }
  }
};





  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quotation List</h2>
        <button
          onClick={() => navigate('/employee-dashboard/customer/create-quotation')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Quotation
        </button>
      </div>

      {loading ? (
        <p>Loading quotations...</p>
      ) : quotations.length === 0 ? (
        <p>No quotations found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotations.map((q) => (
            <div key={q._id} className="bg-white border rounded-lg shadow p-5 relative">
              <h3 className="text-lg font-bold mb-2">Quotation #{q.quotationNumber || q._id}</h3>
              <p><strong>Date:</strong> {new Date(q.quotationDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {q.status}</p>
              <p><strong>Customer:</strong> {q.billTo?.name || 'N/A'}</p>
              <p><strong>Grand Total:</strong> ₹{q.grandTotal?.toFixed(2) || '0.00'}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => navigate(`/employee-dashboard/quotation/edit/${q._id}`)}
                  className="flex-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleDownloadPdf(q._id)}
                  className="flex-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => handleConvertToPI(q._id)}
                  className="flex-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Convert to PI
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotationDashboard;
