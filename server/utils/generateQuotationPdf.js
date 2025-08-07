const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');


function fillTemplate(template, data) {
  return Object.entries(data).reduce((str, [key, value]) => {
    return str.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, template);
}

function renderItems(items) {
  return items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.description}</td> 
       <td>${item.hsnSac}</td>
      <td>${item.quantity}</td>
      <td>${item.uom}</td>
      <td>${item.rate}</td>
      <td>${item.amount}</td>
      <td>${item.taxRate}</td>
      <td>${item.taxAmount.toFixed(2)}</td>
      <td>${item.netAmount.toFixed(2)}</td>
    </tr>
  `).join('');
}

function numberToWords(num) {
  return `INR ${Number(num).toFixed(2)} Only`;
}

async function generateQuotationPdf(quotation) {
  const templatePath = path.join(__dirname, '../templates/quotation.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const htmlContent = fillTemplate(template, {
    quotationNumber: quotation.quotationNumber,
    quotationDate: new Date(quotation.quotationDate).toLocaleDateString(),
    dueDate: new Date(quotation.validUntil).toLocaleDateString(),
    
    billToName: quotation.billTo.name,
    billToContactPersonName: quotation.billTo.contactPersonName || 'N/A',
    billToAddress: quotation.billTo.address,
    billToGstin: quotation.billTo.gstin,
    billToMobile: quotation.billTo.phone || '',
    billToEmail: quotation.billTo.email || '',

    shipToName: quotation.shipTo?.name || '',
    shipToContactPersonName: quotation.shipTo?.contactPersonName || 'N/A',
    shipToAddress: quotation.shipTo?.address || '',
    shipToGstin: quotation.shipTo?.gstin || '',
    shipToMobile: quotation.shipTo?.phone || '',
    shipToState: quotation.shipTo?.state || '',

    items: renderItems(quotation.items),

    subtotal: quotation.subtotal.toFixed(2),
    totalTax: quotation.totalTax.toFixed(2),
    grandTotal: quotation.grandTotal.toFixed(2),
    freightAmount: quotation.freightAmount?.toFixed(2) || '0.00',
    freightTaxRate: quotation.freightTaxRate?.toFixed(2) || '0.00',
    freightTaxAmount: quotation.freightTaxAmount?.toFixed(2) || '0.00',
    totalWithFreight: quotation.totalWithFreight?.toFixed(2) || quotation.grandTotal.toFixed(2),
    grandTotalInWords: numberToWords(quotation.totalWithFreight || quotation.grandTotal),

    modeOfTransport: quotation.modeOfTransport || '',
    warranty: quotation.warranty || '',
    remarks: quotation.remarks || '',
    freightPaymentType: quotation.freightPaymentType || '',
    email: quotation.supplierDetails?.email || '',
    mobile: quotation.supplierDetails?.phone || '',

    terms: quotation.termsAndConditions.map((term, i) => `<li>${i + 1}) ${term}</li>`).join('')
  });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '40px',
      bottom: '40px',
      left: '30px',
      right: '30px'
    }
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = generateQuotationPdf;
