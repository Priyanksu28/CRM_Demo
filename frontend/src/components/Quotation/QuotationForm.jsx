import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const numberToWords = (num) => {
  // Simple number to word placeholder
  return `Rupees ${num.toFixed(2)} only`;
};

const QuotationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;
  const token = useSelector((state) => state.auth.token) || JSON.parse(localStorage.getItem('token'));
  const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user'));

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quotationNumber: '',
      quotationDate: new Date().toISOString().split('T')[0],
      validUntil: '',
      status: 'Draft',
      customerId: customer?._id || '',
      supplierDetails: {
        name: 'A Class',
        address: 'Noida sector 51',
        contactPerson: '',
        phone: '',
        email: '',
        gstin: '',
      },
      billTo: {
        name: customer?.orgName || '',
        gstin: customer?.gstin || '',
        address: customer?.address
          ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state} - ${customer.address.zip}, ${customer.address.country}`
          : '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        state: customer?.address?.state || '',
      },
      shipTo: { name: '', address: '', gstin: '', state: '' },
      items: [
        {
          srNo: 1,
          description: '',
          hsnSac: '',
          quantity: 0,
          uom: '',
          rate: 0,
          amount: 0,
          taxRate: 0,
          taxAmount: 0,
          netAmount: 0,
        },
      ],
      deliveryDate: '',
      paymentTerms: 'Advance Payment',
      freightPaymentType: 'To Pay',
      freightAmount: 0,
      freightTaxRate: 0,
      freightTaxAmount: 0,
      totalWithFreight: 0,
      modeOfTransport: 'By Road',
      warranty: 'N/A',
      subtotal: 0,
      totalTax: 0,
      grandTotal: 0,
      remarks: '',
      termsAndConditions: [''],
    },
  });

  const items = watch('items') || [];
  const termsAndConditions = watch('termsAndConditions') || [];

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        if (id) {
          const res = await axios.get(`http://localhost:3000/api/quotation/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          reset(res.data);
        }
      } catch (err) {
        toast.error('Failed to fetch quotation');
        console.error(err);
      }
    };
    if (id) fetchQuotation();
  }, [id, token, reset]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate' || field === 'taxRate') {
      const it = newItems[index];
      it.amount = (it.quantity || 0) * (it.rate || 0);
      it.taxAmount = it.amount * ((it.taxRate || 0) / 100);
      it.netAmount = it.amount + it.taxAmount;
    }

    setValue('items', newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (itemList) => {
    const subtotal = itemList.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalTax = itemList.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    const grandTotal = subtotal + totalTax;

    const freightAmount = watch('freightPaymentType') === 'Paid' ? Number(watch('freightAmount') || 0) : 0;
    const freightTaxRate = watch('freightPaymentType') === 'Paid' ? Number(watch('freightTaxRate') || 0) : 0;
    const freightTaxAmount = (freightAmount * freightTaxRate) / 100;
    const totalWithFreight = grandTotal + freightAmount + freightTaxAmount;

    setValue('subtotal', subtotal);
    setValue('totalTax', totalTax);
    setValue('grandTotal', grandTotal);
    setValue('freightTaxAmount', freightTaxAmount);
    setValue('totalWithFreight', totalWithFreight);
    setValue('totalInWords', numberToWords(totalWithFreight));
  };

  useEffect(() => {
    calculateTotals(items);
  }, [watch('freightAmount'), watch('freightTaxRate')]);

  const addItem = () => {
    setValue('items', [
      ...items,
      {
        srNo: items.length + 1,
        description: '',
        hsnSac: '',
        quantity: 0,
        uom: '',
        rate: 0,
        amount: 0,
        taxRate: 0,
        taxAmount: 0,
        netAmount: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setValue('items', newItems);
    calculateTotals(newItems);
  };

  const addTerm = () => {
    setValue('termsAndConditions', [...termsAndConditions, '']);
  };

  const removeTerm = (index) => {
    setValue(
      'termsAndConditions',
      termsAndConditions.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data) => {
    if (!user?.id) {
      toast.error('Authentication error. Please log in.');
      return;
    }

    try {
      const payload = { ...data, createdBy: user.id };

      if (id) {
        await axios.put(`http://localhost:3000/api/quotation/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Quotation updated successfully!');
      } else {
        const res = await axios.post(`http://localhost:3000/api/quotation`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Quotation created with ID: ' + res.data._id);
      }

      navigate('/employee-dashboard/quotation');
    } catch (err) {
      toast.error('Error saving quotation');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">{id ? 'Edit Quotation' : 'Create Quotation'}</h2>

      {/* Header Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input {...register('quotationNumber', { required: 'Quotation number is required' })} placeholder="Quotation Number" className="p-2 border rounded w-full" disabled={!!id} />
        <input type="date" {...register('quotationDate')} className="p-2 border rounded w-full" />
        <input type="date" {...register('validUntil')} placeholder="Valid Until" className="p-2 border rounded w-full" />
        <select {...register('status')} className="p-2 border rounded w-full">
          <option>Draft</option>
          <option>Sent</option>
          <option>Accepted</option>
          <option>Rejected</option>
          <option>Converted</option>
        </select>
      </div>

      {/* Supplier Details */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Supplier Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['name', 'address', 'contactPerson', 'phone', 'email', 'gstin'].map((field) => (
            <input key={field} placeholder={field} {...register(`supplierDetails.${field}`)} className="p-2 border rounded w-full" />
          ))}
        </div>
      </section>

      {/* Bill To and Ship To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">Bill To</h3>
          {['name', 'gstin', 'address', 'email', 'phone', 'state'].map((field) => (
            <input key={field} placeholder={field} {...register(`billTo.${field}`)} className="mb-2 p-2 border rounded w-full" />
          ))}
        </section>
        <section>
          <h3 className="text-lg font-semibold mb-2">Ship To</h3>
          <div className="mb-2">
            <label className="inline-flex items-center">
              <input type="checkbox" onChange={(e) => e.target.checked && setValue('shipTo', watch('billTo'))} className="mr-2" />
              Ship To same as Bill To
            </label>
          </div>
          {['name', 'address', 'gstin', 'state'].map((field) => (
            <input key={field} placeholder={field} {...register(`shipTo.${field}`)} className="mb-2 p-2 border rounded w-full" />
          ))}
        </section>
      </div>

      {/* Items Table */}
      <h3 className="text-lg font-semibold mb-2">Items</h3>
      <table className="w-full border mb-4 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th>Sr.</th>
            <th>Description</th>
            <th>HSN/SAC</th>
            <th>Qty</th>
            <th>UOM</th>
            <th>Rate</th>
            <th>Tax%</th>
            <th>Net Amt</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="text-center">
              <td>{index + 1}</td>
              <td><input className="border w-full p-1" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} /></td>
              <td><input className="border w-full p-1" value={item.hsnSac} onChange={(e) => handleItemChange(index, 'hsnSac', e.target.value)} /></td>
              <td><input type="number" className="border w-full p-1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value) || 0)} /></td>
              <td>
                <select className="border w-full p-1" value={item.uom} onChange={(e) => handleItemChange(index, 'uom', e.target.value)}>
                  <option value="">Select</option>
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="pair">pair</option>
                  <option value="litre">litre</option>
                  <option value="box">box</option>
                </select>
              </td>
              <td><input type="number" className="border w-full p-1" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value) || 0)} /></td>
              <td><input type="number" className="border w-full p-1" value={item.taxRate} onChange={(e) => handleItemChange(index, 'taxRate', Number(e.target.value) || 0)} /></td>
              <td className="text-right pr-2">₹{item.netAmount?.toFixed(2)}</td>
              <td><button type="button" className="text-red-500 text-xs" onClick={() => removeItem(index)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onClick={addItem}>Add Item</button>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium mb-6">
        <div>Subtotal: ₹{watch('subtotal')?.toFixed(2)}</div>
        <div>Total Tax: ₹{watch('totalTax')?.toFixed(2)}</div>
        <div>Grand Total: ₹{watch('grandTotal')?.toFixed(2)}</div>
        <div>Freight Tax: ₹{watch('freightTaxAmount')?.toFixed(2)}</div>
        <div className="text-lg font-semibold">Total With Freight: ₹{watch('totalWithFreight')?.toFixed(2)}</div>
      </div>

      <div className="mb-6">
        <label className="font-medium">Freight  Name</label>
        <select {...register('freightPaymentType')} className="p-2 border rounded block w-full mb-2">
          <option value="To Pay">DTDC</option>
          <option value="Paid">Paid</option>
          <option value="Free">Free</option>
        </select>
        </div>

      {/* Freight */}
      <div className="mb-6">
        <label className="font-medium">Freight Payment Type</label>
        <select {...register('freightPaymentType')} className="p-2 border rounded block w-full mb-2">
          <option value="To Pay">To Pay</option>
          <option value="Paid">Paid</option>
          <option value="Free">Free</option>
        </select>

        {watch('freightPaymentType') === 'Paid' && (
          <>
            <input type="number" {...register('freightAmount')} placeholder="Freight Amount" className="p-2 border rounded block w-full mb-2" />
            <input type="number" {...register('freightTaxRate')} placeholder="Freight Tax Rate (%)" className="p-2 border rounded block w-full mb-2" />
          </>
        )}
      </div>

      {/* Other Fields */}
      <div className='mb-6'>
         <label className="font-medium">Mode of Transport</label>
<select
  {...register('modeOfTransport')}
  className="mb-4 p-2 border rounded block w-full"
>
  <option value="">Select Mode of Transport</option>
  <option value="By Road">By Road</option>
  <option value="By Air">By Air</option>
  <option value="By Rail">By Rail</option>
</select>

      </div>

      {/* Terms */}
      <h4 className="text-sm font-medium mb-2">Terms & Conditions</h4>
      {termsAndConditions.map((term, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <input className="p-2 border rounded flex-grow" value={term} onChange={(e) => {
            const updated = [...termsAndConditions];
            updated[index] = e.target.value;
            setValue('termsAndConditions', updated);
          }} />
          <button type="button" className="text-red-500 text-sm" onClick={() => removeTerm(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="mb-6 bg-blue-600 text-white px-3 py-1 rounded" onClick={addTerm}>Add Term</button>

      {/* Submit */}
      <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold">
        {id ? 'Update Quotation' : 'Save Quotation'}
      </button>
    </form>
  );
};

export default QuotationForm;
