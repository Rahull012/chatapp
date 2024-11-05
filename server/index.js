import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { createServer } from 'http'; // Import to create HTTP server
import setupSocket from './socket.js'; // Import your Socket.IO setup function

import authRoutes from './routes/AuthRoutes.js';
import contactsRoutes from './routes/ContactsRoutes.js';
import messagesRoutes from './routes/MessagesRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT; // Add default port if PORT is undefined
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages",messagesRoutes)
// Create an HTTP server
const server = createServer(app);

// Initialize Socket.IO with the HTTP server
setupSocket(server);

// Start the server and listen on the specified port
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Connect to the database
mongoose.connect(databaseURL)
    .then(() => {
        console.log("DB Connection Successful");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
