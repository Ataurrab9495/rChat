import multer from "multer";

export const multerUpload = multer({
    limits:{
        fileSize: 1024 * 1024 * 20,
    },
});

const singleAvatar = multerUpload.single("avatar");

const attachmentsUsingMulter = multerUpload.array("files", 10);

export {singleAvatar, attachmentsUsingMulter};