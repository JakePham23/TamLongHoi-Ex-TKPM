import React from "react";
import DataTable from "../../common/DataTable.jsx";
import { useTranslation } from "react-i18next";

const ClassTable = ({ classes, onView, onEdit, onDelete }) => {
  const { t } = useTranslation(['class', 'course', 'teacher']);

  const columns = [
    { label: t('classCode'), field: "classCode", sortable: true },
    { label: t('course name', { ns: 'course' }), field: "course.courseName", sortable: true },
    { label: t('teacher name', { ns: 'teacher' }), field: "teacher.name", sortable: true },
    { label: t('semester'), field: "semester", sortable: true },
    { label: t('academicYear'), field: "academicYear", sortable: true },
    { label: t('schedule'), field: "schedule", sortable: false }
  ];

  const formatSchedule = (schedule) => {
    if (!schedule) return '';
    return `${schedule.dayOfWeek} ${schedule.time}`;
  };

  const data = classes.map(cls => ({
    ...cls,
    schedule: formatSchedule(cls.schedule)
  }));

  return (
    <DataTable
      columns={columns}
      data={data}
      initialSortField="classCode"
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default ClassTable;