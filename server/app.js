import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chat.routes.js";
import adminRoute from "./routes/admin.routes.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { Message } from "./models/message.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthentication } from "./middlewares/isAuthenticated.js";
import { getSocketUserId } from "./library/helper.js";


dotenv.config({
    path: "./.env"
});

connectDB(process.env.MONGO_URI);  // connection to database
const port = process.env.PORT || 8000;
export const AdminSeckey = process.env.ADMIN_SECRET_KEY;
export const userSocketIDs = new Map(); // to store user socket ids

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
const server = createServer(app);
// socket.io server
const io = new Server(server, {
    cors: corsOptions,
});

// using the middleware because we'll be using req.body and multer
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// api's
app.use('/api/v1/user', userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);
app.get("/", (req, res) => {
    res.send("Hello Pratyaksha Sharma, This all... i've build for you.");
    console.log("Hello Pratyaksha Sharma, This all... i've build for you.");
});






// middleware to authenticate socket connection
io.use((socket, next) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthentication(err, socket, next)
    )
});

// socket.io connection
io.on("connection", (socket) => {
    socket.timeout(30000);
    const user = socket.user; // get user from socket auth
    
    console.log(`User connected: ${user.name} (${user._id})`);
    
    // const user = socket.handshake.auth.user; // get user from socket handshake auth
    userSocketIDs.set(user._id.toString(), socket.id); // store user socket id
    console.log(`Current connected users: ${userSocketIDs.size}`);

    // emit the user id to the client
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        console.log(`Received NEW_MESSAGE from ${user.name}:`, { chatId, members, message });
        
        // check if the chatId and members are provided
        if (!chatId || !members || !message) {
            console.log('Missing required fields:', { chatId, members, message });
            return;
        }

        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        }

        const userSocket = getSocketUserId(members); // get socket ids of the members
        console.log('User sockets found:', userSocket);
        console.log('Members to notify:', members);

        // emit the message to all members of the chat
        userSocket.forEach(socketId => {
            if (!socketId) {
                console.log('skip: socketId undefined for some member');
                return;
            }

            console.log(`emitting NEW_MESSAGE to socket ${socketId}`);
            
            io.to(socketId).emit(NEW_MESSAGE, {
                chatId,
                message: messageForRealTime,
            });
        });

        console.log(`Message broadcast to sockets: ${userSocket.join(', ')}`);

        // emit alert to the user that a new message has been sent (Notification)
        userSocket.forEach(socketId => {
            if (socketId) {
                io.to(socketId).emit(NEW_MESSAGE_ALERT, { chatId });
            }
        });

        try {
            await Message.create(messageForDB); // save the message to the database
            console.log('Message saved to database successfully');
        } catch (error) {
            console.error(`Error saving message to database: ${error.message}`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        userSocketIDs.delete(user._id.toString()); // remove user socket id on disconnect
        console.log(`Remaining connected users: ${userSocketIDs.size}`);
    })
});





















// error middleware
app.use(errorMiddleware);


server.listen(port, () => {
    console.log(`Server is listening on the port : http://localhost:${port}`);
})