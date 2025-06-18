import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../common/Button.jsx";
import '../../../styles/RegistrationForm.scss';

const RegistrationForm = ({ onSave, registration, courses, teachers, onClose, academicYear, semester }) => {
  const { t } = useTranslation(['registration', 'class', 'common']);

  // State sẽ lưu cả lessonRange (cho UI) và lessonBegin/End (cho backend)
  const getInitialFormData = () => ({
    year: academicYear || "",
    semester: semester || "",
    courseId: "",
    teacherId: "",
    maxStudent: "",
    schedule: {
      dayOfWeek: "",
      lessonRange: "", // Dùng để điều khiển giá trị của dropdown
      lessonBegin: "", // Dữ liệu gửi về backend
      lessonEnd: ""      // Dữ liệu gửi về backend
    }
  });

  const [formData, setFormData] = useState(getInitialFormData());

  // Điền dữ liệu vào form khi ở chế độ chỉnh sửa
  useEffect(() => {
    if (registration) {
      const schedule = registration.schedule || {};
      // Tái tạo lại chuỗi lessonRange từ lessonBegin và lessonEnd để hiển thị đúng trên dropdown
      const lessonRangeValue = schedule.lessonBegin && schedule.lessonEnd
          ? `${schedule.lessonBegin}->${schedule.lessonEnd}`
          : "";

      setFormData({
        year: registration.year || "",
        semester: registration.semester || "",
        courseId: registration.courseId?._id || registration.courseId || "",
        teacherId: registration.teacherId?._id || registration.teacherId || "",
        maxStudent: registration.maxStudent || "",
        schedule: {
          dayOfWeek: schedule.dayOfWeek || "",
          lessonRange: lessonRangeValue,
          lessonBegin: schedule.lessonBegin || "",
          lessonEnd: schedule.lessonEnd || ""
        },
      });
    } else {
      // Reset form với các giá trị mặc định khi tạo mới
      setFormData({
        ...getInitialFormData(),
        year: academicYear,
        semester: semester,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registration, academicYear, semester]);

  // Xử lý thay đổi cho các input thông thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumberField = ["maxStudent", "semester"].includes(name);
    const processedValue = isNumberField ? parseInt(value, 10) || "" : value;

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  // Xử lý thay đổi cho các input trong schedule
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;

    // Khi người dùng chọn từ dropdown `lessonRange`
    if (name === 'lessonRange') {
      if (!value) { // Nếu chọn mục rỗng
        setFormData(prev => ({
          ...prev,
          schedule: { ...prev.schedule, lessonRange: "", lessonBegin: "", lessonEnd: "" }
        }));
        return;
      }

      // Tách chuỗi giá trị (ví dụ: "1->3.5") thành 2 số [1, 3.5]
      const [begin, end] = value.split('->').map(Number);

      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          lessonRange: value,  // Cập nhật giá trị cho dropdown
          lessonBegin: begin,  // Cập nhật giá trị sẽ gửi đi
          lessonEnd: end       // Cập nhật giá trị sẽ gửi đi
        }
      }));
    } else { // Xử lý cho các trường khác như dayOfWeek
      setFormData(prev => ({
        ...prev,
        schedule: { ...prev.schedule, [name]: value }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.schedule.lessonRange) {
      alert(t('pleaseSelect') + " " + t('lessonRange') + "!");
      return;
    }
    // ... bạn có thể thêm các validation khác ở đây ...

    // Tạo dữ liệu gửi đi khớp với schema của backend
    // Sẽ không chứa `lessonRange`
    const submissionData = {
      year: formData.year,
      semester: formData.semester,
      courseId: formData.courseId,
      teacherId: formData.teacherId,
      maxStudent: formData.maxStudent,
      schedule: {
        dayOfWeek: formData.schedule.dayOfWeek,
        lessonBegin: formData.schedule.lessonBegin,
        lessonEnd: formData.schedule.lessonEnd
      }
    };

    if (registration?._id) {
      submissionData._id = registration._id;
    }

    onSave(submissionData);
    onClose();
  };

  const daysOfWeek = [
    { value: "MON", label: t('monday', {ns: 'class'}) }, { value: "TUE", label: t('tuesday', {ns: 'class'}) },
    { value: "WED", label: t('wednesday', {ns: 'class'}) }, { value: "THU", label: t('thursday', {ns: 'class'}) },
    { value: "FRI", label: t('friday', {ns: 'class'})}, { value: "SAT", label: t('saturday', {ns: 'class'}) },
    { value: "SUN", label: t('sunday', {ns: 'class'}) }
  ];

  // Danh sách khoảng tiết học để người dùng dễ chọn
  const lessonRanges = [
    { value: "1->3.5", label: "Tiết 1 -> 3.5 (07:30 - 09:35)" },
    { value: "3.5->5", label: "Tiết 3.5 -> 5 (09:45 - 11:40)" },
    { value: "6->8.5", label: "Tiết 6 -> 8.5 (12:40 - 14:45)" },
    { value: "8.5->10", label: "Tiết 8.5 -> 10 (14:55 - 16:50)" },
    { value: "1->4", label: "Tiết 1 -> 4 (07:30 - 10:50)" },
    { value: "1->5", label: "Tiết 1 -> 5 (07:30 - 11:40)" },
    { value: "2->5", label: "Tiết 2 -> 5 (08:20 - 11:40)" },
    { value: "5->9", label: "Tiết 5 -> 9 (10:50 - 16:00)" },
    { value: "5->10", label: "Tiết 5 -> 10 (10:50 - 16:50)" },
  ];

  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -2; i <= 2; i++) {
      const year = currentYear + i;
      years.push(`${year}-${year + 1}`);
    }
    return years;
  };

  return (
      <form onSubmit={handleSubmit} className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{registration ? t('editRegistration') : t('addRegistration')}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>{t('academicYear')} *</label>
              <select name="year" value={formData.year} onChange={handleChange} required>
                <option value="">{t('common:pleaseSelect')}...</option>
                {generateAcademicYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('semester')} *</label>
              <select name="semester" value={formData.semester} onChange={handleChange} required>
                <option value="">{t('selectSemester')}</option>
                <option value="1">{t('semester1')}</option>
                <option value="2">{t('semester2')}</option>
                <option value="3">{t('summerSemester')}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('course')} *</label>
              <select name="courseId" value={formData.courseId} onChange={handleChange} required>
                <option value="">{t('selectCourse', {ns: 'class'})}</option>
                {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.courseName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('teacher')} *</label>
              <select name="teacherId" value={formData.teacherId} onChange={handleChange} required>
                <option value="">{t('selectTeacher', {ns: 'class'})}</option>
                {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>{teacher.fullname}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{t('maxStudent')} *</label>
            <input
                type="number" name="maxStudent"
                placeholder={t('maxStudent') + " " + t('greaterThan0', {ns: 'class'})}
                value={formData.maxStudent} onChange={handleChange}
                min="1" required
            />
          </div>

          <div className="schedule-section">
            <h3>{t('classSchedule')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{t('dayOfWeek')} *</label>
                <select name="dayOfWeek" value={formData.schedule.dayOfWeek} onChange={handleScheduleChange} required>
                  <option value="">{t('selectDay')}</option>
                  {daysOfWeek.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('lessonRange')} *</label>
                <select
                    name="lessonRange"
                    value={formData.schedule.lessonRange}
                    onChange={handleScheduleChange}
                    required
                >
                  <option value="">{t('selectLessonRange')}</option>
                  {lessonRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-buttons">
            <Button label={t('common:save')} variant="primary" type="submit" />
          </div>
        </div>
      </form>
  );
};

export default RegistrationForm;