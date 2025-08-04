const PDFDocument = require('pdfkit');

function generateQuotationPdf(quotation) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Title
      doc.fontSize(20).text('Quotation', { align: 'center' });
      doc.moveDown();

      // Basic info
      doc.fontSize(12);
      doc.text(`Quotation Number: ${quotation.quotationNumber}`);
      doc.text(`Quotation Date: ${new Date(quotation.quotationDate).toLocaleDateString()}`);
      doc.text(`Valid Until: ${quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'N/A'}`);
      doc.moveDown();

      // Bill To info
      doc.text('Bill To:', { underline: true });
      doc.text(`Name: ${quotation.billTo.name}`);
      doc.text(`GSTIN: ${quotation.billTo.gstin}`);
      doc.text(`Address: ${quotation.billTo.address}`);
      doc.text(`Email: ${quotation.billTo.email}`);
      doc.text(`Phone: ${quotation.billTo.phone}`);
      doc.text(`State: ${quotation.billTo.state}`);
      doc.moveDown();

      // Ship To info
      doc.text('Ship To:', { underline: true });
      doc.text(`Name: ${quotation.shipTo.name}`);
      doc.text(`GSTIN: ${quotation.shipTo.gstin}`);
      doc.text(`Address: ${quotation.shipTo.address}`);
      doc.text(`State: ${quotation.shipTo.state}`);
      doc.moveDown();

      // Items table header
      doc.text('Items:', { underline: true });
      doc.moveDown(0.5);

      // Table columns
      const tableTop = doc.y;
      const itemX = 50;
      const descX = 80;
      const qtyX = 280;
      const rateX = 330;
      const taxX = 380;
      const netX = 430;

      doc.font('Helvetica-Bold');
      doc.text('Sr', itemX, tableTop);
      doc.text('Description', descX, tableTop);
      doc.text('Qty', qtyX, tableTop);
      doc.text('Rate', rateX, tableTop);
      doc.text('Tax %', taxX, tableTop);
      doc.text('Net Amount', netX, tableTop);
      doc.moveDown();
      doc.font('Helvetica');

      // Items
      quotation.items.forEach((item, i) => {
        const y = tableTop + 25 + i * 20;
        doc.text(item.srNo.toString(), itemX, y);
        doc.text(item.description, descX, y, { width: 180 });
        doc.text(item.quantity.toString(), qtyX, y);
        doc.text(item.rate.toFixed(2), rateX, y);
        doc.text(item.taxRate.toFixed(2), taxX, y);
        doc.text(item.netAmount.toFixed(2), netX, y);
      });

      doc.moveDown(2);

      // Totals
      doc.text(`Subtotal: ₹${quotation.subtotal.toFixed(2)}`, { align: 'right' });
      doc.text(`Total Tax: ₹${quotation.totalTax.toFixed(2)}`, { align: 'right' });
      doc.text(`Grand Total: ₹${quotation.grandTotal.toFixed(2)}`, { align: 'right' });

      doc.moveDown();

      // Remarks & Terms
      if (quotation.remarks) {
        doc.text('Remarks:', { underline: true });
        doc.text(quotation.remarks);
        doc.moveDown();
      }

      if (quotation.termsAndConditions && quotation.termsAndConditions.length) {
        doc.text('Terms and Conditions:', { underline: true });
        quotation.termsAndConditions.forEach((term, idx) => {
          doc.text(`${idx + 1}. ${term}`);
        });
      }

      doc.end(); 
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateQuotationPdf;
