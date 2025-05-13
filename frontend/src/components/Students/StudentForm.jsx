import React, { useState, useCallback } from "react";
import "../../styles/StudentForm.scss";
import Papa from "papaparse"; // Dùng để parse CSV
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation(['student', 'department']);

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
          console.error(t('error.readJSON') + ":", error);
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
            console.error(t('error.readCSV') + ":", error);
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
    console.log(t('import.importing') + ":", students);
    if (students.length === 0) {
      console.warn(t('import.nostudents'));
      return;
    }

    let newErrors = {};
    let successCount = 0;

    for (const student of students) {
      try {
        await onSubmit(student);
        console.log(t('success') + ":", student.fullname);
        successCount++;
      } catch (error) {
        console.log(t('error.add student') + ' ${student.fullname}:', error.message);
        newErrors[student.studentId] = error.message || t('error.unknown');
      }
    }

    setErrors(newErrors);

    if (successCount > 0) alert(t('import.success') + '${successCount}' + t('students') + "!");
    if (Object.keys(newErrors).length > 0) alert(t('error.import some student'));
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

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await onSubmit(newStudent);
        onClose();
      } catch (error) {
        console.error(t('error.error') + ":", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: error.message || t('error.unknown'),
        }));
      }
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
        <h2>{t('add student')}</h2>

        <label>{t('downloadfilecsvorjson')}:</label>
        <input type="file" accept=".csv,.json" onChange={handleFileUpload} />
        {students.length > 0 && (
          <div>
            <h3>{t('list of students')}:</h3>
            <ul>
              {students.map((student, index) => (
                <li key={index}>
                  {student.fullname} - {student.studentId}{" "}
                  <p>                  {errors[student.studentId] && <span className="error">({errors[student.studentId]})</span>}                  </p>
                </li>
              ))}
            </ul>
            <button onClick={handleImport}>Nhập dữ liệu</button>
          </div>
        )}

        <input type="text" name="fullname" placeholder={t('fullname')} value={newStudent.fullname} onChange={handleChange} />
        <input type="text" name="studentId" placeholder={t('id')} value={newStudent.studentId} onChange={handleChange} />

        <label>{t('birthdate')}:</label>
        <input type="date" name="dob" value={newStudent.dob} onChange={handleChange} />

        <label>{t('department')}:</label>
        <select name="department" value={newStudent.department} onChange={handleChange}>
          <option value="">{t('choose department')}</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.departmentName}
            </option>
          ))}
        </select>

        <label>{t('school year')}:</label>
        <input type="text" name="schoolYear" placeholder={t('school year')} value={newStudent.schoolYear} onChange={handleChange} />

        <label>{t('gender')}:</label>
        <select name="gender" value={newStudent.gender} onChange={(e) => handleChange({ target: { name: "gender", value: e.target.value === "true" } })}>
          <option value="true">{t('male')}</option>
          <option value="false">{t('female')}</option>
        </select>

        <label>Email:</label>
        <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleChange} />
        <p>        {errors.email && <span className="error">{errors.email}</span>} </p>

        <label>{t('phone number')}:</label>
        <input type="text" name="phone" placeholder={t('phone number')} value={newStudent.phone} onChange={handleChange} />
        <p>{errors.phone && <span className="error">{errors.phone}</span>}</p>

        <label>{t('program')}:</label>
        <select name="program" value={newStudent.program} onChange={handleChange}>
          <option value="CQ">{t('regular')}</option>
          <option value="CLC">{t('high quality')}</option>
          <option value="DTTX">{t('distance education')}</option>
          <option value="APCS">APCS</option>
        </select>

        <label>{t('status')}:</label>
        <select
          name="studentStatus"
          value={newStudent.studentStatus}
          onChange={(e) => {
            if (STATUS_RULES[newStudent.studentStatus].includes(e.target.value)) {
              handleChange(e);
            }
          }}
        >
          <option value="active">{t('studying')}</option>
          <option value="suspended">{t('suspended')}</option>
          <option value="graduated">{t('graduated')}</option>
          <option value="dropout">{t('expelled')}</option>
        </select>

        <label>{t('nationality')}:</label>
        <input type="text" name="nationality" placeholder={t('nationality')} value={newStudent.nationality} onChange={handleChange} />

        {/* Địa chỉ */}
        <h3>{t('permanent address')}</h3>
        <input type="text" placeholder={t('address detail.house number')} value={newStudent.address.houseNumber} onChange={(e) => handleNestedChange("address", "houseNumber", e.target.value)} />
        <input type="text" placeholder={t('address detail.street')} value={newStudent.address.street} onChange={(e) => handleNestedChange("address", "street", e.target.value)} />
        <input type="text" placeholder={t('address detail.district')} value={newStudent.address.district} onChange={(e) => handleNestedChange("address", "district", e.target.value)} />

        <h3>{t('petemporaryrmanent address')}</h3>
        <input type="text" placeholder={t('address detail.house number')} value={newStudent.addressTemp.houseNumber} onChange={(e) => handleNestedChange("addressTemp", "houseNumber", e.target.value)} />
        <input type="text" placeholder={t('address detail.street')} value={newStudent.addressTemp.street} onChange={(e) => handleNestedChange("addressTemp", "street", e.target.value)} />

        {/* Thông tin giấy tờ tùy thân */}
        <h3>{t('identification.identification')}</h3>
        <select value={newStudent.identityDocument.type} onChange={(e) => handleNestedChange("identityDocument", "type", e.target.value)}>
          <option value="CMND">{t('identification.identity card')}</option>
          <option value="CCCD">{t('identification.citizen identity card')}</option>
          <option value="Passport">{t('identification.passport')}</option>
        </select>
        <input type="text" placeholder={t('identification.number')} value={newStudent.identityDocument.idNumber} onChange={(e) => handleNestedChange("identityDocument", "idNumber", e.target.value)} />

        <label>{t('identification.date of issue')}:</label>
        <input type="date" value={newStudent.identityDocument.issuedDate} onChange={(e) => handleNestedChange("identityDocument", "issuedDate", e.target.value)} />

        <label>{t('identification.place of issue')}:</label>
        <input type="text" placeholder={t('identification.place of issue')} value={newStudent.identityDocument.issuedPlace} onChange={(e) => handleNestedChange("identityDocument", "issuedPlace", e.target.value)} />

        <label>{t('identification.date of expiry')} {t('if have')}:</label>
        <input type="date" value={newStudent.identityDocument.expirationDate} onChange={(e) => handleNestedChange("identityDocument", "expirationDate", e.target.value)} />
        <p>{errors.general && <span className="error">{errors.general}</span>}        </p>
        <button onClick={handleSubmit}>Lưu</button>
      </div>
    </div>
  );
};

export default StudentForm;
