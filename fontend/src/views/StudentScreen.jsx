import React, { useEffect, useState } from "react";
import studentService from "../services/student.service.jsx";
import departmentService from "../services/department.service.jsx";
import StudentTable from "../components/StudentTable.jsx";
import StudentDetail from "../components/StudentDetail.jsx";
import StudentForm from "../components/StudentForm.jsx";
import SearchInput from "../components/SearchInput.jsx";
import Button from "../components/Button.jsx";
import { FaPlus } from "react-icons/fa";
import "../styles/StudentScreen.scss";

const StudentScreen = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Lọc theo khoa
  const [selectedCourse, setSelectedCourse] = useState(""); // Lọc theo khóa

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await studentService.getStudents();
      setStudents(data);
      setFilteredStudents(data);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  // Hàm lọc sinh viên theo khoa, khóa và từ khóa tìm kiếm
  useEffect(() => {
    let filtered = students;

    if (selectedDepartment) {
      filtered = filtered.filter((s) => s.department._id === selectedDepartment);
    }

    if (selectedCourse) {
      filtered = filtered.filter((s) => s.schoolYear == selectedCourse);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [searchTerm, selectedDepartment, selectedCourse, students]);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    await studentService.deleteStudent(studentId);
    setStudents((prev) => prev.filter((s) => s.studentId !== studentId));
  };

  const handleAddStudent = async (student) => {
    const newStudentData = await studentService.addStudent(student);
    setStudents([...students, newStudentData]);
    setIsAdding(false);
  };

  return (
    <div className="StudentScreen">
      <h1>Danh sách sinh viên</h1>
      <div className="top-bar">
        <SearchInput
          placeholder="Tìm kiếm sinh viên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Dropdown chọn khoa */}
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="filterButton">
          <option value="">Tất cả khoa</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.departmentName}
            </option>
          ))}
        </select>

        {/* Dropdown chọn khóa */}
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="filterButton">
          <option value="">Tất cả khóa</option>
          {[2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
            <option key={year} value={year}>
              Khóa {year}
            </option>
          ))}
        </select>

        <Button icon={<FaPlus />} label="Thêm sinh viên" variant="gray" onClick={() => setIsAdding(true)} />
      </div>

      <StudentTable students={filteredStudents} onView={setSelectedStudent} onDelete={handleDelete} />
      {selectedStudent && <StudentDetail student={selectedStudent} isEditing={isEditing} editedStudent={editedStudent} setEditedStudent={setEditedStudent} onSave={() => setIsEditing(false)} onEdit={() => setIsEditing(true)} onClose={() => setSelectedStudent(null)} />}
      {isAdding && <StudentForm departments={departments} onSubmit={handleAddStudent} onClose={() => setIsAdding(false)} />}
    </div>
  );
};

export default StudentScreen;
