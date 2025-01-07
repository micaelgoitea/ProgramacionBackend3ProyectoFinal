import mongoose from "mongoose";
import { config } from "dotenv";

config();

const CONNECTION_STRING = process.env.MONGO_URL || "mongodb://localhost:27017/defaultdb";

mongoose
    .connect(CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Conectados a la BD"))
    .catch((error) => console.log("Tenemos un error: ", error));