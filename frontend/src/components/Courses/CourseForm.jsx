import React, { useEffect, useState } from "react";
import Button from "../Button";
import "../../styles/pages/CourseScreen.scss";

const CourseForm = ({ onSave, course, departments, onClose }) => {
  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    credit: "",
    departmentId: "",
    description: "",
    prerequisite: ""
  });

  useEffect(() => {
    if (course) {
      setFormData({
        courseId: course.courseId || "",
        courseName: course.courseName || "",
        credit: course.credit || "",
        departmentId: course.department?._id || "",
        description: course.description || "",
        prerequisite: course.prerequisite || ""
      });
    } else {
      setFormData({
        courseId: "",
        courseName: "",
        credit: "",
        departmentId: "",
        description: "",
        prerequisite: ""
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "credit" ? parseInt(value) || "" : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.courseId.trim()) {
      alert("Mã môn học không được để trống!");
      return;
    }
    if (!formData.courseName.trim()) {
      alert("Tên môn học không được để trống!");
      return;
    }
    if (!formData.credit || formData.credit < 2) {
      alert("Số tín chỉ phải lớn hơn 1!");
      return;
    }
    if (!formData.departmentId) {
      alert("Vui lòng chọn khoa!");
      return;
    }

    onSave({
      ...course,
      courseId: formData.courseId,
      courseName: formData.courseName,
      credit: formData.credit,
      department: {
        _id: formData.departmentId
      },
      description: formData.description,
      prerequisite: formData.prerequisite
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{course ? "Chỉnh sửa môn học" : "Thêm môn học"}</h2>

        <div className="form-group">
          <label>Mã môn học</label>
          <input
            type="text"
            name="courseId"
            placeholder="VD: CSC0005"
            value={formData.courseId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Tên môn học</label>
          <input
            type="text"
            name="courseName"
            placeholder="Nhập tên môn học"
            value={formData.courseName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Số tín chỉ</label>
          <input
            type="number"
            name="credit"
            placeholder="Nhập số tín chỉ"
            value={formData.credit}
            onChange={handleChange}
            min="2"
          />
        </div>

        <div className="form-group">
          <label>Khoa</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
          >
            <option value="">Chọn khoa</option>
            {departments.map(department => (
              <option key={department._id} value={department._id}>
                {department.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Môn học tiên quyết</label>
          <input
            type="text"
            name="prerequisite"
            placeholder="Mã môn học tiên quyết (nếu có)"
            value={formData.prerequisite}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <input
            type="text"
            name="description"
            placeholder="Mô tả môn học"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="modal-buttons">
          <Button label="Hủy" variant="gray" onClick={onClose} />
          <Button label="Lưu" variant="primary" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default CourseForm;