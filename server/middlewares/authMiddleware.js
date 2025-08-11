const jwt = require('jsonwebtoken');

// Middleware: Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
    // Try to find token in cookies, body, or Authorization header
    const authHeader = req.header("Authorization");
    const token =
        req.cookies?.token ||
        req.body?.token ||
        (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);

    console.log("Token received:", token ? "Present" : "Missing");
    console.log("Authorization header:", authHeader);

    // If no token found
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token missing'
        });
    }

    try {
        // Verify the token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verified successfully. User:", payload);
        req.user = payload; // Attach payload to request object
        next();
    } catch (err) {
        // Handle different JWT errors
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token verification failed'
        });
    }
};

// Middleware: Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied, admin only'
        });
    }
    next();
};

// Middleware: Check if user is employee
exports.isEmployee = (req, res, next) => {
    if (req.user.role !== 'employee') {
        return res.status(403).json({
            success: false,
            message: 'Access denied, employee only'
        });
    }
    next();
};
