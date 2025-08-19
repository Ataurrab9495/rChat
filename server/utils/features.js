import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../library/helper.js";

const connectDB = (uri) => {
    mongoose.connect(uri, { dbName: "RChat" })
        .then(data => console.log(`Connected to DB: ${data.connection.host}`))
        .catch((err) => {
            throw err;
        });
};

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, "process.env.JWT_SECRETKEY");

    return res.status(code).cookie("meri-pratyaksha", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        httpOnly: true,
        secure: true
    }).json({
        success: true,
        message,
        user
    });
};

const emitEvent = (req, event, users, data) => {
    console.log("Emmiting event", event);

};


const uploadingFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid(),
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    });

    try {
        const results = await Promise.all(uploadPromises);

        const formatResult = results.map(result => ({
            public_id: result.public_id,
            url: result.secure_url
        }));

        return formatResult;
    } catch (err) {
        throw new Error("Error occurred while uploading files in cloudinary.", err);
    }
};


const deleteAttachmentsFromCloudinary = async (publicIds) => { };


export {
    connectDB,
    sendToken,
    emitEvent,
    deleteAttachmentsFromCloudinary,
    uploadingFilesToCloudinary
};