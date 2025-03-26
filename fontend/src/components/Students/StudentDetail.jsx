import "../../styles/StudentDetail.scss";
import React, { useState } from "react";
import EntityView from "../EnityView";
import EnityEdit from "../EnityEdit";
import { exportCSV, exportJSON } from "../../utils/export.util";
import { validateEmail, validatePhone, validateStatusChange, validateIdentityDocument } from "../../utils/businessRule.util";
import { ALLOWED_EMAIL_DOMAIN, PHONE_REGEX, STATUS_RULES } from "../../utils/constants";
import { formatStudentData } from "../../utils/format.util";
const StudentDetail = ({ student, onSave, onClose, setEditedStudent, editedStudent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [exportType, setExportType] = useState("csv");
  const [errors, setErrors] = useState({});

  if (!student) return null;

  const validate = () => {
    let newErrors = {};
    if (validateEmail(editedStudent.email, ALLOWED_EMAIL_DOMAIN)) newErrors.email = "Email không hợp lệ";
    if (validatePhone(editedStudent.phone, PHONE_REGEX)) newErrors.phone = "Số điện thoại không hợp lệ";
    if (validateStatusChange(student.studentStatus, editedStudent.studentStatus, STATUS_RULES)) newErrors.studentStatus = "Không thể chuyển đổi trạng thái này";
    if (validateIdentityDocument(editedStudent.identityDocument?.idNumber)) newErrors.idNumber = "Số giấy tờ không hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setEditedStudent({ 
      ...student, 
      gender: student.gender === true, 
      dob: student.dob ? student.dob.split("T")[0] : "", // Format YYYY-MM-DD
      identityDocument: {
        ...student.identityDocument, // Giữ lại các giá trị khác
        issuedDate: student.identityDocument?.issuedDate ? student.identityDocument.issuedDate.split("T")[0] : "",
        expirationDate: student.identityDocument?.expirationDate ? student.identityDocument.expirationDate.split("T")[0] : ""
      }
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await onSave(editedStudent);
      setIsEditing(false);
      setEditedStudent(null);
    } catch (error) {
      console.error("Lỗi khi lưu sinh viên:", error);
      setErrors((prevErrors) => ({ ...prevErrors, general: error.message || "Lỗi không xác định." }));
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditedStudent(null);
    setErrors({});
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      {!isEditing ? (
        <EntityView
          title="Thông Tin Sinh Viên"
          entityData={formatStudentData(student)} // Dữ liệu đã format từ `StudentScreen`
          fields={[
            { label: "MSSV", key: "studentId" },
            { label: "Họ và Tên", key: "fullname" },
            { label: "Email", key: "email" },
            { label: "Giới tính", key: "gender" },
            { label: "Số điện thoại", key: "phone" },
            { label: "Ngày sinh", key: "dob" },
            { label: "Khoa", key: "departmentName" },
            { label: "Chương trình", key: "program" },
            { label: "Tình trạng", key: "studentStatus" },
            { label: "Địa chỉ thường trú", key: "fullAddress" },
            { label: "Giấy tờ tùy thân", key: "identityInfo" },
          ]}
          onClose={onClose}
          onEdit={handleEdit}
          exportType={exportType}
          setExportType={setExportType}
          onExport={() => {
            exportType === "csv"
              ? exportCSV(student, `student_${student.studentId}`)
              : exportJSON(student, `student_${student.studentId}`);
          }}
        />
      ) : (
        <EnityEdit
          title="Chỉnh Sửa Sinh Viên"
          fields={[
            { name: "studentId", label: "MSSV", type: "text", disabled: true },
            { name: "fullname", label: "Họ và Tên", type: "text" },
            { name: "dob", label: "Ngày sinh", type: "date" },
            { name: "gender", label: "Giới tính", type: "select", 
              value: editedStudent.gender, // 🔥 Set giá trị hiện tại
              options: [
                { value: true, label: "Nam" },
                { value: false, label: "Nữ" }
              ],
            },
            { name: "schoolYear", label: "Niên khóa", type: "number" },
            { name: "program", label: "Chương trình", type: "select", options: [
              { value: "CQ", label: "CQ" },
              { value: "CLC", label: "CLC" },
              { value: "DTTX", label: "DTTX" },
              { value: "APCS", label: "APCS" },
            ]},
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Số điện thoại", type: "text" },
            { name: "studentStatus", label: "Tình trạng", type: "select", options: [
              { value: "active", label: "Đang học" },
              { value: "graduated", label: "Đã tốt nghiệp" },
              { value: "dropout", label: "Bị đuổi học" },
              { value: "suspended", label: "Bị đình chỉ" },
            ]},
            { name: "nationality", label: "Quốc tịch", type: "text" },
            { name: "identityDocument.idNumber", label: "Số giấy tờ", type: "text" },
            { name: "identityDocument.issuedDate", label: "Ngày cấp", type: "date" },
            { name: "identityDocument.issuedPlace", label: "Nơi cấp", type: "text" },
            { name: "identityDocument.expirationDate", label: "Ngày hết hạn", type: "date" },
            // { name: "identityDocument.hasChip", label: "Có chip (CCCD)", type: "checkbox" },
          ]}
          data={editedStudent}
          onChange={handleChange}
          onSave={handleSave}
          onClose={handleClose}
          errors={errors}
        />
      )}
    </>
  );
};

export default StudentDetail;
