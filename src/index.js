import { TEMP_UPLOAD_DIR } from "./constants/index.js";
import initMongoConnection from "./db/initMongoConnection.js";
import setupServer from "./server.js";
import createDirIfNotExists from "./utils/createDirIfNotExists.js";

const boostrap = async () => {
    await initMongoConnection()
     await createDirIfNotExists(TEMP_UPLOAD_DIR)
    setupServer()
}
boostrap()