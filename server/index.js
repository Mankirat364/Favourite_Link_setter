import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import userRoute from './Routes/userRoute.js';
import googleUserRoutes from './Routes/googleUserRoute.js';
import linkRoute from './Routes/linkRoute.js';
import './config/passport.js';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 15;  

dotenv.config();
const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://favourite-link-setter-frontend.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 14 * 24 * 60 * 60 
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRoute);
app.use('/auth', googleUserRoutes);
app.use('/links', linkRoute);

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); 
    });
