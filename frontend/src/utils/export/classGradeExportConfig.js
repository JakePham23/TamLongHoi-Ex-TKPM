// src/utils/export/classGradeExportConfig.js

/**
 * CSV Headers for the Class Grade List.
 * These are the titles that will appear in the first row of the CSV file.
 */
export const classGradeCsvHeaders = [
  "STT",         // No.
  "MSSV",        // Student ID
  "Họ và tên",   // Full Name
  "Điểm QT",     // Process Point / Continuous Assessment Score
  "Điểm GK",     // Midterm Point / Midterm Exam Score
  "Điểm CK",     // Final Term Point / Final Exam Score
  "Điểm TK",     // Final Score / Overall Score
  "Tình trạng"   // Status (e.g., Registered, Completed)
];

/**
 * Maps a processed student item (from RegistrationInfoTable's processedData)
 * to an array representing a row in the CSV file.
 * The order of items in the array must match the order of headers in classGradeCsvHeaders.
 * @param {object} item - A student item from the processedData/sortedData in RegistrationInfoTable.
 * @returns {Array} An array of values for a single CSV row.
 */
export const mapClassGradeToCsvRow = (item) => [
  item.stt,
  item.studentDisplayId,
  item.fullname,
  item.processPoint,  // These will be exported as is (e.g., number or "N/A" string)
  item.midterm,
  item.finalTerm,
  item.finalScore,
  item.statusText      // The translated status text
];

/**
 * Optional: If you want JSON export to have specific keys instead of using CSV mapping.
 * This function maps a processed student item to an object for JSON export.
 * @param {object} item - A student item from the processedData/sortedData in RegistrationInfoTable.
 * @returns {object} An object representing the student's grade information.
 */
export const mapClassGradeToJsonObject = (item) => ({
  "STT": item.stt,
  "MSSV": item.studentDisplayId,
  "Họ và tên": item.fullname,
  "Điểm chuyên cần": item.processPoint,
  "Điểm giữa kỳ": item.midterm,
  "Điểm cuối kỳ": item.finalTerm,
  "Điểm tổng kết": item.finalScore,
  "Tình trạng": item.statusText,
  // You can include more raw data if needed for JSON
  // "rawStatus": item.status,
  // "studentDatabaseId": item.studentDbId
});