const Customer = require('../models/Customer');
const mongoose = require('mongoose');

exports.createCustomer = async (req, res) => {
    try {
        const {
            orgName,
            name,
            email,
            phone,
            address,
            gstin,
            createdBy
        } = req.body;

        if (!name || !createdBy) {
            return res.status(400).json({
                success: false,
                message: !name ? 'Name is required' : 'Created by is required',
            });
        }
        // validate 
        const existingCustomer = await Customer.findOne({email});
        if(existingCustomer){
            return res.status(400).json({
                success: false,
                message: 'Customer already exists in DATABASE',
            });
        }
        // Create customer
        const newCustomer = await Customer.create({
            orgName,
            name,
            email,
            phone,
            address,
            gstin,
            createdBy
        });

        return res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            customer: newCustomer,
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'Error creating customer',
            error:error.message
        });
    }
}

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({}).populate('createdBy', 'name  email').sort({ createdAt: -1 });
        if(customers.length === 0){
            return res.status(404).json({
                success: false,
                message: 'No customers found',
            });
        } 
        res.status(200).json({
            success: true,
            message: 'Customers fetched successfully',
            customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching customers',
            error: error.message
        });
    }
}


exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer ID format',
            });
        }

        const existingCustomer = await Customer.findById(id).populate('createdBy', 'name email');

        if (!existingCustomer) {
            return res.status(404).json({
                success: false,
                message: 'Customer does not exist',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Customer fetched successfully',
            customer: existingCustomer,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching customer by ID',
            error: error.message
        });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;

         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer ID format',
            });
        }

        const {
            orgName,
            name,
            email,
            phone,
            address,
            customerType,
            gstin
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required',
            });
        }

        const existingCustomer = await Customer.findById(id);
        if (!existingCustomer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            {
                orgName,
                name,
                email,
                phone,
                address,
                gstin
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Customer updated successfully',
            customer: updatedCustomer
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating customer',
            error: error.message
        });
    }
};


exports.deleteCustomer = async (req, res) => {
    try {
        const {id} = req.params;
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer ID format',
            });
        }
        const existingCustomer = await Customer.findById(id);
        if(!existingCustomer){
            return res.status(404).json({
                success:false,
                message:'Customer not found'
            })
        }
        await Customer.findByIdAndDelete(id);
        return res.status(200).json({
            success:true,
            message:'Customer deleted successfully'
        })
            
    } catch (error) {
        return res.status(500).json({
            success:true,
            message:'Error deleting customer'
        })
    }
}