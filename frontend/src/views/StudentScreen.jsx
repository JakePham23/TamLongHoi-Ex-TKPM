import React, { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import useStudents from "../hooks/useStudents";
import StudentTable from "../components/Students/StudentTable";
import StudentDetail from "../components/Students/StudentDetail";
import StudentForm from "../components/Students/StudentForm";
import SearchInput from "../components/SearchInput";
import Button from "../components/Button";
import "../styles/pages/StudentScreen.scss";
import removeVietnameseTones from "../utils/string.util";
import studentService from "../services/student.service";
import useDepartments from "../hooks/useDepartments";
import { exportCSV, exportJSON } from "../utils/export.util"; // Import export functions
import { useTranslation } from "react-i18next"

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
    const newStudentData = await studentService.addStudent(student);
    setStudents([...students, newStudentData]);
    setIsAdding(false);
  };

  const handleSave = async (updatedStudent) => {
    try {
      await studentService.updateStudent(updatedStudent.studentId, updatedStudent);

      // // Cập nhật danh sách sinh viên ngay lập tức
      // setStudents((prev) =>
      //   prev.map((s) => (s.studentId === updatedStudent.studentId ? updatedStudent : s))
      // );

      // setSelectedStudent(updatedStudent); // Cập nhật lại selectedStudent để phản ánh ngay lập tức
      await fetchStudents(); // Lấy lại danh sách sinh viên từ server
      setStudents((prev) => prev.map((s) => (s.studentId === updatedStudent.studentId ? updatedStudent : s)));
      setSelectedStudent(updatedStudent); // Cập nhật lại selectedStudent để phản ánh ngay lập tức
      setEditedStudent(null); // Đặt lại editedStudent
      setIsEditing(false);
    } catch (error) {
      console.error(t('error.update student') + ":", error);
    }
  };


  const exportAllStudents = () => {
    if (filteredStudents.length === 0) {
      alert(t('no student export'));
      return;
    }

    if (exportType === "csv") {
      exportCSV(filteredStudents, "students_list");
    } else {
      exportJSON(filteredStudents, "students_list");
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
