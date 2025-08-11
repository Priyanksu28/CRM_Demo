const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


exports.signup = async (req, res) => {
    try {
        const {name, email, password, phone, role} = req.body;
        const hashedpassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email,
            password: hashedpassword,
            phone,
            role
        })
        console.log("Original:", password)
        console.log("Hashed:", hashedpassword)
        await newUser.save()
        res.status(201).json({message: `User registered successfully ${password}`})
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({message: 'Something went wrong'})
    }
}

exports.login = async(req, res) => {
    try {
        const {identifier, password} = req.body;
      const query = isNaN(identifier) ? { email: identifier } : { employeeId: Number(identifier) };
        if(!identifier || !password){
            return res.status(400).json({
                success:false,
                message:'Please fill all the details'
            });
        }
        
        const existUser = await User.findOne(query);
        if(!existUser){
            return res.status(401).json({
                success:false,
                message:`User is not exist in db`
            });
        };
        const isMatch = await bcrypt.compare(password, existUser.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:'Invalid credentials'
            });
        }

        const payload = {
            userId: existUser._id,
            name:existUser.name,
            email: existUser.email,
            phone: existUser.phone,
            role: existUser.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET,
            {expiresIn:'24h'}
        );

        const options = {
            expiresIn: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly:true,
        }

        res.cookie('token', token, options).status(200).json({
            success:true,
            message:'User logged in successfully',
            token,
            user: {
                id: existUser._id,
                name:existUser.name,
                email: existUser.email,
                phone: existUser.phone,
                role: existUser.role
            }
        });

    } catch (error) {
        res.status(501).json({
            message:'Network Error',
            error:console.log(error)
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' })
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '15m' });

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
        subject: "Reset Password",
        text: `http://localhost:5173/resetPassword/${token}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.json({ status: false, message: "Error sending email" });
        } else {
            return res.json({ status: true, message: "Password reset link sent to your email" });
        }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.resetPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;
        const hashpassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate({_id: id}, { password: hashpassword });
        return res.json({ status: true, message: "Password reset successfully" });
    } catch (error) {
        return res.json({ status: false, message: "Invalid or expired token" });
        
    }
}

