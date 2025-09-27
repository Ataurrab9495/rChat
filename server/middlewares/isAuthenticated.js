import { AdminSeckey } from "../app.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utitlity.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated = TryCatch(async (req, res, next) => {
    const token = req.cookies["meri-pratyaksha"];

    if (!token) return next(new ErrorHandler("Please login to access your profile.", 401));

    const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET || "process.env.JWT_SECRETKEY");
    req.user = decode._id;
    next();
});

const isAdminAuthenticated = TryCatch(async (req, res, next) => {
    const token = req.cookies["Admin-Prab"];

    if (!token) return next(new ErrorHandler("Only Mr.Ataurrab has access to these routes.", 401));

    const seckretkey = jwt.verify(token, process.env.JWT_TOKEN_SECRET || "process.env.JWT_SECRETKEY");

    const isMatched = seckretkey === AdminSeckey;

    if (!isMatched) return next(new ErrorHandler("Invalid admin secret key", 401));

    next();
});


// Socket Authentication Middleware
const socketAuthentication = async (err, socket, next) => {
    try {
        if (err) return next(err);

        const authToken = socket.request.cookies["meri-pratyaksha"];

        if (!authToken) return next(new ErrorHandler("Authentication failed.", 401));

        const decode = jwt.verify(authToken, process.env.JWT_TOKEN_SECRET || "process.env.JWT_SECRETKEY");

        const user = await User.findById(decode._id);

        if (!user) return next(new ErrorHandler("Authentication failed.", 401));

        socket.user = user;

        return next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        return next(new ErrorHandler("Authentication failed.", 401));
    }
};

export { isAuthenticated, isAdminAuthenticated, socketAuthentication };