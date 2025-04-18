import React, { useEffect, useState } from "react";
import Button from "../Button";
import "../../styles/pages/Registration.scss";

const RegistrationForm = ({ onSave, registration, courses, departments, teachers, onClose }) => {
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    courseId: "",
    teacherId: "",
    maxStudent: "",
    description: "",
    schedule: { dayOfWeek: "", time: "" }
  });

  useEffect(() => {
    if (registration) {
      setFormData({
        year: registration.year || "",
        semester: registration.semester || "",
        courseId: registration.courseId || "",
        teacherId: registration.teacherId || "",
        maxStudent: registration.maxStudent || "",
        description: registration.description || "",
        schedule: registration.schedule || { dayOfWeek: "", time: "" }
      });
    }
  }, [registration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "maxStudent" ? parseInt(value) || "" : value
    }));
  };

  const handleScheduleChange = (dayOrTime, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayOrTime]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.year.trim()) {
      alert("Năm không được để trống!");
      return;
    }
    if (!formData.semester.trim()) {
      alert("Học kỳ không được để trống!");
      return;
    }
    if (!formData.courseId) {
      alert("Vui lòng chọn môn học!");
      return;
    }
    if (!formData.teacherId) {
      alert("Vui lòng chọn giáo viên!");
      return;
    }
    if (!formData.maxStudent || formData.maxStudent < 1) {
      alert("Số sinh viên tối đa phải lớn hơn 0!");
      return;
    }

    onSave({
      ...registration,
      year: formData.year,
      semester: formData.semester,
      courseId: formData.courseId,
      teacherId: formData.teacherId,
      maxStudent: formData.maxStudent,
      description: formData.description,
      schedule: formData.schedule
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{registration ? "Chỉnh sửa đăng ký" : "Thêm đăng ký"}</h2>

        <div className="form-group">
          <label>Năm</label>
          <input
            type="number"
            name="year"
            placeholder="VD: 2023"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Học kỳ</label>
          <input
            type="number"
            name="semester"
            placeholder="VD: 1 hoặc 2"
            value={formData.semester}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Môn học</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn môn học</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Giáo viên</label>
          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn giáo viên</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullname}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Số sinh viên tối đa</label>
          <input
            type="number"
            name="maxStudent"
            placeholder="Nhập số sinh viên tối đa"
            value={formData.maxStudent}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <input
            type="text"
            name="description"
            placeholder="Mô tả đăng ký"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Lịch học</label>
          <input
            type="text"
            placeholder="Ngày trong tuần"
            value={formData.schedule.dayOfWeek}
            onChange={(e) => handleScheduleChange('dayOfWeek', e.target.value)}
          />
          <input
            style={{ marginTop: "10px" }}
            type="text"
            placeholder="Thời gian"
            value={formData.schedule.time}
            onChange={(e) => handleScheduleChange('time', e.target.value)}
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

export default RegistrationForm;