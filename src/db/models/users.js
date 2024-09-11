
import { model, Schema } from "mongoose";
import { en } from "../../constants/index.js";

const usersSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    oldPassword: {type: String},
    name: { type: String },
    photo: {
      type: String,
    },
    gender: {
      type: String,
      enum:en
    },
    waterAmount: {
      type: Number,
      default: 15
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
