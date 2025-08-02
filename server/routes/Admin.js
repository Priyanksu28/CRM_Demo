const express = require('express');
const router = express.Router();

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/adminControllers');

const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(isAuthenticated, isAdmin);

// Routes
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
