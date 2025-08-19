import { AdminSeckey } from "../app.js";
import { ErrorHandler } from "../utils/utitlity.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated = TryCatch(async(req, res, next) => {
    const token = req.cookies["meri-pratyaksha"];

    if(!token) return next(new ErrorHandler("Please login to access your profile.", 401));

    const decode = jwt.verify(token, "process.env.JWT_SECRETKEY");
    req.user = decode._id;
    next();
});

const isAdminAuthenticated = TryCatch(async(req, res, next) => {
    const token = req.cookies["Admin-Prab"];

    if(!token) return next(new ErrorHandler("Only Mr.Ataurrab has access to these routes.", 401));

    const seckretkey = jwt.verify(token, "process.env.JWT_SECRETKEY");

    const isMatched = seckretkey === AdminSeckey;

    if(!isMatched) return next(new ErrorHandler("Invalid admin secret key", 401));

    next();
});

export {isAuthenticated, isAdminAuthenticated};