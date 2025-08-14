const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const fs = require("fs");
const path = require("path");


exports.createEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, password, phone } = req.body;
    if (!employeeId || !name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or employeeId",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      employeeId,
      name,
      email,
      password: hashPassword,
      phone,
      role: "employee",
    });

    const templatePath = path.join(__dirname, "../templates/email.html");
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    htmlContent = htmlContent
      .replace(/{{name}}/g, name)
      .replace(/{{employeeId}}/g, employeeId)
      .replace(/{{email}}/g, email)
      .replace(/{{password}}/g, password)
      .replace(/{{year}}/g, new Date().getFullYear());

    // Send credentials email
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "t06983606@gmail.com",
        pass: "ejgg bool cawb hfmm",
      },
    });

    let mailOptions = {
      from: "t06983606@gmail.com",
      to: email,
      subject: "Your Employee Account Details",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "Employee created successfully and credentials sent to email",
      newUser,
    });

  } catch (error) {
    console.log("Error in createEmployee:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    if (!employees || employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employees found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide employee id",
      });
    }
    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching employee by id",
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, name, email, phone } = req.body;
    if (!employeeId || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      id,
      { employeeId, name, email, phone },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "Error in updating employee",
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide emloyee id",
      });
    }
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    return res.status(201).json({
      success: true,
      message: "Employee deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in deleting employee",
    });
  }
};
