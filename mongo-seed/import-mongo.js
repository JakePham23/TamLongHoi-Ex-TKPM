db = db.getSiblingDB("StudentManagementSystem");

// Import students
db.Students.deleteMany({});  // Xóa dữ liệu cũ nếu có
db.Students.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.students.json")));

// Import departments
db.Departments.deleteMany({});
db.Departments.insertMany(JSON.parse(cat("/docker-entrypoint-initdb.d/StudentManagementSystem.departments.json")));

print("✅ Data imported successfully!");
