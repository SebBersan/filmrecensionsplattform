const jwt = require('jsonwebtoken');

const verifyRole = (roles) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).send('A token is required for authentication');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (!roles.includes(req.user.role)) {
                return res.status(403).send('Access denied');
            }
        } catch (err) {
            return res.status(401).send('Invalid Token');
        }

        return next();
    };
};

module.exports = {
    isAdmin: verifyRole(['admin']),
    isUser: verifyRole(['user', 'admin']),
};