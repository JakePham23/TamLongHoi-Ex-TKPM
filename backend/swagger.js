// tips nhanh nhất là lấy source cũ build lại cho từng task 
// awesome <languaes> .com
// be roadmap 

import express from "express"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const app = express();

// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Tài liệu API cho ứng dụng Node.js + Express"
    }
  },
  apis: ["./src/routes/*.route.js"] // File chứa JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(4000, () => console.log("Server running at http://localhost:4000/api-docs"));
