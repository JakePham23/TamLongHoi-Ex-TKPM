import React, { useEffect, useState } from "react";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  useEffect(() => {
    fetch("http://localhost:4000/api/v1/students")
      .then((res) => res.json())
      .then((data) => setStudents(data.data))
      .catch((error) => console.error("Lỗi lấy dữ liệu:", error));
  }, []);

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedStudent),
      });
      setStudents(students.map(s => s.studentId === selectedStudent.studentId ? selectedStudent : s));
      setSelectedStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">List of Students</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Action #1</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId} className="border">
              <td className="border p-2">{student.fullname}</td>
              <td className="border p-2">{student.email}</td>
              <td className="border p-2">{student.department.departmentName}</td>
              <td className="border p-2 space-x-2">
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(student.studentId)}
                >
                  Delete
                </button>
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => setSelectedStudent(student)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-2">Student Details</h2>
            <label>Name:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.fullname} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, fullname: e.target.value })}
              />
            </label>
            <label>Email:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.email} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
              />
            </label>
            <label>Department:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.department.departmentName} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, department: e.target.value })}
              />
            </label>
            <label>gender:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.gender} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, gender: e.target.value })}
              />
            </label>
            <label>schoolYear:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.schoolYear} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, schoolYear: e.target.value })}
              />
            </label>
            <label>phone:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.phone} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
              />
            </label>
            <label>program:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.gender} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, program: e.target.value })}
              />
            </label>
            <label>status:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.studentStatus} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, status: e.target.value })}
              />
            </label>
            <label>address:
              <input 
                type="text" 
                className="border w-full p-2 rounded mt-1"
                value={selectedStudent.address} 
                onChange={(e) => setSelectedStudent({ ...selectedStudent, address: e.target.value })}
              />
            </label>
            <div className="mt-4 flex justify-between">
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleUpdate}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
