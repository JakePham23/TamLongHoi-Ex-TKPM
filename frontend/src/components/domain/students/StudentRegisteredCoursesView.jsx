// src/components/domain/students/StudentRegisteredCoursesView.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react'; // Added useEffect, useRef
import DataTable from '../../common/DataTable.jsx';
import Button from '../../common/Button.jsx';
import { useTranslation } from 'react-i18next';
import { ExportFactory } from '../../../utils/export/ExportFactory.js';
// Assuming Modal.scss is imported globally or by a parent, or import it here if needed:
// import '../../../../styles/Modal.scss'; // Adjust path as necessary

const StudentRegisteredCoursesView = ({
  student,
  allRegistrations = [],
  allCourses = [],
  allTeachers = [],
  onUnregister,
  onClose
}) => {
  const { t } = useTranslation(['registration', 'course', 'student', 'component']);
  const [exportType, setExportType] = useState('csv');
  const [internalSortField, setInternalSortField] = useState('courseName');
  const [internalSortOrder, setInternalSortOrder] = useState('asc');

  const modalContentRef = useRef(null); // Ref for click-outside logic

  // Effect for modal closing (click outside, Escape key)
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


  const registeredCoursesData = useMemo(() => {
    // ... (your existing registeredCoursesData logic remains the same)
    if (!student?._id || !allRegistrations) return [];
    const studentId = student._id;
    let stt = 0;
    return allRegistrations.reduce((acc, registration) => {
      const studentEntry = registration.registrationStudent?.find(
        rs => (rs.studentId?._id || rs.studentId) === studentId
      );
      if (studentEntry) {
        stt++;
        const courseInfo = allCourses.find(c => c._id === (registration.courseId?._id || registration.courseId));
        const teacherInfo = allTeachers.find(t => t._id === (registration.teacherId?._id || registration.teacherId));
        const scoreInfo = studentEntry.score && studentEntry.score.length > 0 ? studentEntry.score[0] : {};
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
          studentInternalId: studentId,
        });
      }
      return acc;
    }, []);
  }, [student, allRegistrations, allCourses, allTeachers, t]);

  const columns = [
    // ... (your existing columns array remains the same)
    { label: t('no.', { ns: 'component' }), field: 'stt', sortable: false },
    { label: t('courseCode', { ns: 'course' }), field: 'courseCode', sortable: true },
    { label: t('courseName', { ns: 'course' }), field: 'courseName', sortable: true },
    { label: t('credits', { ns: 'course' }), field: 'credits', sortable: true, type: 'number' },
    { label: t('teacherName', { ns: 'teacher' }), field: 'teacherName', sortable: true },
    { label: t('scheduleDay', { ns: 'registration' }), field: 'scheduleDay', sortable: true },
    { label: t('scheduleTime', { ns: 'registration' }), field: 'scheduleTime', sortable: true },
    { label: t('finalScore', { ns: 'registration' }), field: 'finalScore', sortable: true, type: 'number' },
    { label: t('status', { ns: 'registration' }), field: 'statusText', sortable: true },
  ];

  const handleExportGrades = async () => {
    // ... (your existing handleExportGrades logic remains the same)
    if (registeredCoursesData.length === 0) {
      alert(t('component:warning.noDataToExport'));
      return;
    }
    try {
      const exporter = ExportFactory.createStudentGradeSheetExporter(exportType);
      const fileName = `${student.studentId}_${student.fullname}_bang_diem`.replace(/\s+/g, '_');
      await exporter.export(registeredCoursesData, fileName);
    } catch (error) {
      console.error(t('component:error.exportFailed') + ":", error);
      alert(t('component:error.exportFailed') + (error.message ? `: ${error.message}` : ''));
    }
  };

  const handleUnregisterFromCourseClick = (rowData) => {
    // ... (your existing handleUnregisterFromCourseClick logic remains the same)
    if (onUnregister) {
      if (rowData.status !== 'registered') {
        alert(t('registration:error.cannotUnregisterCompletedOrDropped', {status: rowData.statusText}));
        return;
      }
      onUnregister(rowData.registrationId, student._id);
    }
  };


  return (
    <div className="modal-overlay student-courses-modal-overlay"> {/* Use specific overlay class if defined, or generic */}
      <div ref={modalContentRef} className="modal-content student-courses-modal-content"> {/* Use specific content class */}
        <div className="modal-header">
          <h2>{`${t('student:registeredCoursesFor')} ${student?.fullname} (${student?.studentId})`}</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        <div className="modal-body">
          <DataTable
              columns={columns}
              data={registeredCoursesData}
              initialSortField={internalSortField}
              sortOrder={internalSortOrder}
              onSortChange={(field) => {
                  if (field === internalSortField) {
                      setInternalSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  } else {
                      setInternalSortField(field);
                      setInternalSortOrder('asc');
                  }
              }}
              onUnregisterStudent={handleUnregisterFromCourseClick} // DataTable renders unregister button
          />
        </div>

        <div className="modal-footer">
            <div className="export-controls" style={{display: 'flex', gap: '10px', alignItems: 'center', marginRight: 'auto' }}> {/* Pushes export to left */}
                <select value={exportType} onChange={(e) => setExportType(e.target.value)} className="export-select">
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                </select>
                <Button label={t('component:exportList')} onClick={handleExportGrades} />
            </div>
            <Button label={t('component:close')} onClick={onClose} variant="secondary" />
        </div>
      </div>
    </div>
  );
};

export default StudentRegisteredCoursesView;