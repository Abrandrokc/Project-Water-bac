import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export function isValidId(req, res, next) {
  const { userIdParam } = req.params;
  if (!isValidObjectId(userIdParam)) {
    return next(createHttpError(400, "Id is not valid"));
  }
  next();
}
