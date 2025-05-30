// utils/format.util.js

export const formatAddress = (address) => {
    if (!address) return "Không xác định";
    return `${address.houseNumber ? address.houseNumber + ", " : ""}${address.street ? address.street + ", " : ""}${address.ward ? address.ward + ", " : ""}${address.district ? address.district + ", " : ""}${address.city ? address.city + ", " : ""}${address.country || ""}`.replace(/,\s*$/, "");
  };
  
  export const formatIdentityDocument = (doc) => {
    if (!doc) return "Không xác định";
    return `${doc.type ? doc.type + ": " : ""}${doc.idNumber ? doc.idNumber + ", " : ""}${formatDate(doc.issuedDate) ? "Ngày cấp: " + formatDate(doc.issuedDate) + ", " : ""}${doc.issuedPlace ? "Nơi cấp: " + doc.issuedPlace + ", " : ""}${formatDate(doc.expirationDate) ? "Hết hạn: " + formatDate(doc.expirationDate) + ", " : ""}${doc.hasChip ? "Có chip, " : ""}${doc.countryIssued ? "Cấp tại: " + doc.countryIssued + ", " : ""}${doc.notes || ""}`.replace(/,\s*$/, "");
  };
  
  export const formatDate = (date) => {
    if (!date) return "Không xác định";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Không hợp lệ" : d.toLocaleDateString("vi-VN");
  };
  
  export const formatDepartment = (department) => {
    return department?.departmentName || "Chưa có khoa";
  };
  
  export const formatStudentData = (student) => {
    return {
      ...student,
      fullAddress: formatAddress(student.address),
      identityInfo: formatIdentityDocument(student.identityDocument),
      dob: formatDate(student.dob),
      departmentName: formatDepartment(student.department),
      gender: student.gender ? "Nam" : "Nữ",
    };
  };
  