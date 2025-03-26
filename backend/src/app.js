import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import morgan from 'morgan'
// Khởi tạo app
const app = express();
// Kết nối database
import "./dbs/init.mongodb.js";



// Middleware
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json())



// Routes
// app.use(jsonErrorHandler)
app.use("/api/v1", indexRoutes);
app.use((err, req, res, next) => {
    console.log("❌ Middleware error:", err.message);

    res.status(err.statusCode || 500).json({
        message: err.message || "Lỗi không xác định",
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});
export default app;
