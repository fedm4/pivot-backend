import Express from 'express';
import Mongoose from 'mongoose';
import DotEnv from 'dotenv';

import AuthRoutes from './src/routes/auth-routes.js';
import TestRoutes from './src/routes/test-routes.js';

// Load Env
DotEnv.config();

Mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, () => {
    console.log(`Connected to DB`);
})

const app  = Express();
const port = 9001;

app.use(Express.json());
app.use('/auth', AuthRoutes);
app.use(TestRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`));