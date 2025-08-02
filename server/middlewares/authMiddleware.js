const jwt = require('jsonwebtoken');

exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success: false,
            message: 'token missing'
        });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
     if(!payload){
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
     }

     req.user = payload;
     next();       
}

exports.isAdmin = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({
            success: false,
            message: 'Access denied, admin only'
        });
    }
    next();
}

exports.isEmployee =(req, res, next) => {
    if(req.user.role !== 'employee'){
        return res.status(403).json({
            success: false,
            message: 'Access denied, employee only'
        });
    }
    next();
}