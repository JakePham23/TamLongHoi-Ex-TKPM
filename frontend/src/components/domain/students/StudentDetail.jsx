// src/components/domain/students/StudentDetail.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import EntityView from "../../forms/EnityView.jsx";
import EnityEdit from "../../forms/EnityEdit.jsx";
// Đảm bảo đường dẫn import StudentRegisteredCoursesView là chính xác
import StudentRegisteredCoursesView from "./StudentRegisteredCoursesView.jsx";
import { ALLOWED_EMAIL_DOMAIN, PHONE_REGEX, STATUS_RULES } from "../../../utils/constants.js";
import { formatStudentData } from "../../../utils/format.util.js";
import { useTranslation } from "react-i18next";
import { EmailValidationStrategy } from "../../../utils/strategies/EmailValidationStrategy.js";
import { PhoneValidationStrategy } from "../../../utils/strategies/PhoneRegexValidationStrategy.js";
import { StatusChangeValidationStrategy } from "../../../utils/strategies/StatusChangeValidationStrategy.js";
import { IdentityDocumentValidationStrategy } from "../../../utils/strategies/IdentityDocumentValidationStrategy.js";
import { ExportFactory } from '../../../utils/export/ExportFactory.js';

const StudentDetail = ({
  student,
  departments,
  isEditing,
  editedStudentData,
  setEditedStudentData,
  onTriggerEdit,
  onSaveEdits,
  onClose, // Hàm đóng toàn bộ modal/view StudentDetail từ StudentScreen
  allRegistrations,
  allCourses,
  allTeachers,
  onUnregister,
  // onCloseRegister (từ StudentScreen) có thể không cần thiết
  // nếu StudentDetail tự quản lý việc đóng/mở StudentRegisteredCoursesView
}) => {
  const [exportType, setExportType] = useState("csv");
  const [errors, setErrors] = useState({});
  // Đảm bảo các namespace i18n cần thiết được khai báo
  const { t } = useTranslation(['student', 'department', 'common', 'registration', 'course', 'component']);

  // State để quyết định hiển thị view nào: thông tin SV hay danh sách môn đăng ký.
  // Nếu là `null`, hiển thị thông tin SV (EntityView).
  // Nếu là object `student`, hiển thị danh sách môn đăng ký (StudentRegisteredCoursesView).
  const [viewingRegisteredCoursesForStudent, setViewingRegisteredCoursesForStudent] = useState(null);

  useEffect(() => {
    setErrors({});
    // Khi student prop (sinh viên chính) thay đổi hoặc chế độ isEditing thay đổi,
    // reset về trạng thái hiển thị thông tin chi tiết của sinh viên.
    setViewingRegisteredCoursesForStudent(null);
  }, [student, isEditing]);

  // ---- Các hàm xử lý cho form chỉnh sửa ----
  const validateEditedData = () => {
    let newErrors = {};
    if (!editedStudentData) return false;

    if (editedStudentData.email && EmailValidationStrategy(editedStudentData.email, ALLOWED_EMAIL_DOMAIN)) {
      newErrors.email = t('validate.validateemail');
    }
    if (editedStudentData.phone && PhoneValidationStrategy(editedStudentData.phone, PHONE_REGEX)) {
      newErrors.phone = t('validate.validatephone');
    }
    if (student && StatusChangeValidationStrategy(student.studentStatus, editedStudentData.studentStatus, STATUS_RULES)) {
      newErrors.studentStatus = t('validate.validatestatuschange');
    }
    if (editedStudentData.identityDocument?.idNumber && IdentityDocumentValidationStrategy(editedStudentData.identityDocument.idNumber)) {
      newErrors.idNumber = t('validate.validateidentification');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async () => {
    if (!validateEditedData()) return;
    try {
        await onSaveEdits(editedStudentData); // Gọi hàm lưu từ StudentScreen
    } catch (error) {
        console.error(t('student:error.saveStudent'), error);
        setErrors(prev => ({...prev, general: error.message || t('common:error.unknown')}));
    }
  };

  const handleChangeOnEditForm = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');

    setEditedStudentData(prev => {
      if (!prev) return null; // Nên cẩn thận nếu prev có thể là null
      let updated = { ...prev };
      let currentLevel = updated;

      if (keys.length > 1) {
        for (let i = 0; i < keys.length - 1; i++) {
          currentLevel[keys[i]] = { ...(currentLevel[keys[i]] || {}) };
          currentLevel = currentLevel[keys[i]];
        }
        currentLevel[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
      } else {
        updated[name] = type === "checkbox" ? checked : value;
      }

      if (name === "gender") { // Chuyển đổi giá trị gender từ string về boolean
        updated.gender = value === "true";
      }
      return updated;
    });
  };

  // ---- Hàm xử lý xuất chi tiết sinh viên này ----
  const handleExportThisStudent = async () => {
    if (!student) return;
    try {
      const exporter = ExportFactory.createStudentExporter(exportType);
      // Xuất chỉ sinh viên hiện tại, nên truyền vào một mảng chứa một sinh viên
      await exporter.export([student], `${student.studentId}_${student.fullname}_detail`);
    } catch (error) {
      console.error(t('student:error.exportFailed'), error);
      alert(t('student:error.exportFailed') + (error.message ? `: ${error.message}` : ''));
    }
  };

  // ---- Các hàm chuyển đổi view ----
  // Chuyển sang xem danh sách môn đăng ký
  const switchToRegisteredCoursesView = () => {
    setViewingRegisteredCoursesForStudent(student); // Sử dụng student hiện tại đang được xem chi tiết
  };

  // Quay lại xem thông tin chi tiết sinh viên
  const switchToStudentInfoView = () => {
    setViewingRegisteredCoursesForStudent(null);
  };

  // ---- Logic Render ----
  if (!isEditing) {
    // CHẾ ĐỘ XEM (VIEW MODE)
    if (!student) return null; // Không có sinh viên để hiển thị

    if (viewingRegisteredCoursesForStudent) {
      // Nếu state `viewingRegisteredCoursesForStudent` có giá trị (tức là đang muốn xem môn đăng ký)
      return (
        <StudentRegisteredCoursesView
          student={viewingRegisteredCoursesForStudent}
          allRegistrations={allRegistrations}
          allCourses={allCourses}
          allTeachers={allTeachers}
          // onUnregister={onUnregister}
          onClose={switchToStudentInfoView} // Hàm để quay lại view thông tin SV
        />
      );
    } else {
      // Ngược lại, hiển thị thông tin chi tiết của sinh viên (EntityView)
      return (
        <EntityView
          title={t('studentInformation')}
          entityData={formatStudentData(student, t)}
          fields={[
            { label: t('id'), key: "studentId" },
            { label: t('fullName'), key: "fullname" },
            { label: 'email', key: "email" }, // Giả sử 'email' không cần dịch
            { label: t('gender'), key: "gender" },
            { label: t('phoneNumber'), key: "phone" },
            { label: t('birthdate'), key: "dob" },
            { label: t('department', { ns: 'department' }), key: "departmentName" },
            { label: t('program'), key: "program" },
            { label: t('status'), key: "studentStatus" },
            { label: t('address'), key: "fullAddress" },
            { label: t('identification.identification'), key: "identityInfo" },
          ]}
          onClose={onClose} // Prop từ StudentScreen để đóng toàn bộ StudentDetail
          onEdit={() => onTriggerEdit(student)} // Prop từ StudentScreen để vào chế độ edit
          onViewDetail={switchToRegisteredCoursesView} // Hàm cục bộ để chuyển sang xem môn đăng ký
          exportType={exportType}
          setExportType={setExportType}
          onExport={handleExportThisStudent} // Hàm xuất thông tin của sinh viên này
        />
      );
    }
  } else {
    // CHẾ ĐỘ CHỈNH SỬA (EDIT MODE)
    if (!editedStudentData) return null; // Không có dữ liệu để chỉnh sửa
    return (
      <EnityEdit
        title={t('editStudent')}
        fields={[ // Các trường cho form chỉnh sửa
          { name: "studentId", label: t('id'), type: "text", disabled: true },
          { name: "fullname", label: t('fullName'), type: "text" },
          { name: "dob", label: t('birthdate'), type: "date" },
          { name: "gender", label: t('gender'), type: "select",
            options: [ { value: "true", label: t('male') }, { value: "false", label: t('female') } ],
          },
          { name: "departmentId", label: t('department', { ns: 'department' }), type: "select",
            options: departments.map((d) => ({ value: d._id, label: d.departmentName }))
          },
          { name: "schoolYear", label: t('schoolYear'), type: "number" },
          { name: "program", label: t('program'), type: "select", options: [
              { value: "CQ", label: "CQ" }, { value: "CLC", label: "CLC" },
              { value: "DTTX", label: "DTTX" }, { value: "APCS", label: "APCS" },
            ]
          },
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: t('phoneNumber'), type: "text" },
          { name: "studentStatus", label: t('status'), type: "select", options: [
              { value: "active", label: t('studying') },
              { value: "graduated", label: t('graduated') },
              { value: "dropout", label: t('expelled') },
              { value: "suspended", label: t('suspended') },
            ]
          },
          { name: "nationality", label: t('nationality'), type: "text" },
          { name: "identityDocument.type", label: t('identification.type'), type: "select", options: [
              {value: "CCCD", label: t('identification.cccd')},
              {value: "CMND", label: t('identification.cmnd')},
              {value: "Passport", label: t('identification.passport')}
          ]},
          { name: "identityDocument.idNumber", label: t('identification.number'), type: "text" },
          { name: "identityDocument.issuedDate", label: t('identification.dateOfIssue'), type: "date" },
          { name: "identityDocument.issuedPlace", label: t('identification.placeOfIssue'), type: "text" },
          { name: "identityDocument.expirationDate", label: t('identification.dateOfExpiry'), type: "date" },
        ]}
        data={editedStudentData}
        onChange={handleChangeOnEditForm}
        onSave={handleSaveClick}
        onClose={onClose} // Prop từ StudentScreen để đóng toàn bộ StudentDetail
        errors={errors}
      />
    );
  }
};

export default StudentDetail;