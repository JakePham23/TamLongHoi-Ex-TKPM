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
  // Hàm loại bỏ dấu tiếng Việt
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Tách dấu khỏi ký tự
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .toLowerCase(); // Chuyển về chữ thường
  };

  useEffect(() => {
    let filtered = students;

    if (selectedDepartment) {
      filtered = filtered.filter((s) => s.department._id === selectedDepartment);
    }

    if (selectedCourse) {
      filtered = filtered.filter((s) => String(s.schoolYear) === String(selectedCourse));
    }

    if (searchTerm.trim()) {
      const normalizedSearch = removeVietnameseTones(searchTerm);
      filtered = filtered.filter((s) =>
        removeVietnameseTones(s.fullname).includes(normalizedSearch)
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

  const handleSave = async () => {
    try {
      await studentService.updateStudent(editedStudent.studentId, editedStudent);
      setStudents((prev) =>
        prev.map((s) => (s.studentId === editedStudent.studentId ? editedStudent : s))
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };
    const [exportType, setExportType] = useState("csv"); // Trạng thái chọn kiểu xuất file
  
  // Hàm xuất toàn bộ sinh viên
  const exportAllStudents = (type) => {
    if (filteredStudents.length === 0) {
      alert("Không có sinh viên để xuất!");
      return;
    }
  
    if (type === "csv") {
      let csvData = [
        [
          "studentId", "fullname", "dob", "gender", "schoolYear", "program",
          "department", "email", "phone", "studentStatus",
          "houseNumber", "street", "ward", "district", "city", "country",
          "houseNumberTemp", "streetTemp", "wardTemp", "districtTemp", "cityTemp", "countryTemp",
          "identityType", "identityIdNumber", "identityIssuedPlace", "identityIssuedDate", "identityExpirationDate",
          "nationality"
        ]
      ];
  
      filteredStudents.forEach((student) => {
        csvData.push([
          student.studentId || "",
          student.fullname || "",
          student.dob || "",
          student.gender ? "true" : "false",
          student.schoolYear || "",
          student.program || "",
          student.department || "",
          student.email || "",
          student.phone || "",
          student.studentStatus || "",
          student.address?.houseNumber || "",
          student.address?.street || "",
          student.address?.ward || "",
          student.address?.district || "",
          student.address?.city || "",
          student.address?.country || "",
          student.addressTemp?.houseNumber || "",
          student.addressTemp?.street || "",
          student.addressTemp?.ward || "",
          student.addressTemp?.district || "",
          student.addressTemp?.city || "",
          student.addressTemp?.country || "",
          student.identityDocument?.type || "",
          student.identityDocument?.idNumber || "",
          student.identityDocument?.issuedPlace || "",
          student.identityDocument?.issuedDate || "",
          student.identityDocument?.expirationDate || "",
          student.nationality || "Việt Nam"
        ]);
      });
  
      const csvContent = "data:text/csv;charset=utf-8," + csvData.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "students_list.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } else {
      const formattedData = filteredStudents.map(student => ({
        studentId: student.studentId || "",
        fullname: student.fullname || "",
        dob: student.dob || "",
        gender: student.gender || false,
        schoolYear: student.schoolYear || "",
        program: student.program || "",
        department: student.department || "",
        email: student.email || "",
        phone: student.phone || "",
        studentStatus: student.studentStatus || "",
        address: {
          houseNumber: student.address?.houseNumber || "",
          street: student.address?.street || "",
          ward: student.address?.ward || "",
          district: student.address?.district || "",
          city: student.address?.city || "",
          country: student.address?.country || "",
        },
        addressTemp: {
          houseNumber: student.addressTemp?.houseNumber || "",
          street: student.addressTemp?.street || "",
          ward: student.addressTemp?.ward || "",
          district: student.addressTemp?.district || "",
          city: student.addressTemp?.city || "",
          country: student.addressTemp?.country || "",
        },
        identityDocument: {
          type: student.identityDocument?.type || "",
          idNumber: student.identityDocument?.idNumber || "",
          issuedPlace: student.identityDocument?.issuedPlace || "",
          issuedDate: student.identityDocument?.issuedDate || "",
          expirationDate: student.identityDocument?.expirationDate || "",
        },
        nationality: student.nationality || "Việt Nam",
      }));
  
      const jsonData = JSON.stringify(formattedData, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "students_list.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
      {selectedStudent && <StudentDetail departments = {departments} student={selectedStudent} isEditing={isEditing} editedStudent={editedStudent} setEditedStudent={setEditedStudent} onSave={handleSave} onEdit={() => setIsEditing(true)} onClose={() => setSelectedStudent(null)} />}
      {isAdding && <StudentForm departments={departments} onSubmit={handleAddStudent} onClose={() => setIsAdding(false)} />}
    
        {/* 📌 Nút xuất danh sách */}
        <div className="export-container">
          <select onChange={(e) => setExportType(e.target.value)} className="export-select">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <Button label="Xuất danh sách" onClick={() => exportAllStudents(exportType)} />
        </div>
    </div>
  );
};

export default StudentScreen;
