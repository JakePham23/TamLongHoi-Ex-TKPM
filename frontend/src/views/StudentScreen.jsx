import React, { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import useStudents from "../hooks/useStudents.js";
import StudentTable from "../components/domain/students/StudentTable";
import StudentDetail from "../components/domain/students/StudentDetail";
import StudentForm from "../components/domain/students/StudentForm";
import SearchInput from "../components/common/SearchInput.jsx";
import Button from "../components/common/Button.jsx";
import "../styles/pages/StudentScreen.scss";
import removeVietnameseTones from "../utils/string.util.js";
import studentService from "../services/student.service.js";
import useDepartments from "../hooks/useDepartments.js";
import { useTranslation } from "react-i18next"
import { ExportFactory } from '../utils/export/ExportFactory.js';
import { ValidationFactory } from '../utils/factories/ValidationFactory.js';
import { STATUS_RULES, ALLOWED_EMAIL_DOMAIN, PHONE_REGEX } from "../utils/constants.js";
const StudentScreen = () => {
  //hooks
  const { students, setStudents, fetchStudents } = useStudents();
  const { departments = [] } = useDepartments(); // Giữ mặc định là mảng rỗng khi không có dữ liệu

  const { t } = useTranslation(['student', 'department']);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [exportType, setExportType] = useState("csv");
    const studentValidator = useMemo(() => {
    return ValidationFactory.createStudentValidator(
      'active', // Default current status
      STATUS_RULES,
      ALLOWED_EMAIL_DOMAIN,
      PHONE_REGEX
    );
  }, []);
  
  // 📌 Lọc sinh viên dựa trên điều kiện tìm kiếm
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesDepartment = selectedDepartment ? s.department._id === selectedDepartment : true;
      const matchesCourse = selectedCourse ? String(s.schoolYear) === String(selectedCourse) : true;
      const matchesSearchTerm = searchTerm
        ? removeVietnameseTones(s.fullname).includes(removeVietnameseTones(searchTerm))
        : true;

      return matchesDepartment && matchesCourse && matchesSearchTerm;
    });
  }, [searchTerm, selectedDepartment, selectedCourse, students]);

    const handleDelete = async (studentId) => {
      if (!window.confirm(t('form.sure delete'))) return;
      await studentService.deleteStudent(studentId);
      setStudents((prev) => prev.filter((s) => s.studentId !== studentId));
    };

    const handleAddStudent = async (student) => {
    const validationErrors = studentValidator.validate(student);
    
    if (validationErrors) {
      alert(t('error.validation_failed') + ': ' + Object.values(validationErrors).join(', '));
      return;
    }

    try {
      const newStudentData = await studentService.addStudent(student);
      setStudents([...students, newStudentData]);
      setIsAdding(false);
    } catch (error) {
      console.error(t('error.add student') + ":", error);
      alert(t('error.add student') + ': ' + error.message);
    }
  };
  const handleSave = async (updatedStudent) => {
    const validationErrors = studentValidator.validate({
      ...updatedStudent,
      currentStatus: selectedStudent?.studentStatus // Pass current status for status validation
    });

    if (validationErrors) {
      alert(t('error.validation_failed') + ': ' + Object.values(validationErrors).join(', '));
      return;
    }

    try {
      await studentService.updateStudent(updatedStudent.studentId, updatedStudent);
      await fetchStudents();
      setStudents(prev => prev.map(s => s.studentId === updatedStudent.studentId ? updatedStudent : s));
      setSelectedStudent(updatedStudent);
      setEditedStudent(null);
      setIsEditing(false);
    } catch (error) {
      console.error(t('error.update student') + ":", error);
      alert(t('error.update student') + ': ' + error.message);
    }
  };

  const exportAllStudents = async () => {
    if (filteredStudents.length === 0) {
      alert(t('no student export'));
      return;
    }

    try {
      const exporter = ExportFactory.createStudentExporter(exportType);
      await exporter.export(filteredStudents, "students_list");
    } catch (error) {
      console.error(t('error.export failed') + ":", error);
      alert(t('error.export failed'));
    }
  };

  return (
    <div className="StudentScreen">
      <h1>{t('list of students')}</h1>
      <div className="top-bar">
        <SearchInput
          placeholder={t('search student')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="filterButton">
          <option value="">{t('all department', { ns: 'department' })}</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
          ))}
        </select>

        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="filterButton">
          <option value="">{t('all school year')}</option>
          {[2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
            <option key={year} value={year}>{t('school year')} {year}</option>
          ))}
        </select>

        <Button icon={<FaPlus />} label={t('add student')} variant="gray" onClick={() => setIsAdding(true)} />
      </div>

      <StudentTable students={filteredStudents} onView={setSelectedStudent} onDelete={handleDelete} />
      {selectedStudent && <StudentDetail departments={departments} student={selectedStudent} isEditing={isEditing} editedStudent={editedStudent} setEditedStudent={setEditedStudent} onSave={handleSave} onEdit={() => setIsEditing(true)} onClose={() => setSelectedStudent(null)} />}
      {isAdding && <StudentForm departments={departments} onSubmit={handleAddStudent} onClose={() => setIsAdding(false)} />}

      <div className="export-container">
        <select onChange={(e) => setExportType(e.target.value)} className="export-select">
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
        <Button label={t('export list')} onClick={exportAllStudents} />
      </div>
    </div>
  );
};

export default StudentScreen;
