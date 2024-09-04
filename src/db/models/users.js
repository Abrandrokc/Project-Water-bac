import { model, Schema } from "mongoose";

const usersSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["woman", "man"],
      default: "woman",
    },
    waterAmount: {
      type: Number,
      default: 1.5,
    },
    weight: { type: Number, default: 0 },
    sportHours: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model("users", usersSchema);