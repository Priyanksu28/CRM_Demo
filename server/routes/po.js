const express = require('express');
const router = express.Router();

const{fetchAllPo,generatePOPDF} = require('../controllers/poControllers');
const {isAuthenticated,isEmployee} = require('../middlewares/authMiddleware');

router.use(isAuthenticated,isEmployee);

router.get('/:id/pdf',generatePOPDF);
router.get('/',fetchAllPo);

module.exports = router;