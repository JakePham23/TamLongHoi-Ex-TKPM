import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import indexRoutes from "./routes/index.js";

// Khởi tạo app
const app = express();

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Kết nối database
import "./dbs/init.mongodb.js";

// Routes
app.use("/api/v1", indexRoutes);

export default app;
