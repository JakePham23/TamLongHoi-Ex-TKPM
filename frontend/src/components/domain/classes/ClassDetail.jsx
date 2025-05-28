import React, { useState } from "react";
// import "../../styles/ClassDetail.scss";
import EntityView from "../../forms/EnityView.jsx"
import EntityEdit from "../../forms/EnityEdit.jsx"
import { useTranslation } from "react-i18next";

const ClassDetail = ({ 
  class: cls, 
  courses, 
  teachers, 
  isEditing, 
  editedClass, 
  setEditedClass, 
  onSave, 
  onClose 
}) => {
  const { t } = useTranslation(['class', 'course', 'teacher']);
  const [errors, setErrors] = useState({});

  if (!cls) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClass(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setEditedClass(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    // Validate before saving
    if (!editedClass.courseId || !editedClass.teacherId) {
      setErrors({
        courseId: !editedClass.courseId ? t('error.selectCourse') : null,
        teacherId: !editedClass.teacherId ? t('error.selectTeacher') : null
      });
      return;
    }

    try {
      await onSave(editedClass);
    } catch (error) {
      setErrors({ general: error.message || t('error.saveFailed') });
    }
  };

  return (
    <>
      {!isEditing ? (
        <EntityView
          title={t('classInformation')}
          entityData={{
            classCode: cls.classCode,
            courseName: cls.course.courseName,
            teacherName: cls.teacher.name,
            semester: cls.semester,
            academicYear: cls.academicYear,
            schedule: `${cls.schedule?.dayOfWeek} ${cls.schedule?.time}`,
            room: cls.room,
            maxStudents: cls.maxStudents,
            currentStudents: cls.students?.length || 0
          }}
          fields={[
            { label: t('classCode'), key: "classCode" },
            { label: t('course', { ns: 'course' }), key: "courseName" },
            { label: t('teacher', { ns: 'teacher' }), key: "teacherName" },
            { label: t('semester'), key: "semester" },
            { label: t('academicYear'), key: "academicYear" },
            { label: t('schedule'), key: "schedule" },
            { label: t('room'), key: "room" },
            { label: t('capacity'), key: "capacity", format: (val, data) => 
              `${data.currentStudents}/${data.maxStudents}` 
            }
          ]}
          onClose={onClose}
          onEdit={() => setEditedClass(cls)}
        />
      ) : (
        <EntityEdit
          title={t('editClass')}
          fields={[
            {
              name: "classCode",
              label: t('classCode'),
              type: "text",
              value: editedClass.classCode,
              onChange: handleChange
            },
            {
              name: "courseId",
              label: t('course', { ns: 'course' }),
              type: "select",
              value: editedClass.courseId,
              onChange: handleChange,
              options: courses.map(course => ({
                value: course._id,
                label: course.courseName
              })),
              error: errors.courseId
            },
            {
              name: "teacherId",
              label: t('teacher', { ns: 'teacher' }),
              type: "select",
              value: editedClass.teacherId,
              onChange: handleChange,
              options: teachers.map(teacher => ({
                value: teacher._id,
                label: teacher.name
              })),
              error: errors.teacherId
            },
            {
              name: "semester",
              label: t('semester'),
              type: "select",
              value: editedClass.semester,
              onChange: handleChange,
              options: [
                { value: "1", label: t('semester1') },
                { value: "2", label: t('semester2') },
                { value: "3", label: t('summerSemester') }
              ]
            },
            {
              name: "academicYear",
              label: t('academicYear'),
              type: "text",
              value: editedClass.academicYear,
              onChange: handleChange
            },
            {
              name: "dayOfWeek",
              label: t('dayOfWeek'),
              type: "select",
              value: editedClass.schedule?.dayOfWeek || "",
              onChange: handleScheduleChange,
              options: [
                { value: "Monday", label: t('monday') },
                { value: "Tuesday", label: t('tuesday') },
                { value: "Wednesday", label: t('wednesday') },
                { value: "Thursday", label: t('thursday') },
                { value: "Friday", label: t('friday') },
                { value: "Saturday", label: t('saturday') }
              ]
            },
            {
              name: "time",
              label: t('time'),
              type: "text",
              value: editedClass.schedule?.time || "",
              onChange: handleScheduleChange,
              placeholder: "08:00-10:00"
            },
            {
              name: "room",
              label: t('room'),
              type: "text",
              value: editedClass.room,
              onChange: handleChange
            },
            {
              name: "maxStudents",
              label: t('maxStudents'),
              type: "number",
              value: editedClass.maxStudents,
              onChange: handleChange,
              min: 1
            }
          ]}
          onSave={handleSave}
          onClose={onClose}
          errors={errors}
        />
      )}
    </>
  );
};

export default ClassDetail;