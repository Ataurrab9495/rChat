import express from "express";
import { adminLogin, adminLogout, getAdminData, getAllChats, getAllMessages, getAllUsers, getDashboardStats } from "../controllers/admin.controller.js";
import { adminLoginValidator, validateHandler } from "../library/validators.js";
import { isAdminAuthenticated } from "../middlewares/isAuthenticated.js";

const app = express.Router();


app.post("/verify",adminLoginValidator(), validateHandler, adminLogin);

app.get("/logout",adminLogout);


// Admin Routes
app.use(isAdminAuthenticated);
app.get("/", getAdminData);
app.get("/users", getAllUsers);
app.get("/chats", getAllChats);
app.get("/messages",getAllMessages);

app.get("/stats", getDashboardStats);
export default app;