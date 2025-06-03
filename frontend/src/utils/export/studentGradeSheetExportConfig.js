// src/utils/export/studentGradeSheetExportConfig.js
export const studentGradeSheetCsvHeaders = [
  "STT",
  "Mã Môn Học",
  "Tên Môn Học",
  "Số TC",
  "Giảng Viên",
  "Lịch Học (Thứ)",
  "Giờ Học",
  "Điểm TK",
  "Trạng Thái ĐK"
];

// item is from registeredCoursesData in StudentRegisteredCoursesView
export const mapStudentGradeToCsvRow = (item) => [
  item.stt,
  item.courseCode,
  item.courseName,
  item.credits,
  item.teacherName,
  item.scheduleDay,
  item.scheduleTime,
  item.finalScore,
  item.statusText // Use the translated status
];

export const mapStudentGradeToJsonObject = (item) => ({
  "STT": item.stt,
  "MaMonHoc": item.courseCode,
  "TenMonHoc": item.courseName,
  "SoTinChi": item.credits,
  "GiangVien": item.teacherName,
  "LichHocThu": item.scheduleDay,
  "GioHoc": item.scheduleTime,
  "DiemTongKet": item.finalScore,
  "TrangThaiDangKy": item.statusText, // Or item.status for raw value
  // You can add more raw data if needed for JSON
  // "registrationId": item.registrationId,
});