import React, { useState } from "react";
import "../styles/StudentForm.scss"

const ALLOWED_EMAIL_DOMAIN = "@student.university.edu.vn";
const PHONE_REGEX = /^(?:\+84|0)(3|5|7|8|9)[0-9]{8}$/;

const STATUS_RULES = {
  active: ["suspended", "graduated", "dropout"],
  suspended: ["active"],
  graduated: [],
  dropout: [],
};
const StudentForm = ({ departments, onSubmit, onClose }) => {
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    fullname: "",
    dob: "",
    gender: true,
    schoolYear: "",
    program: "",
    department: "",
    email: "",
    phone: "",
    studentStatus: "",
    address: {
      houseNumber: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "Việt Nam",
    },
    addressTemp: {
      houseNumber: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "Việt Nam",
    },
    identityDocument: {
      type: "CMND",
      idNumber: "",
      issuedPlace: "",
      issuedDate: "",
      expirationDate: "",
    },
    nationality: "Việt Nam",
  });

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
  const [errors, setErrors] = useState({});


  const validate = () => {
    let newErrors = {};

    if (!newStudent.email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
      newErrors.email = `Email phải có đuôi ${ALLOWED_EMAIL_DOMAIN}`;
    }

    if (!PHONE_REGEX.test(newStudent.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ theo định dạng Việt Nam!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="student-detail-overlay-adding" onClick={onClose}>
      <div className="student-detail-adding" onClick={(e) => e.stopPropagation()}>
        <h2>Thêm sinh viên</h2>
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
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Số điện thoại:</label>
        <input type="text" name="phone" placeholder="SĐT" value={newStudent.phone} onChange={handleChange} />
        {errors.phone && <span className="error">{errors.phone}</span>}

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
        
        {/* Thông tin giấy tờ tùy thân */}
        <h3>Giấy tờ tùy thân</h3>
        <select value={newStudent.identityDocument.type} onChange={(e) => handleNestedChange("identityDocument", "type", e.target.value)}>
          <option value="CMND">CMND</option>
          <option value="CCCD">CCCD</option>
          <option value="Passport">Hộ chiếu</option>
        </select>
        <input type="text" placeholder="Số giấy tờ" value={newStudent.identityDocument.idNumber} onChange={(e) => handleNestedChange("identityDocument", "idNumber", e.target.value)} />
        
        <label>Ngày cấp:</label>
        <input type="date" value={newStudent.identityDocument.issuedDate} onChange={(e) => handleNestedChange("identityDocument", "issuedDate", e.target.value)} />

        <label>Nơi cấp:</label>
        <input type="text" placeholder="Nơi cấp" value={newStudent.identityDocument.issuedPlace} onChange={(e) => handleNestedChange("identityDocument", "issuedPlace", e.target.value)} />

        <label>Ngày hết hạn (nếu có):</label>
        <input type="date" value={newStudent.identityDocument.expirationDate} onChange={(e) => handleNestedChange("identityDocument", "expirationDate", e.target.value)} />

        <button onClick={handleSubmit}>Lưu</button>
      </div>
    </div>
  );
};

export default StudentForm;