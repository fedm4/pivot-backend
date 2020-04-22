import DotEnv from 'dotenv';
import JWT from 'jsonwebtoken';

DotEnv.config();
const jwt_key = process.env.JWT_KEY;
console.log(jwt_key);

// Middlewares
const verifyToken = async (req, res, next) => {
    // Get Auth header
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader === 'undefined') res.sendStatus(403);
    
    // Validate Token
    const token = bearerHeader.split(' ')[1];
    try {
        const tokenData = await JWT.verify(token, jwt_key);
        req.body._user = tokenData.user;
        next();
    } catch (err) {
        console.log(err)
        res.sendStatus(403);
    }
};

export default {
    verifyToken
};