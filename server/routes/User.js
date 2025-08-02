const express = require('express');
const router = express.Router();

const{login,signup} = require('../controllers/authControllers');
const {isAuthenticated,isAdmin, isEmployee} = require('../middlewares/authMiddleware');

router.get('/admin', isAuthenticated , isAdmin, (req,res) => {
   return res.status(201).json({
     success:true,
     message:"Welcome to admin dashboard"
   })
})

router.get('/employee', isAuthenticated , isEmployee, (req,res) => {
   return res.status(201).json({
     success:true,
     message:"Welcome to Employee dashboard"
   })
})

//router.post('/signup', signup);
router.post('/login', login);

module.exports = router;