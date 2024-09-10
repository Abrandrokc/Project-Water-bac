
import { model, Schema } from "mongoose";
import { en } from "../../constants/index.js";

const usersSchema = new Schema(
  {
    googleId: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: {
      type: String,
    },
    gender: {
      type: String,
      enum:en
    },
    waterAmount: {
      type: Number,
      default: 1.5
    }
  },
  { timestamps: true, versionKey: false }
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model("users", usersSchema);
