db = db.getSiblingDB("StudentManagementSystem");

// Import Students
db.Students.deleteMany({});  // Xóa dữ liệu cũ nếu có
db.Students.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.Students.json")));

// Import Departments
db.Departments.deleteMany({});
db.Departments.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.Departments.json")));

print("✅ Data imported successfully!");
