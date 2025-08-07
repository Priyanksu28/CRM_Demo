const Quotation =  require('../models/Quotation.js');
const generateQuotationPdf = require('../utils/generateQuotationPdf');
const ProformaInvoice = require('../models/ProformaInvoice.js');

// Create a new quotation
exports.createQuotation = async (req, res) => {
  try {
    const quotation = new Quotation(req.body);
    const savedQuotation = await quotation.save();
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all quotations
exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().populate('customerId createdBy approvedBy convertedToPI');
    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single quotation by ID
exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('customerId createdBy approvedBy convertedToPI');
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.status(200).json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a quotation
exports.updateQuotation = async (req, res) => {
  try {
    const updatedQuotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedQuotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.status(200).json(updatedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a quotation
exports.deleteQuotation = async (req, res) => {
  try {
    const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!deletedQuotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.status(200).json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download quotation as PDF
exports.downloadQuotationPdf = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('customerId createdBy approvedBy convertedToPI');
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const pdfBuffer = await generateQuotationPdf(quotation);

    res.set({
  'Content-Type': 'application/pdf',
  'Content-Disposition': `attachment; filename=Quotation_${quotation._id}.pdf`,
  'Content-Length': pdfBuffer.length
});
res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};


// Conversion function: Converts a quotation to a PI by creating a new PI document
exports.convertQuotationToPI = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('customerId'); 

    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    if (quotation.status !== "Accepted") {
      return res.status(403).json({ error: "Quotation must be accepted/approved before converting to PO" });
    }

    if (quotation.convertedToPI) {
      return res.status(400).json({ error: "Quotation has already been converted to a PI" });
    }

    const currentDate = new Date(); // Use current date for PI
    const piData = {
      piNumber: `PI-${quotation.quotationNumber.split('-').pop() || Date.now()}`, // Auto-generate PI number
      piDate: currentDate,
      quotationId: quotation._id,
      customerId: quotation.customerId,
      supplierDetails: { ...quotation.supplierDetails },
      billTo: { ...quotation.billTo },
      shipTo: { ...quotation.shipTo },
      items: quotation.items.map(item => ({ ...item })), // Direct copy
      deliveryDate: quotation.deliveryDate,
      paymentTerms: quotation.paymentTerms,
      freightPaymentType: quotation.freightPaymentType,
  freightAmount: quotation.freightAmount,
  freightTaxRate: quotation.freightTaxRate,
  freightTaxAmount: quotation.freightTaxAmount,
  totalWithFreight: quotation.totalWithFreight,
      modeOfTransport: quotation.modeOfTransport,
      warranty: quotation.warranty,
      subtotal: quotation.subtotal,
      totalTax: quotation.totalTax,
      grandTotal: quotation.grandTotal,
      remarks: quotation.remarks,
      // status: "Open", // Initial PO status
      //createdBy: req.user.id, // Assumes auth middleware sets req.user
      termsAndConditions: [...quotation.termsAndConditions],
      validUntil: quotation.validUntil
    };

    const newPI = new ProformaInvoice(piData);
    await newPI.save();

    // Update quotation to mark as converted
    quotation.status = "Converted";
    quotation.convertedToPI = newPI._id;
    await quotation.save();

    res.status(201).json({ message: "Quotation successfully converted to PI", pi: newPI });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


