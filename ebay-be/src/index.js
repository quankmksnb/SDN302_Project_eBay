import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
dotenv.config();

const hostname = process.env.HOST_NAME || "localhost";
const port = process.env.PORT || 9999;

const app = express();
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Hello World from eBay BE!");
});

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
