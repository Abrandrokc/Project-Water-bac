import initMongoConnection from "./db/initMongoConnection.js";
import setupServer from "./server.js";

const boostrap = async () => {
    await initMongoConnection()
    setupServer()
}
boostrap()