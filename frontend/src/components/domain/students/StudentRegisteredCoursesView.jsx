import React, { useState, useMemo, useEffect, useRef } from 'react';
import DataTable from '../../common/DataTable.jsx';
import Button from '../../common/Button.jsx';
import { useTranslation } from 'react-i18next';
import { ExportFactory } from '../../../utils/export/ExportFactory.js';
import '../../../styles/StudentRegisteredCoursesView.scss'; // Import file SCSS

const StudentRegisteredCoursesView = ({
  student,
  allRegistrations = [],
  allCourses = [],
  allTeachers = [],
  onUnregister,
  onClose
}) => {
  const { t } = useTranslation(['registration', 'course', 'student', 'common', 'component', 'class']);
  const [exportType, setExportType] = useState('csv');
  const [internalSortField, setInternalSortField] = useState('courseName');
  const [internalSortOrder, setInternalSortOrder] = useState('asc');

  const modalContentRef = useRef(null);

  // useEffect để xử lý việc đóng modal khi click ra ngoài hoặc nhấn phím Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  // Logic xử lý và tạo dữ liệu cho bảng
  const registeredCoursesData = useMemo(() => {
    if (!student?._id || !allRegistrations) return [];
    let stt = 0;
    return allRegistrations.reduce((acc, registration) => {
      const studentEntry = registration.registrationStudent?.find(
        rs => (rs.studentId?._id || rs.studentId) === student._id
      );
      if (studentEntry) {
        stt++;
        const courseInfo = allCourses.find(c => c._id === (registration.courseId?._id || registration.courseId));
        const teacherInfo = allTeachers.find(t => t._id === (registration.teacherId?._id || registration.teacherId));
        const scoreInfo = studentEntry.score?.[0] || {};
        acc.push({
          _id: `${registration._id}-${studentEntry._id}`,
          stt,
          courseCode: courseInfo?.courseId || 'N/A',
          courseName: courseInfo?.courseName || t('unknown', { ns: 'course' }),
          credits: courseInfo?.credits ?? 'N/A',
          teacherName: teacherInfo?.fullname || t('unknown', { ns: 'teacher' }),
          scheduleDay: registration.schedule?.dayOfWeek || 'N/A',
          scheduleTime: registration.schedule?.time || 'N/A',
          finalScore: scoreInfo?.finalScore ?? 'N/A',
          status: studentEntry.status,
          statusText: t(studentEntry.status, { ns: 'registration', defaultValue: studentEntry.status }),
          registrationId: registration._id,
          studentInternalId: student._id,
        });
      }
      return acc;
    }, []);
  }, [student, allRegistrations, allCourses, allTeachers, t]);

  // Định nghĩa các cột của bảng
  const columns = useMemo(() => [
    { label: t('no.'), field: 'stt', sortable: false },
    { label: t('course id', { ns: 'course' }), field: 'courseCode', sortable: true },
    { label: t('course name', { ns: 'course' }), field: 'courseName', sortable: true },
    { label: t('number of credits', { ns: 'course' }), field: 'credits', sortable: true, type: 'number' },
    { label: t('teacherName', { ns: 'teacher' }), field: 'teacherName', sortable: true },
    { label: t('dayOfWeek', { ns: 'registration' }), field: 'scheduleDay', sortable: true },
    { label: t('classTime', { ns: 'registration' }), field: 'scheduleTime', sortable: true },
    { label: t('finalScore', { ns: 'registration' }), field: 'finalScore', sortable: true, type: 'number' },
    { label: t('status', { ns: 'registration' }), field: 'statusText', sortable: true },
  ], [t]);
  
  // Logic sắp xếp dữ liệu
  const sortedData = useMemo(() => {
    return [...registeredCoursesData].sort((a, b) => {
      const valA = a[internalSortField];
      const valB = b[internalSortField];

      const columnInfo = columns.find(col => col.field === internalSortField);
      let comparison = 0;

      if (valA === 'N/A') return 1;
      if (valB === 'N/A') return -1;
      
      if (columnInfo?.type === 'number') {
        comparison = parseFloat(valA) - parseFloat(valB);
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      return internalSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [registeredCoursesData, internalSortField, internalSortOrder, columns]);

  const handleSortChange = (field) => {
    if (field === internalSortField) {
      setInternalSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setInternalSortField(field);
      setInternalSortOrder('asc');
    }
  };

  const handleExportGrades = async () => {
    if (sortedData.length === 0) {
      alert(t('component:warning.noDataToExport'));
      return;
    }
    try {
      const exporter = ExportFactory.createStudentGradeSheetExporter(exportType);
      const fileName = `${student.studentId}_${student.fullname}_bang_diem`.replace(/\s+/g, '_');
      await exporter.export(sortedData, fileName);
    } catch (error) {
      console.error(t('component:error.exportFailed') + ":", error);
      alert(t('component:error.exportFailed') + (error.message ? `: ${error.message}` : ''));
    }
  };

  const handleUnregisterFromCourseClick = (rowData) => {
    if (onUnregister) {
      if (rowData.status !== 'registered') {
        alert(t('registration:error.cannotUnregisterCompletedOrDropped', {status: rowData.statusText}));
        return;
      }
      if (window.confirm(t('common:confirm.areYouSureUnregister'))) {
        onUnregister(rowData.registrationId, student._id);
      }
    }
  };


  return (
    <div className="modal-overlay student-courses-modal-overlay">
      <div ref={modalContentRef} className="student-courses-modal-content">
        <div className="modal-header">
          <h2>{`${t('student:registeredCoursesFor')} ${student?.fullname} (${student?.studentId})`}</h2>
        </div>

        <div className="modal-body">
          {/* QUAN TRỌNG: Bọc DataTable trong div này để bật cuộn ngang */}
          <div className="data-table-container">
            <DataTable
                columns={columns}
                data={sortedData}
                sortField={internalSortField}
                sortOrder={internalSortOrder}
                onSortChange={handleSortChange}
                onUnregisterStudent={handleUnregisterFromCourseClick}
            />
          </div>
        </div>

        <div className="modal-footer">
            <div className="export-controls">
                <select value={exportType} onChange={(e) => setExportType(e.target.value)} className="export-select">
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                </select>
                <Button label={t('component:exportList')} onClick={handleExportGrades} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegisteredCoursesView;