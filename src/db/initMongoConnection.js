import mongoose from "mongoose";
import env from "../utils/env.js";
export default async function initMongoConnection() {
    try {
        const user = env("MONGODB_USER")
       const password = env("MONGODB_PASSWORD")
        const url = env("MONGODB_URL")
       const db = env("MONGODB_DB")
        const Host= `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`
        mongoose.connect(Host)
        console.log("Mongo connection successfully established!")
    } catch (error) {
        console.log(error)
    }

}
