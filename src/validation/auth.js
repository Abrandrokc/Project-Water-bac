import Joi from 'joi';

export const registerUserSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).required(),
  });