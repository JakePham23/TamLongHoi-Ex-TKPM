import "../../../styles/StudentDetail.scss";
import React, { useState } from "react";
import EntityView from "../../forms/EnityView.jsx";
import EnityEdit from "../../forms/EnityEdit.jsx";
import { exportCSV, exportJSON } from "../../../utils/export.util.jsx";
import { validateEmail, validatePhone, validateStatusChange, validateIdentityDocument } from "../../../utils/businessRule.util.jsx";
import { ALLOWED_EMAIL_DOMAIN, PHONE_REGEX, STATUS_RULES } from "../../../utils/constants.jsx";
import { formatStudentData } from "../../../utils/format.util.jsx";
import { useTranslation } from "react-i18next"

const StudentDetail = ({ departments, student, onSave, onClose, setEditedStudent, editedStudent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [exportType, setExportType] = useState("csv");
  const [errors, setErrors] = useState({});

  const { t } = useTranslation(['student', 'department']);

  if (!student) return null;

  const validate = () => {
    let newErrors = {};
    if (validateEmail(editedStudent.email, ALLOWED_EMAIL_DOMAIN)) newErrors.email = t('validate.validateemail');
    if (validatePhone(editedStudent.phone, PHONE_REGEX)) newErrors.phone = t('validate.validatephone');
    if (validateStatusChange(student.studentStatus, editedStudent.studentStatus, STATUS_RULES)) newErrors.studentStatus = t('validate.validatestatuschange');
    if (validateIdentityDocument(editedStudent.identityDocument?.idNumber)) newErrors.idNumber = t('validate.validateidentification');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setEditedStudent({
      ...student,
      gender: student.gender === true,
      dob: student.dob ? student.dob.split("T")[0] : "", // Format YYYY-MM-DD
      departmentId: student.department?._id || student.departmentId,
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

    // Cập nhật department trước khi lưu
    const selectedDepartment = departments.find(dept => dept._id === editedStudent.departmentId);
    const finalStudent = { ...editedStudent, department: selectedDepartment || {} };

    try {
      await onSave(finalStudent);
      setIsEditing(false);
      setEditedStudent(null);
    } catch (error) {
      console.error(t('error.save student'), error);
      setErrors((prevErrors) => ({ ...prevErrors, general: error.message || t('error.unknown') }));
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

    setEditedStudent((prev) => {
      let updatedStudent = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "gender") {
        updatedStudent.gender = value === "true"; // Chuyển thành boolean
      }

      // Không cập nhật ngay lập tức department
      return updatedStudent;
    });
  };


  return (
    <>
      {!isEditing ? (
        <EntityView
          title={t('student information')}
          entityData={formatStudentData(student)} // Dữ liệu đã format từ `StudentScreen`
          fields={[
            { label: t('id'), key: "studentId" },
            { label: t('full name'), key: "fullname" },
            { label: 'email', key: "email" },
            { label: t('gender'), key: "gender" },
            { label: t('phone number'), key: "phone" },
            { label: t('birthdate'), key: "dob" },
            {
              label: t('department', { ns: 'department' }
              ), key: "departmentName"
            },
            { label: t('program'), key: "program" },
            { label: t('status'), key: "studentStatus" },
            { label: t('address'), key: "fullAddress" },
            { label: t('identification.identification'), key: "identityInfo" },
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
          title={t('edit student')}
          fields={[
            { name: "studentId", label: t('id'), type: "text", disabled: true },
            { name: "fullname", label: t('full name'), type: "text" },
            { name: "dob", label: t('birthdate'), type: "date" },
            {
              name: "gender", label: t('gender'), type: "select",
              value: editedStudent.gender.toString(), // Chuyển thành string để React xử lý
              options: [
                { value: "true", label: t('male') },
                { value: "false", label: t('female') }
              ],
              onChange: handleChange, // Đảm bảo gọi handleChange khi thay đổi
            },
            {
              name: "departmentId",
              label: t('department', { ns: 'department' }),
              type: "select",
              options: departments.map((d) => ({
                value: d._id,
                label: d.departmentName
              }))
            },

            { name: "schoolYear", label: t('school year'), type: "number" },
            {
              name: "program", label: t('program'), type: "select", options: [
                { value: "CQ", label: "CQ" },
                { value: "CLC", label: "CLC" },
                { value: "DTTX", label: "DTTX" },
                { value: "APCS", label: "APCS" },
              ]
            },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: t('phone number'), type: "text" },
            {
              name: "studentStatus", label: t('status'), type: "select", options: [
                { value: "active", label: t('studying') },
                { value: "graduated", label: t('graduated') },
                { value: "dropout", label: t('expelled') },
                { value: "suspended", label: t('suspended') },
              ]
            },
            { name: "nationality", label: t('nationality'), type: "text" },
            { name: "identityDocument.idNumber", label: t('identification.number'), type: "text" },
            { name: "identityDocument.issuedDate", label: t('identification.date of issue'), type: "date" },
            { name: "identityDocument.issuedPlace", label: t('identification.place of issue'), type: "text" },
            { name: "identityDocument.expirationDate", label: t('identification.date of expiry'), type: "date" },
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
