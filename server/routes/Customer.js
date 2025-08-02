const express = require('express');
const router = express.Router();

const {createCustomer,getAllCustomers,getCustomerById,updateCustomer,deleteCustomer} = require('../controllers/customerControllers');

const {isAuthenticated,isEmployee} = require('../middlewares/authMiddleware');

router.use(isAuthenticated,isEmployee);

router.get('/', getAllCustomers);
router.get('/:id',getCustomerById);


//Routes 
router.post('/', createCustomer);
router.put('/:id',updateCustomer);
router.delete('/:id',deleteCustomer);

module.exports = router;