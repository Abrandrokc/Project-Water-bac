import Joi from "joi";
export const WaterNotes = Joi.object({
    waterVolume: Joi.number().required().min(1).max(5000),
    date:  Joi.date().required()
})
export const WaterPatchNotes = Joi.object({
    waterVolume: Joi.number().min(1).max(5000),
    date:  Joi.date()
})