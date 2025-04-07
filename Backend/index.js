import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './DB/connectDB.js';
import routes from './Routes/routes.js';

const app = express();
dotenv.config();
app.use(express.json())

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

// Routes
app.use('/', routes);

// MongoDB connection
connectDB();

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
