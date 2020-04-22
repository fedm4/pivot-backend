import bcrypt from 'bcrypt';
import DotEnv from 'dotenv';
import Express from 'express';
import JWT from 'jsonwebtoken';

import authHelpers from '../helpers/auth-helpers.js';
import User from '../models/User.js';

// Load ENV
DotEnv.config();

const router = Express.Router();
const jwt_key = process.env.JWT_KEY;
const jwt_refresh_key = process.env.JWT_REFRESH_KEY;


router.post('/register', async (req, res) => {
    try {
        const password = await authHelpers.hashPassword(req.body.password);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password
        });
        const savedUser = await user.save();
        res.json(savedUser);
    } catch(err) {
        res.json({error: `Error creating user: ${err}`});
    }
});

router.post(`/login`, async (req, res) => {
    try {
        const errMsg = "Incorrect user or password";
        if(!req.body.email) throw errMsg;
        const user = await User.findOne({email: req.body.email});
        if(!user) throw errMsg;
        if(!await bcrypt.compare(req.body.password, user.password)) throw errMsg; 

        const token = await JWT.sign({user}, jwt_key, { expiresIn: 30 });
        const refreshToken = JWT.sign({user}, jwt_refresh_key, { expiresIn: 7890000 })

        res.json({ token, refreshToken });
    } catch(err) {
        console.log(err);
        res.status(403).json({ err });
    }
});

router.post('/token', async (req,res) => {
    // if refresh token exists
    try {
        if(!req.body.refreshToken) res.sendStatus(401);
        const refreshToken = req.body.refreshToken;
        const data = await JWT.verify(refreshToken, jwt_refresh_key);
        if(!data) res.sendStatus(401);
        const token = await JWT.sign({user: data.user}, jwt_key, { expiresIn: 30 })
        res.json({
            token,
            refreshToken
        });
    }catch(err) {
        console.log(err);
        res.sendStatus(403);
    }
});

export default router;