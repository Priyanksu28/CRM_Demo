const express = require('express');
const router = express.Router();

const{createQuotation,updateQuotation,getAllQuotations,getQuotationById,deleteQuotation,downloadQuotationPdf,convertQuotationToPO} = require('../controllers/quotationControllers');
const {isAuthenticated,isEmployee} = require('../middlewares/authMiddleware');

router.use(isAuthenticated,isEmployee);

router.post('/', createQuotation);
router.get('/', getAllQuotations);
router.get('/:id/download',downloadQuotationPdf);
router.get('/:id', getQuotationById);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);
router.post('/:id/convert-to-po',convertQuotationToPO);

module.exports = router;