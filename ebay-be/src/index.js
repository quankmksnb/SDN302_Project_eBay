import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const hostname = process.env.HOST_NAME || "localhost";
const port = process.env.PORT || 9999;

const app = express();

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Hello World from eBay BE!");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
