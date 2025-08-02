const Quotation =  require('../models/Quotation.js');
const generateQuotationPdf = require('../utils/generateQuotationPdf');
const PurchaseOrder = require('../models/PurchaseOrder.js');

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
    const quotations = await Quotation.find().populate('customerId createdBy approvedBy convertedToPO');
    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single quotation by ID
exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('customerId createdBy approvedBy convertedToPO');
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
    const quotation = await Quotation.findById(req.params.id).populate('customerId createdBy approvedBy convertedToPO');
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const pdfBuffer = await generateQuotationPdf(quotation);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Quotation_${quotation._id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};


// Conversion function: Converts a quotation to a PO by creating a new PO document
exports.convertQuotationToPO = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('customerId'); 

    if (!quotation) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    if (quotation.status !== "Accepted") {
      return res.status(403).json({ error: "Quotation must be accepted/approved before converting to PO" });
    }

    if (quotation.convertedToPO) {
      return res.status(400).json({ error: "Quotation has already been converted to a PO" });
    }

    const currentDate = new Date(); // Use current date for PO
    const poData = {
      poNumber: `PO-${quotation.quotationNumber.split('-').pop() || Date.now()}`, // Auto-generate PO number
      poDate: currentDate,
      quotationId: quotation._id,
      customerId: quotation.customerId,
      supplierDetails: { ...quotation.supplierDetails },
      billTo: { ...quotation.billTo },
      shipTo: { ...quotation.shipTo },
      items: quotation.items.map(item => ({ ...item })), // Direct copy
      deliveryDate: quotation.deliveryDate,
      paymentTerms: quotation.paymentTerms,
      freightPaymentType: quotation.freightPaymentType,
      modeOfTransport: quotation.modeOfTransport,
      warranty: quotation.warranty,
      subtotal: quotation.subtotal,
      totalTax: quotation.totalTax,
      grandTotal: quotation.grandTotal,
      remarks: quotation.remarks,
      status: "Open", // Initial PO status
      //createdBy: req.user.id, // Assumes auth middleware sets req.user
      termsAndConditions: [...quotation.termsAndConditions],
      validUntil: quotation.validUntil
    };

    const newPO = new PurchaseOrder(poData);
    await newPO.save();

    // Update quotation to mark as converted
    quotation.status = "Converted";
    quotation.convertedToPO = newPO._id;
    await quotation.save();

    res.status(201).json({ message: "Quotation successfully converted to PO", po: newPO });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


