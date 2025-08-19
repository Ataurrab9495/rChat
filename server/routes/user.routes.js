import express from "express";
import {
    acceptFriendRequest,
    getMyFriends,
    getMyProfile,
    getNotifications,
    login,
    logoutUser,
    searchUser,
    sendFriendRequest
} from "../controllers/user.controller.js";
import { newUser } from "../controllers/user.controller.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
    acceptFriendRequestValidator,
    FriendRequestValidator,
    loginValidator,
    newUserValidator,
    validateHandler
} from "../library/validators.js";

const app = express.Router();

// routes before login
// using express-validator for validation
app.post("/new", singleAvatar, newUserValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

// routes after login
app.get("/profile", isAuthenticated, getMyProfile);
app.get("/logout", isAuthenticated, logoutUser);
app.get("/search-user", isAuthenticated, searchUser);

app.put("/send-request", isAuthenticated, FriendRequestValidator(), validateHandler, sendFriendRequest);

app.put("/accept-request", isAuthenticated, acceptFriendRequestValidator(), validateHandler, acceptFriendRequest);

app.get("/get-notifications", isAuthenticated, getNotifications);

app.get("/get-my-friends", isAuthenticated, getMyFriends);

export default app;