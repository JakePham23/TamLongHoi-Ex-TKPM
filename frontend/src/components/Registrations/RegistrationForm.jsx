import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import "../../styles/pages/RegistrationScreen.scss";

// Hàm chuyển đổi tiết học sang giờ
const convertLessonToTime = (lessonRange) => {
  const [start, end] = lessonRange.split("->").map(s => parseFloat(s.trim()));
  
  const timeMap = {
    1: { start: "07:30", end: "08:20" },
    2: { start: "08:20", end: "09:10" },
    3: { start: "09:10", end: "10:00" },
    3.5: { start: "09:35", end: "09:45" }, // Giờ nghỉ giữa tiết 3 và 4
    4: { start: "10:00", end: "10:50" },
    5: { start: "10:50", end: "11:40" },
    6: { start: "12:40", end: "13:30" },
    7: { start: "13:30", end: "14:20" },
    8: { start: "14:20", end: "15:10" },
    8.5: { start: "14:45", end: "14:55" }, // Giờ nghỉ giữa tiết 8 và 9
    9: { start: "15:10", end: "16:00" },
    10: { start: "16:00", end: "16:50" }
  };

  // Xử lý các khoảng đặc biệt
  if (start === 1 && end === 3.5) return { startTime: "07:30", endTime: "09:35" };
  if (start === 3.5 && end === 5) return { startTime: "09:45", endTime: "11:40" };
  if (start === 6 && end === 8.5) return { startTime: "12:40", endTime: "14:45" };
  if (start === 8.5 && end === 10) return { startTime: "14:55", endTime: "16:50" };

  // Xử lý trường hợp thông thường
  const startTime = timeMap[start]?.start || "";
  const endTime = timeMap[end]?.end || "";
  
  return { startTime, endTime };
};

const RegistrationForm = ({ onSave, registration, courses, teachers, onClose }) => {
  const { t } = useTranslation('registration');

  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    courseId: "",
    teacherId: "",
    maxStudent: "",
    schedule: {
      dayOfWeek: "",
      lessonRange: "",
      startTime: "",
      endTime: "",
      displayTime: ""
    }
  });

  useEffect(() => {
    if (registration) {
      setFormData({
        year: registration.year || "",
        semester: registration.semester || "",
        courseId: registration.courseId || "",
        teacherId: registration.teacherId || "",
        maxStudent: registration.maxStudent || "",
        schedule: registration.schedule || {
          dayOfWeek: "",
          lessonRange: "",
          startTime: "",
          endTime: "",
          displayTime: ""
        }
      });
    }
  }, [registration]);

  // Cập nhật thời gian khi lessonRange thay đổi
  useEffect(() => {
    if (formData.schedule.lessonRange) {
      const { startTime, endTime } = convertLessonToTime(formData.schedule.lessonRange);
      const displayTime = startTime && endTime ? `${startTime} - ${endTime}` : "";
      
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          startTime,
          endTime,
          displayTime
        }
      }));
    }
  }, [formData.schedule.lessonRange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "maxStudent" ? parseInt(value) || "" : value
    }));
  };

  const handleScheduleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.year.trim()) {
      alert(t('year') + " " + t('cannotBeEmpty'));
      return;
    }
    if (!formData.semester.trim()) {
      alert(t('semester') + " " + t('cannotBeEmpty'));
      return;
    }
    if (!formData.courseId) {
      alert(t('pleaseSelect') + " " + t('course') + "!");
      return;
    }
    if (!formData.teacherId) {
      alert(t('pleaseSelect') + " " + t('teacher') + "!");
      return;
    }
    if (!formData.maxStudent || formData.maxStudent < 1) {
      alert(t('maxStudent') + " " + t('mustBeGreaterThanZero'));
      return;
    }
    if (!formData.schedule.dayOfWeek) {
      alert(t('pleaseSelect') + " " + t('dayOfWeek') + "!");
      return;
    }
    if (!formData.schedule.lessonRange) {
      alert(t('pleaseSelect') + " " + t('lessonRange') + "!");
      return;
    }

    // Chuẩn bị dữ liệu để gửi lên backend
    const submissionData = {
      ...registration,
      year: formData.year,
      semester: formData.semester,
      courseId: formData.courseId,
      teacherId: formData.teacherId,
      maxStudent: formData.maxStudent,
      schedule: {
        dayOfWeek: formData.schedule.dayOfWeek,
        lessonRange: formData.schedule.lessonRange,
        startTime: formData.schedule.startTime,
        endTime: formData.schedule.endTime
        // displayTime không cần gửi lên backend, chỉ dùng cho hiển thị
      }
    };

    onSave(submissionData);
    onClose();
  };

  // Danh sách ngày trong tuần
  const daysOfWeek = [
    { value: "MON", label: t('monday') },
    { value: "TUE", label: t('tuesday') },
    { value: "WED", label: t('wednesday') },
    { value: "THU", label: t('thursday') },
    { value: "FRI", label: t('friday') },
    { value: "SAT", label: t('saturday') },
    { value: "SUN", label: t('sunday') }
  ];

  // Các khoảng tiết học phổ biến
  const lessonRanges = [
    { value: "1->3.5", label: "1 -> 3.5 (07:30 - 09:35)" },
    { value: "3.5->5", label: "3.5 -> 5 (09:45 - 11:40)" },
    { value: "6->8.5", label: "6 -> 8.5 (12:40 - 14:45)" },
    { value: "8.5->10", label: "8.5 -> 10 (14:55 - 16:50)" },
    { value: "1->4", label: "1 -> 4 (07:30 - 10:50)" },
    { value: "1->5", label: "1 -> 5 (07:30 - 11:40)" },
    { value: "2->5", label: "2 -> 5 (08:20 - 11:40)" },
    { value: "5->9", label: "5 -> 9 (11:40 - 16:00)" },
    { value: "5->10", label: "5 -> 10 (11:40 - 16:50)" },
  ];

  return (
    <form onSubmit={handleSubmit} className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{registration ? t('editRegistration') : t('addRegistration')}</h2>

        <div className="form-row">
          <div className="form-group">
            <label>{t('year')}</label>
            <input
              type="number"
              name="year"
              placeholder={t('year') + " (e.g. 2023)"}
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('semester')}</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="">{t('selectSemester')}</option>
              <option value="1">{t('semester1')}</option>
              <option value="2">{t('semester2')}</option>
              <option value="3">{t('summerSemester')}</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t('course')}</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
            >
              <option value="">{t('selectCourse')}</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t('teacher')}</label>
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              required
            >
              <option value="">{t('selectTeacher')}</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.fullname}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>{t('maxStudent')}</label>
          <input
            type="number"
            name="maxStudent"
            placeholder={t('maxStudent') + " (greater than 0)"}
            value={formData.maxStudent}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="schedule-section">
          <h3>{t('classSchedule')}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>{t('dayOfWeek')}</label>
              <select
                value={formData.schedule.dayOfWeek}
                onChange={(e) => handleScheduleChange('dayOfWeek', e.target.value)}
                required
              >
                <option value="">{t('selectDay')}</option>
                {daysOfWeek.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('lessonRange')}</label>
              <select
                value={formData.schedule.lessonRange}
                onChange={(e) => handleScheduleChange('lessonRange', e.target.value)}
                required
              >
                <option value="">{t('selectLessonRange')}</option>
                {lessonRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{t('classTime')}</label>
            <input
              type="text"
              value={formData.schedule.displayTime}
              readOnly
              className="time-display"
            />
          </div>
        </div>

        <div className="modal-buttons">
          <Button label={t('cancel')} variant="gray" onClick={onClose} />
          <Button label={t('save')} variant="primary" type="submit" />
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;