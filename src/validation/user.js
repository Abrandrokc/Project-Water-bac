import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8).max(64),
  oldPassword: Joi.string().min(8).max(64),
  waterAmount: Joi.number().min(0).required(),
  name: Joi.string().max(32).messages({ 'string.max': 'Рядок не може містити більше ніж 32 символи' }),
});
export const userSchemaPatch = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8).max(64),
  oldPassword: Joi.string().min(8).max(64),
  waterAmount: Joi.number().min(0),
  name: Joi.string().max(32).messages({ 'string.max': 'Рядок не може містити більше ніж 32 символи' }),
});
