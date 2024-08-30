import { HttpError } from "http-errors";

const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    if (error instanceof HttpError) {
        const { status = 500, message } = error;
        res.status(status).json({
            status,
            message,
            data: error,
        });
    } else {
        const { status = 500, message = "Something went wrong" } = error;
        res.status(status).json({
            status,
            message,
            data: error.message,
        });
    }
};

export default errorHandler;
