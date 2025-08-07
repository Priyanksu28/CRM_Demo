const express = require('express');
const router = express.Router();

const { fetchAllPI, generatePIPDF } = require('../controllers/piControllers');
const { isAuthenticated, isEmployee } = require('../middlewares/authMiddleware');

// Apply auth middleware to all PI routes
router.use(isAuthenticated, isEmployee);

// Route to generate a PDF for a specific PI
router.get('/:id/pdf', generatePIPDF);

// Route to fetch all PIs
router.get('/', fetchAllPI);

module.exports = router;
