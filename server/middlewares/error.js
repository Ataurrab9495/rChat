const errorMiddleware = (err, req, res, next) => {
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    if(err.code === 11000) {
        const error = Object.keys(err.keyPattern).join(", ");
        err.message = `Duplicate ${error} entered.`;
        err.statusCode = 400;
    }

    if(err.name === "CastError") {
        const errPath = err.path;
        err.message = `Invalid ${errPath} provided.`;
        err.statusCode = 400;
    }

    return res.status(err.statusCode).json({
        success:false,
        message: err.message,
    });
};

const TryCatch = (passingFunc) => async(req, res, next) => {
    try {
        passingFunc(req, res, next);
    } catch (error) {
        next(error);
    }
};

export {errorMiddleware, TryCatch};