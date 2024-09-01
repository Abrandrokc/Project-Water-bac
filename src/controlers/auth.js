import { registerUser } from "../servises/auth.js";

export async function registerUserController(req, res) {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user,
  });
}
