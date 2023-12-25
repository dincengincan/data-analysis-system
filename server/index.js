import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import connectDB from "./mongodb/connect.js";
import genesRouter from "./routes/genes.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/genes", genesRouter);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);

    app.listen(8080, () => {
      console.log("Server started on port http://localhost:8080");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
