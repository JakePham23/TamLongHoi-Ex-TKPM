export const exportCSV = (students, fileName = "students") => {
    if (!students.length) return;
  
    const headers = [
      "MSSV", "Họ và tên", "CCCD", "Ngày sinh", "Khóa", "Khoa",
      "Giới tính", "Email", "SĐT", "Chương trình", "Tình trạng",
      "Địa chỉ thường trú", "Địa chỉ tạm trú"
    ];
  
    const csvRows = [
      headers.join(","), // Header row
      ...students.map(student => [
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
      ].map(value => `"${value}"`).join(","))
    ];
  
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const exportJSON = (students, fileName = "students") => {
    const jsonData = JSON.stringify(students, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  