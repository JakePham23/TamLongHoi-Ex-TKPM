// src/utils/export/studentExportConfig.js
export const studentCsvHeaders = [
  "MSSV", "Họ và tên", "CCCD", "Ngày sinh", "Khóa", "Khoa",
  "Giới tính", "Email", "SĐT", "Chương trình", "Tình trạng",
  "Địa chỉ thường trú", "Địa chỉ tạm trú"
];

export const mapStudentToCsvRow = (student) => [
  student.studentId,
  student.fullname,
  student.identityDocument?.idNumber || "",
  new Date(student.dob).toLocaleDateString("vi-VN"),
  student.schoolYear,
  student.department?.departmentName || "",
  student.gender ? "Nam" : "Nữ",
  student.email,
  student.phone,
  student.program,
  student.studentStatus,
  `${student.address.houseNumber}, ${student.address.street}, ${student.address.district}, ${student.address.city}`,
  `${student.addressTemp.houseNumber}, ${student.addressTemp.street}, ${student.addressTemp.district}, ${student.addressTemp.city}`
];