import {
    body,
    check,
    param,
    validationResult
} from "express-validator";
import { ErrorHandler } from "../utils/utitlity.js";


const newUserValidator = () => [
    body("name", "Please provide a name baccha...").notEmpty(),
    body("username", "please provide a username baccha...").notEmpty(),
    body("bio", "please provide a bio baccha...").notEmpty(),
    body("password", "please provide a password baccha...").notEmpty(),
    
];

const loginValidator = () => [
    body("username", "Please provide a username baccha...").notEmpty(),
    body("password", "Please provide a password baccha...").notEmpty(),
];

const newGroupValidator = () => [
    body("name", "Please provide a group name baccha...").notEmpty(),
    body("members").notEmpty().withMessage("Please provide members for the group...")
        .isArray({ min: 2, max: 1000 }).withMessage("Members must be between 2 and 1000")
];

const addMembersValidator = () => [
    body("chatId", "Please provide a chat ID baccha...").notEmpty(),
    body("members").notEmpty().withMessage("Please provide members for the group...")
        .isArray({ min: 1, max: 997 }).withMessage("Members must be between 1 and 997")
];

const removeMembersValidator = () => [
    body("userId", "Please provide a user ID baccha...").notEmpty(),
    body("chatId", "Please provide a chat ID baccha...").notEmpty()
];

const leaveGroupValidator = () => [
    param("id", "Please provide a valid chat ID baccha...").notEmpty(),
];

const sendAttachmentsValidator = () => [
    body("chatId", "Please provide a chat ID baccha...").notEmpty(),
];


const getChatValidator = () => [
    param("id", "Please provide a valid chat ID baccha...").notEmpty(),
];

const renameValidator = () => [
    param("id", "Please provide a valid chat ID baccha...").notEmpty(),
    body("name", "Please provide a new name baccha...").notEmpty(),
];

const FriendRequestValidator = () => [
    body("userId", "Please provide a user ID baccha...").notEmpty(),
];

const acceptFriendRequestValidator = () => [
    body("requestId", "Please provide a request ID baccha...").notEmpty(),
    body("accept", "Please provide whether to accept or reject the request...")
        .notEmpty()
        .isBoolean()
        .withMessage("Accept must be a boolean value (true or false)..."),
];

const adminLoginValidator = () => [
    body("secKey", "Please provide the admin secret key.").notEmpty(),
];

const validateHandler = (req, res, next) => {
    const errors = validationResult(req);

    const errorMessages = errors.array().map(error => error.msg).join(", ");

    if (errors.isEmpty()) return next();
    else return next(new ErrorHandler(errorMessages, 400));
};

export {
    newUserValidator,
    validateHandler,
    loginValidator,
    newGroupValidator,
    addMembersValidator,
    removeMembersValidator,
    leaveGroupValidator,
    sendAttachmentsValidator,
    getChatValidator,
    renameValidator,
    FriendRequestValidator,
    acceptFriendRequestValidator,
    adminLoginValidator
};