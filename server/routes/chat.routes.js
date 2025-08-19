import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
    deleteChat,
    getMessageDetails,
    leaveGroup,
    newGroupChat,
    removeMembers,
    renameGroup
} from "../controllers/chat.controller.js";
import { getMyChats } from "../controllers/chat.controller.js";
import { getMyGroups } from "../controllers/chat.controller.js";
import { addMembers } from "../controllers/chat.controller.js";
import { sendAttachments } from "../controllers/chat.controller.js";
import { getChatDetails } from "../controllers/chat.controller.js";
import { attachmentsUsingMulter } from "../middlewares/multer.js";
import {
    addMembersValidator,
    getChatValidator,
    leaveGroupValidator,
    newGroupValidator,
    removeMembersValidator,
    renameValidator,
    sendAttachmentsValidator,
    validateHandler
} from "../library/validators.js";

const app = express.Router();

app.post("/new", isAuthenticated, newGroupValidator(), validateHandler, newGroupChat);  // using express-validator for validation\

app.get("/my-chats", isAuthenticated, getMyChats);

app.get("/my-chats/groups", isAuthenticated, getMyGroups);

app.put("/add-members", isAuthenticated, addMembersValidator(), validateHandler, addMembers);

app.put("/remove-members", isAuthenticated, removeMembersValidator(), validateHandler, removeMembers);

app.delete("/leave/:id", isAuthenticated, leaveGroupValidator(), validateHandler, leaveGroup);

// sending attachments
app.post("/message", isAuthenticated, attachmentsUsingMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);

// getting message details
app.get("/message/:id", isAuthenticated, getChatValidator(), validateHandler, getMessageDetails);

//using chaining cuz we have same request with three different http methods
app.route("/:id")
    .get(isAuthenticated, getChatValidator(), validateHandler, getChatDetails)
    .put(isAuthenticated, renameValidator(), validateHandler, renameGroup)
    .delete(isAuthenticated, getChatValidator(), validateHandler, deleteChat);

export default app;