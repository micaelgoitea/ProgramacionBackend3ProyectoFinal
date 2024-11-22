import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import mocksRouter from "./routes/mocks.router.js";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";

mongoose.set("strictQuery", false);

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(`mongodb+srv://micaelgoitea:coderhouse2024@cluster0.2pk1l.mongodb.net/adoptame?retryWrites=true&w=majority&appName=Cluster0`)

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

app.listen(PORT, () => console.log(`Servidor escuchando en el http://localhost:${PORT}`));