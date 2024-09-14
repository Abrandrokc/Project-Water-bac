import { model, Schema } from "mongoose";
import { mongoError, setUpdateSettings } from "../../utils/hook.js";
const waterSchema = new Schema(
    {
        waterVolume: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
             required: true
        },
        userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    },
    
   {
      timestamps: true,
      versionKey: false,

  }

)
waterSchema.post("save", mongoError)
waterSchema.pre("findOneAndUpdate", setUpdateSettings)
waterSchema.post("findOneAndUpdate", mongoError)

const Water = model("Water", waterSchema)
export default Water;