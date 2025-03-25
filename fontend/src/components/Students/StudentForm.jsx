import React, { useState, useCallback } from "react";
import "../../styles/StudentForm.scss";
import Papa from "papaparse"; // Dùng để parse CSV

import { validateEmail, validatePhone, validateStatusChange } from "../../utils/businessRule.util"; // Import từ utils.js
import { ALLOWED_EMAIL_DOMAIN, PHONE_REGEX, STATUS_RULES } from "../../utils/constants"; // Import từ constants.js


const StudentForm = ({ departments, onSubmit, onClose }) => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    fullname: "",
    dob: "",
    gender: true,
    schoolYear: "",
    program: "CQ",
    department: "67d8eaa27e02c451d88fa5de",
    email: "",
    phone: "",
    studentStatus: "active",
    address: { houseNumber: "", street: "", ward: "", district: "", city: "", country: "Việt Nam" },
    addressTemp: { houseNumber: "", street: "", ward: "", district: "", city: "", country: "Việt Nam" },
    identityDocument: { type: "CMND", idNumber: "", issuedPlace: "", issuedDate: "", expirationDate: "" },
    nationality: "Việt Nam",
  });
  const [errors, setErrors] = useState({});

  // Xử lý khi tải file CSV hoặc JSON
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;

      if (file.name.endsWith(".json")) {
        try {
          let data = JSON.parse(content);
          if (!Array.isArray(data)) {
            data = [data]; // Nếu file chỉ chứa 1 sinh viên, chuyển thành mảng
          }
          const formattedData = data.map((student) => formatStudentData(student));
          setStudents(formattedData);
        } catch (error) {
          console.error("Lỗi đọc JSON:", error);
        }
      
      } else if (file.name.endsWith(".csv")) {
        Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const formattedData = results.data.map((row) => formatStudentData(row));
            setStudents(formattedData);
          },
          error: (error) => {
            console.error("Lỗi đọc CSV:", error);
          },
        });
      }
    };

    reader.readAsText(file);
  }, []);

  // Format student data for consistency
  const formatStudentData = (student) => ({
    studentId: student.studentId || "",
    fullname: student.fullname || "",
    dob: student.dob || "",
    gender: student.gender === "true" || student.gender === true,
    schoolYear: String(student.schoolYear) || "",
    program: student.program || "",
    department: student.department || "",
    email: student.email || "",
    phone: student.phone || "",
    studentStatus: student.studentStatus || "",
    address: formatAddress(student.address),
    addressTemp: formatAddress(student.addressTemp),
    identityDocument: formatIdentityDocument(student.identityDocument),
    nationality: student.nationality || "Việt Nam",
  });

  const formatAddress = (address) => ({
    houseNumber: address.houseNumber || "",
    street: address.street || "",
    ward: address.ward || "",
    district: address.district || "",
    city: address.city || "",
    country: address.country || "Việt Nam",
  });

  const formatIdentityDocument = (identityDocument) => ({
    type: identityDocument.type || "CMND",
    idNumber: identityDocument.idNumber || "",
    issuedPlace: identityDocument.issuedPlace || "",
    issuedDate: identityDocument.issuedDate || "",
    expirationDate: identityDocument.expirationDate || "",
  });

  const handleImport = async () => {
    if (students.length > 0) {
      for (const student of students) {
        try {
          await onSubmit(student);
        } catch (error) {
          console.error(`Lỗi khi thêm sinh viên ${student.fullname}:`, error);
        }
      }
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (key, field, value) => {
    setNewStudent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(newStudent);
      onClose();
    }
  };

  const validate = () => {
    let newErrors = {};
  
    // Kiểm tra email
    const emailError = validateEmail(newStudent.email, ALLOWED_EMAIL_DOMAIN);
    if (emailError) {
      newErrors.email = emailError;
    }
  
    // Kiểm tra số điện thoại
    const phoneError = validatePhone(newStudent.phone, PHONE_REGEX);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    // Kiểm tra tình trạng
    const statusError = validateStatusChange(newStudent.studentStatus, newStudent.studentStatus, STATUS_RULES);
    if (statusError) {
      newErrors.studentStatus = statusError;
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="student-detail-overlay-adding" onClick={onClose}>
      <div className="student-detail-adding" onClick={(e) => e.stopPropagation()}>
        <h2>Thêm sinh viên</h2>

        <label>Tải file CSV hoặc JSON:</label>
        <input type="file" accept=".csv,.json" onChange={handleFileUpload} />

        {students.length > 0 && (
          <div>
            <h3>Danh sách sinh viên đã nhập:</h3>
            <ul>
              {students.map((student, index) => (
                <li key={index}>{student.fullname} - {student.studentId}</li>
              ))}
            </ul>
            <button onClick={handleImport}>Nhập dữ liệu</button>
          </div>
        )}

        <input type="text" name="fullname" placeholder="Họ và tên" value={newStudent.fullname} onChange={handleChange} />
        <input type="text" name="studentId" placeholder="MSSV" value={newStudent.studentId} onChange={handleChange} />
        
        <label>Ngày sinh:</label>
        <input type="date" name="dob" value={newStudent.dob} onChange={handleChange} />

        <label>Khoa:</label>
        <select name="department" value={newStudent.department} onChange={handleChange}>
          <option value="">Chọn khoa</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.departmentName}
            </option>
          ))}
        </select>

        <label>Khóa:</label>
        <input type="text" name="schoolYear" placeholder="Khóa" value={newStudent.schoolYear} onChange={handleChange} />

        <label>Giới tính:</label>
        <select name="gender" value={newStudent.gender} onChange={(e) => handleChange({ target: { name: "gender", value: e.target.value === "true" } })}>
          <option value="true">Nam</option>
          <option value="false">Nữ</option>
        </select>

        <label>Email:</label>
        <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleChange} />
        <p>        {errors.email && <span className="error">{errors.email}</span>} </p>

        <label>Số điện thoại:</label>
        <input type="text" name="phone" placeholder="SĐT" value={newStudent.phone} onChange={handleChange} />
        <p>{errors.phone && <span className="error">{errors.phone}</span>}</p>

        <label>Chương trình:</label>
        <select name="program" value={newStudent.program} onChange={handleChange}>
          <option value="CQ">Chính quy</option>
          <option value="CLC">Chất lượng cao</option>
          <option value="DTTX">Đào tạo từ xa</option>
          <option value="APCS">APCS</option>
        </select>

        <label>Tình trạng:</label>
        <select
          name="studentStatus"
          value={newStudent.studentStatus}
          onChange={(e) => {
            if (STATUS_RULES[newStudent.studentStatus].includes(e.target.value)) {
              handleChange(e);
            }
          }}
        >
          <option value="active">Đang học</option>
          <option value="suspended">Bị đình chỉ</option>
          <option value="graduated">Tốt nghiệp</option>
          <option value="dropout">Bỏ học</option>
        </select>

        <label>Quốc tịch:</label>
        <input type="text" name="nationality" placeholder="Quốc tịch" value={newStudent.nationality} onChange={handleChange} />

        {/* Địa chỉ */}
        <h3>Địa chỉ thường trú</h3>
        <input type="text" placeholder="Số nhà" value={newStudent.address.houseNumber} onChange={(e) => handleNestedChange("address", "houseNumber", e.target.value)} />
        <input type="text" placeholder="Phố" value={newStudent.address.street} onChange={(e) => handleNestedChange("address", "street", e.target.value)} />
        <input type="text" placeholder="Quận" value={newStudent.address.district} onChange={(e) => handleNestedChange("address", "district", e.target.value)} />
        
        <h3>Địa chỉ tạm trú</h3>
        <input type="text" placeholder="Số nhà" value={newStudent.addressTemp.houseNumber} onChange={(e) => handleNestedChange("addressTemp", "houseNumber", e.target.value)} />
        <input type="text" placeholder="Phố" value={newStudent.addressTemp.street} onChange={(e) => handleNestedChange("addressTemp", "street", e.target.value)} />

        <button onClick={handleSubmit}>Lưu</button>
      </div>
    </div>
  );
};

export default StudentForm;
