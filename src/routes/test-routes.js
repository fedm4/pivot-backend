import Express from 'express';
import authMiddlewares from '../middlewares/auth-middlewares.js'; 

const router = Express.Router();

router.get('/test', authMiddlewares.verifyToken, (req, res) => {
    res.json({
        sucess:"YEAH",
        user: req.body._user
    })
});

export default router;