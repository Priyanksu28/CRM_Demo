const mongoose = require('mongoose')

const quotationSchema = new mongoose.Schema({
  quotationNumber: { type: String, required: true, unique: true },
  quotationDate: { type: Date, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  supplierDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactPerson: String,
    phone: String,
    email: String,
    gstin: { type: String, required: true }
  },
  billTo: {
    name: { type: String, required: true },
    contactPersonName: String,
    gstin: { type: String, required: true },
    address: { type: String, required: true },
    email: String,
    phone: String,
    state: String
  },
  shipTo: {
    name: { type: String, required: true },
    contactPersonName: String,
    address: { type: String, required: true },
    gstin: String,
     email: String,
    phone: String,
    state: String
  },
  items: [
    {
      srNo: { type: Number, required: true },
      description: { type: String, required: true },
      hsnSac: { type: String },
      itemCode: String,
      quantity: { type: Number, required: true },
      uom: { type: String, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true },
      taxRate: { type: Number, required: true },
      taxAmount: { type: Number, required: true },
      netAmount: { type: Number, required: true }
    }
  ],
  deliveryDate: { type: Date },
  paymentTerms: { type: String, default: "Advance Payment" },
  freightPaymentType: { type: String, enum: ["To Pay", "Paid", "Free"], default: "To Pay" },
  freightAmount: { type: Number, default: 0 },
  freightTaxRate: { type: Number, default: 0 },
  freightTaxAmount: { type: Number, default: 0 },
  totalWithFreight: { type: Number, default: 0 },
  modeOfTransport: { type: String, enum: ["By Road", "By Rail", "By Air"], default: "By Road" },
  warranty: { type: String, default: "N/A" },
  subtotal: { type: Number, required: true },
  totalTax: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  // totalInWords: { type: String, required: true },
  remarks: String,
  status: {
    type: String,
    enum: ["Draft", "Sent", "Accepted", "Rejected", "Converted"],
    default: "Draft"
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedDate: { type: Date },
  validUntil: { type: Date, required: true },
  termsAndConditions: [{ type: String }],
  convertedToPI: { type: mongoose.Schema.Types.ObjectId, ref: 'ProformaInvoice' }
}, { timestamps: true });

module.exports = mongoose.model("Quotation",quotationSchema);
