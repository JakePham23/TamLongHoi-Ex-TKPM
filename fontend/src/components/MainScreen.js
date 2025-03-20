import React, { useEffect, useState } from "react";
import "./MainScreen.css";

const MainScreen = ({ view }) => {
  const [isEditing, setIsEditing, isAdding, setIsAdding] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleDelete = async (studentId) => {
    if (!window.confirm("Bạn có chắc muốn xoá sinh viên này?")) return;
    try {
      await fetch(`http://localhost:4000/api/v1/deleteStudent/${studentId}`, {
        method: "DELETE",
      });
      setStudents(students.filter((student) => student.studentId !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:4000/api/v1/updateStudent/${selectedStudent.studentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedStudent),
      });
  
      // Cập nhật danh sách sinh viên sau khi sửa
      setStudents(students.map(s => s.studentId === selectedStudent.studentId ? selectedStudent : s));
  
      // Thoát chế độ chỉnh sửa
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };
  
  useEffect(() => {
    if (view === "students") {
      fetch("http://localhost:4000/api/v1/students")
        .then((res) => res.json())
        .then((data) => setStudents(data.data))
        .catch((error) => console.error("Lỗi lấy dữ liệu:", error));
    }
  }, [view]);

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Mở modal thêm sinh viên
  const handleAddStudent = () => {
    setSelectedStudent({
      studentId: "",
      fullname: "",
      email: "",
      dob: "",
      gender: "",
      address: { city: "" },
      studentStatus: "",
      department: { departmentName: "" },
      imageUrl: "",
    });
    setIsAdding(true);
    setShowModal(true);
  };

  // Lưu sinh viên mới
  const handleSaveStudent = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/addStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedStudent),
      });

      const newStudent = await response.json();
      setStudents([...students, newStudent]); // Cập nhật danh sách sinh viên
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
    }
  };
  const filteredStudents = students.filter((student) =>
    student.fullname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-screen">
      {view === "dashboard" && <h1>Dashboard</h1>}

      {view === "students" && (
        <div>
          <h1>Danh sách sinh viên</h1>

          <div className="student-actions">
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-box"
            />
            <button className="add-button">+ Thêm học sinh</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Khoa</th>
                <th>Tình trạng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentId}</td>
                      <td>{student.fullname}</td>
                      <td>{student.email}</td>
                      <td>{student.department.departmentName}</td>
                      <td>{student.studentStatus}</td>
                      <td>
                      <button className="detail-button" onClick={() => setSelectedStudent(student)}>Xem</button>
                      <button className="delete-button" onClick={() => handleDelete(student.studentId)}>Xoá</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedStudent && (
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="student-header">
            <div className="student-avatar-container">
              <img
                src={selectedStudent.imageUrl || "/default-avatar.png"}
                alt="Avatar"
                className="student-avatar"
              />
            </div>

            <div className="student-name-container">
              {isEditing ? (
                <input
                  type="text"
                  value={selectedStudent.fullname}
                  onChange={(e) => setSelectedStudent({...selectedStudent, fullname: e.target.value})}
                />
              ) : (
                <h2 className="student-name">{selectedStudent.fullname}</h2>
              )}
            </div>
          </div>

          <div className="student-info">
            <p><strong>Ngày sinh:</strong> 
              {isEditing ? (
                <input
                  type="date"
                  value={selectedStudent.dob}
                  onChange={(e) => setSelectedStudent({...selectedStudent, dob: e.target.value})}
                />
              ) : (
                new Date(selectedStudent.dob).toLocaleDateString()
              )}
            </p>

            <p><strong>Giới tính:</strong> 
              {isEditing ? (
                <select
                  value={selectedStudent.gender}
                  onChange={(e) => setSelectedStudent({...selectedStudent, gender: e.target.value})}
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              ) : (
                selectedStudent.gender ? "Nam" : "Nữ"
              )}
            </p>

            <p><strong>Email:</strong> 
              {isEditing ? (
                <input
                  type="email"
                  value={selectedStudent.email}
                  onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})}
                />
              ) : (
                selectedStudent.email
              )}
            </p>

            <p><strong>Địa chỉ:</strong> 
              {isEditing ? (
                <input
                  type="text"
                  value={selectedStudent.address?.city}
                  onChange={(e) => setSelectedStudent({
                    ...selectedStudent,
                    address: { ...selectedStudent.address, city: e.target.value }
                  })}
                />
              ) : (
                selectedStudent.address?.city
              )}
            </p>

            <p><strong>Tình trạng:</strong> 
              {isEditing ? (
                <input
                  type="text"
                  value={selectedStudent.studentStatus}
                  onChange={(e) => setSelectedStudent({...selectedStudent, studentStatus: e.target.value})}
                />
              ) : (
                selectedStudent.studentStatus
              )}
            </p>

            <p><strong>Khoa:</strong> 
              {isEditing ? (
                <input
                  type="text"
                  value={selectedStudent.department.departmentName}
                  onChange={(e) => setSelectedStudent({
                    ...selectedStudent,
                    department: { ...selectedStudent.department, departmentName: e.target.value }
                  })}
                />
              ) : (
                selectedStudent.department.departmentName
              )}
            </p>
          </div>

          {/* Nút Lưu / Sửa / Đóng */}
          <div className="modal-buttons">
            {isEditing ? (
              <button className="save-button" onClick={handleUpdate}>Lưu</button>
            ) : (
              <button className="edit-button" onClick={() => setIsEditing(true)}>Sửa</button>
            )}
            <button className="close-button" onClick={handleCloseModal}>Đóng</button>
          </div>
        </div>
      </div>
    )}



        </div>
      )}
    </div>
  );
};

export default MainScreen;