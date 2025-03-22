import React, { useEffect, useState } from "react";
import studentService from "../services/student.services.jsx";
import Button from "../components/Button";
import SearchInput from "../components/SearchInput";
import { FaPlus, FaEye, FaTrash, FaTimes } from "react-icons/fa";
import "../styles/StudentScreen.scss";

const StudentScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await studentService.getStudents();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Bạn có chắc muốn xoá sinh viên này?")) return;
    try {
      await studentService.deleteStudent(studentId);
      setStudents(students.filter((student) => student.studentId !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };
  const handleView = (student) => {
    console.log("Selected student:", student);
    setSelectedStudent(student);
  };
  

  const handleUpdate = async () => {
    if (!selectedStudent) return;
    try {
      await studentService.updateStudent(selectedStudent.studentId, selectedStudent);
      setStudents(students.map(s => s.studentId === selectedStudent.studentId ? selectedStudent : s));
      setSelectedStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="StudentScreen">
      <h1>Danh sách sinh viên</h1>

      {/* Thanh công cụ trên */}
      <div className="top-bar">
        <SearchInput placeholder="Tìm kiếm sinh viên" onChange={(e) => console.log(e.target.value)} />
        <Button icon={<FaPlus />} label="Thêm sinh viên" variant="gray" onClick={() => console.log("Thêm sinh viên")} />
      </div>

      {/* Danh sách sinh viên */}
      <table className="student-table">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ và tên</th>
            <th>Khoa</th>
            <th>Khóa</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId}>
              <td>{student.studentId}</td>
              <td>{student.fullname}</td>
              <td>{student.department.departmentName}</td>
              <td>{student.schoolYear}</td>
              <td className="buttonBox">
                <Button icon={<FaEye />} label="Xem" variant="gray" onClick={() => handleView(student)} />
                <Button icon={<FaTrash />} label="Xoá" variant="gray" onClick={() => handleDelete(student.studentId)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hộp hiển thị chi tiết sinh viên */}
      {selectedStudent ? (
       <div className="student-detail-overlay" onClick={(e) => {
        // Kiểm tra nếu click bên ngoài modal thì đóng
        if (e.target.classList.contains("student-detail-overlay")) {
          setSelectedStudent(null);
        }
      }}>
          <div className="student-detail">
            <h2>{selectedStudent.fullname || "Không có dữ liệu"}</h2>
            <p><strong>MSSV:</strong> {selectedStudent.studentId || "N/A"}</p>
            <p><strong>Khoa:</strong> {selectedStudent.department?.departmentName || "N/A"}</p>
            <p><strong>Khóa:</strong> {selectedStudent.schoolYear || "N/A"}</p>
            <p><strong>Email:</strong> {selectedStudent.email || "N/A"}</p>
            <p><strong>SĐT:</strong> {selectedStudent.phone || "N/A"}</p>
            {/* <p><strong>Địa chỉ:</strong> {selectedStudent.address || "N/A"}</p> */}
            <Button label="Sửa" variant="red" onClick={handleUpdate} />
          </div>
        </div>
      ) : null}

    </div>
  );
};

export default StudentScreen;
