import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { corsOptions } from './config/corsOptions.js'

import cloudinary from 'cloudinary'

import productRoute from './routes/ProductRoutes.js'
import categoryRoute from './routes/CategoryRoutes.js'
import userRoute from './routes/UserRoutes.js'
import loginRoute from './routes/Auth/LoginRoutes.js'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json({limit:'50mb'}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLODUINARY_API_SECRET,
});

app.use('/api/category', categoryRoute);
app.use('/api/product', productRoute);
app.use('/api/user', userRoute);
app.use('/api/auth', loginRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running. Connected to port: ${process.env.PORT}`);
    console.log(`Attempting to connect to database: ${process.env.MONGODB_URI}`)
    connectDB(process.env.MONGODB_URI);
})