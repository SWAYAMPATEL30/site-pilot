import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token || req.query.token;
        if (!token) return res.status(401).json({ success: false, error: 'Authentication required' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate('tenant');
        if (!user || user.status === 'suspended') return res.status(401).json({ success: false, error: 'Invalid or expired token' });

        req.user = user;
        req.tenantId = user.tenant._id || user.tenant;
        next();
    } catch (err) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
