const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

function fillTemplate(template, data) {
  return Object.entries(data).reduce((str, [key, value]) => {
    return str.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, template);
}

function renderPIItems(items) {
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

async function generatePIPdf(pi) {
  const templatePath = path.join(__dirname, '../templates/pi.html'); 
  const template = fs.readFileSync(templatePath, 'utf-8');

  const htmlContent = fillTemplate(template, {
    piNumber: pi.piNumber,
    piDate: new Date(pi.piDate).toLocaleDateString(),
    dueDate: new Date(pi.validUntil).toLocaleDateString(),

    billToName: pi.billTo.name,
    billToContactPerson:pi.billTo.contactPerson,
    billToAddress: pi.billTo.address,
    billToGstin: pi.billTo.gstin,
    billToMobile: pi.billTo.phone || '',
    billToEmail: pi.billTo.email || '',

    shipToName: pi.shipTo?.name || '',
    shipToContactPerson:pi.shipTo?.contactPerson,
    shipToAddress: pi.shipTo?.address || '',
    shipToGstin: pi.shipTo?.gstin || '',
    shipToMobile: pi.shipTo?.phone || '',
    shipToState: pi.shipTo?.state || '',

    items: renderPIItems(pi.items),

    subtotal: pi.subtotal.toFixed(2),
    totalTax: pi.totalTax.toFixed(2),
    grandTotal: pi.grandTotal.toFixed(2),
    freightAmount: pi.freightAmount?.toFixed(2) || '0.00',
    freightTaxRate: pi.freightTaxRate?.toFixed(2) || '0.00',
    freightTaxAmount: pi.freightTaxAmount?.toFixed(2) || '0.00',
    totalWithFreight: pi.totalWithFreight?.toFixed(2) || pi.grandTotal.toFixed(2),
    grandTotalInWords: numberToWords(pi.totalWithFreight || pi.grandTotal),

    modeOfTransport: pi.modeOfTransport || '',
    warranty: pi.warranty || '',
    remarks: pi.remarks || '',
    freightPaymentType: pi.freightPaymentType || '',
    email: pi.supplierDetails?.email || '',
    mobile: pi.supplierDetails?.phone || '',

    terms: (pi.termsAndConditions || []).map((term, i) => `<li> ${term}</li>`).join('')
  });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' }
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = generatePIPdf;
