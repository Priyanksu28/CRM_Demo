const ProformaInvoice = require('../models/ProformaInvoice.js'); 
const generatePIPdf = require('../utils/generatePI.js');

// Fetch all Proforma Invoices
exports.fetchAllPI = async (req, res) => {
  try {
    const piList = await ProformaInvoice.find({})
      .populate('quotationId') 
      .populate('customerId');

    res.status(200).json({
      success: true,
      message: piList.length === 0 ? 'No proforma invoices found' : 'Proforma invoices fetched successfully',
      data: piList
    });
  } catch (error) { 
    res.status(500).json({
      success: false,
      message: 'Server Error while fetching PI',
      error: error.message 
    });
  }
};

// Generate PDF for a specific Proforma Invoice
exports.generatePIPDF = async (req, res) => {
  try {
    const pi = await ProformaInvoice.findById(req.params.id)
      .populate('quotationId')
      .populate('customerId');

    if (!pi) {
      return res.status(404).json({ message: 'Proforma Invoice not found' });
    }

    const pdfBuffer = await generatePIPdf(pi);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=PI_${pi.piNumber || pi._id}.pdf`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PI PDF:', error);
    res.status(500).json({ message: 'Failed to generate Proforma Invoice PDF' });
  }
};
