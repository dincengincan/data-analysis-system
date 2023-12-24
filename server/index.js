import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import connectDB from "./mongodb/connect.js";
import geneRouter from "./routes/genes.route.js";
import Gene from "./mongodb/models/gene.js";
import { mockData } from "./data/mock.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/genes", geneRouter);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);

    app.listen(8080, () => {
      console.log("Server started on port http://localhost:8080");
    });

    // ADD MOCK DATA HERE
    // Gene.insertMany(mockData);
  } catch (error) {
    console.log(error);
  }
};

startServer();
