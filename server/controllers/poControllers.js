const PurchaseOrder = require( '../models/PurchaseOrder.js'); 
const PDFDocument = require('pdfkit');


exports.fetchAllPo = async (req, res) => {
  try {
    const po = await PurchaseOrder.find({})
      .populate('quotationId') // Populate related fields (optional, add more as needed)
      .populate('customerId');

    res.status(200).json({
      success: true,
      message: po.length === 0 ? 'No purchase orders found' : 'PO fetched successfully',
      data: po // Always return the data (empty array if none)
    });
  } catch (error) {
    console.error('Error fetching POs:', error); // Log for debugging
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message // Safer than full error object
    });
  }
};


exports.generatePOPDF = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id);
    if (!po) {
      return res.status(404).json({ error: "Purchase Order not found" });
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=PO_${po.poNumber}.pdf`);

    // Create PDF document
    const doc = new PDFDocument();
    doc.pipe(res); // Stream directly to response for download

    // PDF Content (customize as needed)
    doc.fontSize(18).font('Helvetica-Bold').text('Purchase Order', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`PO Number: ${po.poNumber}`);
    doc.text(`Date: ${po.poDate.toLocaleDateString()}`);
    doc.moveDown();

    // Supplier Details
    doc.fontSize(14).font('Helvetica-Bold').text('Supplier Details:');
    doc.fontSize(12).text(`Name: ${po.supplierDetails.name}`);
    doc.text(`Address: ${po.supplierDetails.address}`);
    doc.text(`GSTIN: ${po.supplierDetails.gstin}`);
    doc.moveDown();

    // Items Table (simple layout)
    doc.fontSize(14).font('Helvetica-Bold').text('Items:');
    const tableTop = doc.y + 10;
    doc.text('Sr. No.', 50, tableTop);
    doc.text('Description', 100, tableTop);
    doc.text('Qty', 300, tableTop);
    doc.text('Rate', 350, tableTop);
    doc.text('Net Amount', 400, tableTop);

    let rowY = tableTop + 20;
    po.items.forEach(item => {
      doc.text(item.srNo.toString(), 50, rowY);
      doc.text(item.description, 100, rowY, { width: 180 });
      doc.text(item.quantity.toString(), 300, rowY);
      doc.text(item.rate.toFixed(2), 350, rowY);
      doc.text(item.netAmount.toFixed(2), 400, rowY);
      rowY += 20;
    });
    doc.moveDown();

    // Totals
    doc.fontSize(12).font('Helvetica-Bold').text(`Grand Total: ${po.grandTotal.toFixed(2)}`);
    doc.text(`Total in Words: ${po.totalInWords}`);
    doc.moveDown();

    // Add other sections (e.g., Bill To, Terms) similarly

    doc.end(); // Finalize and send PDF
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
