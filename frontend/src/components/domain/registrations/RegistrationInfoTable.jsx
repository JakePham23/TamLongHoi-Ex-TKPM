import React, { useState, useMemo } from "react";
import DataTable from "../../common/DataTable.jsx";
import Button from "../../common/Button.jsx"; // Make sure Button is imported if not already
import "../../../styles/Modal.scss";
import { useTranslation } from "react-i18next";
import { ExportFactory } from '../../../utils/export/ExportFactory'; // Corrected path assuming utils is sibling to components/hooks

const RegistrationInfoTable = ({
  registrationDetails,
  allStudents = [],
  onUnregisterStudent,
}) => {
  const { t } = useTranslation(['registration', 'student', 'common']); // Added 'common' for general terms

  const [sortField, setSortField] = useState("fullname");
  const [sortOrder, setSortOrder] = useState("asc");
  const [exportType, setExportType] = useState("csv"); // Default export type

  const columns = [
    { label: t('no.', { ns: 'registration' }), field: "stt", sortable: false },
    { label: t('studentId', { ns: 'student' }), field: "studentDisplayId", sortable: true },
    { label: t('fullname', { ns: 'student' }), field: "fullname", sortable: true },
    { label: t('processPoint', { ns: 'registration' }), field: "processPoint", sortable: true, type: 'number' },
    { label: t('midtermPoint', { ns: 'registration' }), field: "midterm", sortable: true, type: 'number' },
    { label: t('finalTermPoint', { ns: 'registration' }), field: "finalTerm", sortable: true, type: 'number' },
    { label: t('finalScore', { ns: 'registration' }), field: "finalScore", sortable: true, type: 'number' },
    { label: t('status', { ns: 'registration' }), field: "statusText", sortable: true },
  ];

  const processedData = useMemo(() => {
    // ... (your existing processedData logic remains the same)
    if (!registrationDetails || !registrationDetails.registrationStudent) {
      return [];
    }
    return registrationDetails.registrationStudent.map((regStudent, index) => {
      const studentInfo = allStudents.find(
        (s) => s._id === (regStudent.studentId?._id || regStudent.studentId)
      );
      const scoreData = regStudent.score && regStudent.score.length > 0 ? regStudent.score[0] : {};
      const notApplicable = t('notApplicableShort', { ns: 'registration' });

      return {
        _id: regStudent._id,
        studentDbId: studentInfo?._id,
        stt: index + 1,
        studentDisplayId: studentInfo?.studentId || t('unknown', { ns: 'student' }),
        fullname: studentInfo?.fullname || t('unknown', { ns: 'student' }),
        processPoint: scoreData?.processPoint ?? notApplicable,
        midterm: scoreData?.midterm ?? notApplicable,
        finalTerm: scoreData?.finalTerm ?? notApplicable,
        finalScore: scoreData?.finalScore ?? notApplicable,
        status: regStudent.status,
        statusText: regStudent.status ? t(regStudent.status, { ns: 'registration', defaultValue: regStudent.status }) : t('unknown', { ns: 'registration' }),
        originalStudentData: studentInfo,
        originalScoreData: scoreData,
      };
    });
  }, [registrationDetails, allStudents, t]);

  const sortedData = useMemo(() => {
    // ... (your existing sortedData logic remains the same)
    if (!sortField) return processedData;
    return [...processedData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const notApplicable = t('notApplicableShort', { ns: 'registration' });
      if (valA === notApplicable || valA === undefined || valA === null) return 1;
      if (valB === notApplicable || valB === undefined || valB === null) return -1;
      const columnType = columns.find(col => col.field === sortField)?.type;
      let comparison = 0;
      if (columnType === 'number') {
        comparison = parseFloat(valA) - parseFloat(valB);
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else {
        if (valA < valB) comparison = -1;
        if (valA > valB) comparison = 1;
      }
      return sortOrder === "asc" ? comparison : comparison * -1;
    });
  }, [processedData, sortField, sortOrder, t, columns]);

  const handleSortChange = (field) => {
    // ... (your existing handleSortChange logic remains the same)
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const exportClassPoint = async () => {
    if (sortedData.length === 0) { // Use sortedData (or processedData) for the check
      alert(t('common:warning.noDataToExport')); // Using a more generic translation key
      return;
    }

    try {
      // Use the specific factory method for class grades
      const exporter = ExportFactory.createClassGradeExporter(exportType, sortedData);

      // Generate a dynamic filename
      const courseName = registrationDetails.courseId?.courseName || "class";
      const year = registrationDetails.year || "";
      const semester = registrationDetails.semester || "";
      const fileName = `${courseName.replace(/\s+/g, '_')}_${year}_sem${semester}_grades`;

      await exporter.export(fileName); // Pass the desired filename (without extension)
    } catch (error) {
      console.error(t('common:error.exportFailed') + ":", error);
      alert(t('common:error.exportFailed') + (error.message ? `: ${error.message}` : ''));
    }
  };

  if (!registrationDetails) {
    return <p>{t('noRegistrationDetails', { ns: 'registration' })}</p>;
  }

  const handleUnregisterStudentFromTable = (studentRow) => {
    // ... (your existing handleUnregisterStudentFromTable logic)
    if (onUnregisterStudent && registrationDetails) {
      onUnregisterStudent(registrationDetails._id, studentRow.studentDbId, registrationDetails);
    }
  };

  return (
    <div className="registration-info-table-container">
      <h3>
        {t('studentListFor', { ns: 'registration' })}: {registrationDetails.courseId?.courseName} ({registrationDetails.year} - {t('semester', { ns: 'registration' })} {registrationDetails.semester})
      </h3>
      
      <DataTable
        columns={columns}
        data={sortedData}
        initialSortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        // Pass the onUnregisterStudent handler if DataTable is responsible for rendering the unregister button
        // Ensure your DataTable component is set up to call this with the correct 'studentRow' data
        onUnregisterStudent={onUnregisterStudent ? handleUnregisterStudentFromTable : undefined}
      />

      <div className="export-controls-container"> {/* Changed class for clarity */}
        <select value={exportType} onChange={(e) => setExportType(e.target.value)} className="export-select">
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
          {/* Add other types like 'xlsx' if your factory and strategies support them */}
        </select>
        <Button label={t('exportGradeList', {ns: 'registration'})} onClick={exportClassPoint} variant="outline" />
      </div>
    </div>
  );
};

export default RegistrationInfoTable;