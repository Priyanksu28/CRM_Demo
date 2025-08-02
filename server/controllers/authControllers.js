const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



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

