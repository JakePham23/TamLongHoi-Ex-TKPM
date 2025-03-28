import winston from "winston";
import "winston-mongodb";

// Cấu hình Winston
const logger = winston.createLogger({
  level: "info", // Mức độ log: error, warn, info, debug
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Log ra console
    new winston.transports.File({ filename: "logs/app.log", level: "info" }), // Log vào file
    new winston.transports.MongoDB({
      db: "mongodb://localhost:27017/StudentManagementSystem", // Chỉ để database
      collection: "logs", // Collection lưu log
      options: { useUnifiedTopology: true },
      level: "info",
    })
  ],
});

// Middleware ghi log request
const requestLogger = (req, res, next) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    timestamp: new Date().toISOString(),
  });
  next();
};


// Bắt lỗi không xử lý được
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
});

export { logger, requestLogger };
