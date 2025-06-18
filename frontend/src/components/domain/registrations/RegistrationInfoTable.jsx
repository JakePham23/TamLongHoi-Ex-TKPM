import React, { useState, useMemo } from "react";
import DataTable from "../../common/DataTable.jsx";
import Button from "../../common/Button.jsx";
import { useTranslation } from "react-i18next";
import { ExportFactory } from '../../../utils/export/ExportFactory';

// Import file SCSS dành riêng cho component này
import "../../../styles/RegistrationInfoTable.scss";

const RegistrationInfoTable = ({
  registrationDetails,
  allStudents = [],
  onUnregisterStudent,
    onClose
}) => {
  const { t } = useTranslation(['registration', 'student', 'common']);

  const [sortField, setSortField] = useState("fullname");
  const [sortOrder, setSortOrder] = useState("asc");
  const [exportType, setExportType] = useState("csv");

  // Định nghĩa các cột cho bảng
  const columns = useMemo(() => [
    { label: t('no.'), field: "stt", sortable: false },
    { label: t('studentId', { ns: 'student' }), field: "studentDisplayId", sortable: true },
    { label: t('fullname', { ns: 'student' }), field: "fullname", sortable: true },
    { label: t('processPoint'), field: "processPoint", sortable: true, type: 'number' },
    { label: t('midtermPoint'), field: "midterm", sortable: true, type: 'number' },
    { label: t('finalTermPoint'), field: "finalTerm", sortable: true, type: 'number' },
    { label: t('finalScore'), field: "finalScore", sortable: true, type: 'number' },
    { label: t('status'), field: "statusText", sortable: true },
  ], [t]);

  // Xử lý và kết hợp dữ liệu từ registration và student
  const processedData = useMemo(() => {
    if (!registrationDetails?.registrationStudent) {
      return [];
    }
    return registrationDetails.registrationStudent.map((regStudent, index) => {
      const studentInfo = allStudents.find(
        (s) => s._id === (regStudent.studentId?._id || regStudent.studentId)
      );
      const scoreData = regStudent.score?.[0] || {};
      const notApplicable = t('notApplicableShort', { ns: 'common' });

      return {
        _id: regStudent._id,
        studentDbId: studentInfo?._id,
        stt: index + 1,
        studentDisplayId: studentInfo?.studentId || t('unknown', { ns: 'student' }),
        fullname: studentInfo?.fullname || t('unknown', { ns: 'student' }),
        processPoint: scoreData.processPoint ?? notApplicable,
        midterm: scoreData.midterm ?? notApplicable,
        finalTerm: scoreData.finalTerm ?? notApplicable,
        finalScore: scoreData.finalScore ?? notApplicable,
        status: regStudent.status,
        statusText: t(regStudent.status, { ns: 'registration', defaultValue: regStudent.status }),
        originalStudentData: studentInfo,
        originalScoreData: scoreData,
      };
    });
  }, [registrationDetails, allStudents, t]);

  // Logic sắp xếp dữ liệu
  const sortedData = useMemo(() => {
    if (!sortField) return processedData;
    return [...processedData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const notApplicable = t('notApplicableShort', { ns: 'common' });

      if (valA === notApplicable || valA === undefined || valA === null) return 1;
      if (valB === notApplicable || valB === undefined || valB === null) return -1;

      const columnInfo = columns.find(col => col.field === sortField);
      let comparison = 0;
      if (columnInfo?.type === 'number') {
        comparison = parseFloat(valA) - parseFloat(valB);
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [processedData, sortField, sortOrder, t, columns]);

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const exportClassPoint = async () => {
    if (sortedData.length === 0) {
      alert(t('common:warning.noDataToExport'));
      return;
    }
    try {
      const exporter = ExportFactory.createClassGradeExporter(exportType);
      const courseName = registrationDetails.courseId?.courseName || "class";
      const year = registrationDetails.year || "";
      const semester = registrationDetails.semester || "";
      const fileName = `${courseName.replace(/\s+/g, '_')}_${year}_sem${semester}_grades`;
      await exporter.export(sortedData, fileName); // Pass data and filename
    } catch (error) {
      console.error(t('common:error.exportFailed') + ":", error);
      alert(t('common:error.exportFailed') + (error.message ? `: ${error.message}` : ''));
    }
  };

  const handleUnregisterStudentFromTable = (studentRow) => {
    if (onUnregisterStudent && registrationDetails && window.confirm(t('common:confirm.areYouSureUnregister'))) {
      onUnregisterStudent(registrationDetails._id, studentRow.studentDbId);
    }
  };

  if (!registrationDetails) {
    return <p>{t('noRegistrationDetails', { ns: 'registration' })}</p>;
  }

  return (
    <div className="registration-info-table-container" onClick={onClose}>
      {/* Cấu trúc header được cải tiến để khớp với SCSS */}
      <div className="info-header">
        <h3>
          {t('studentListFor')}: {registrationDetails.courseId?.courseName}
        </h3>
        <div className="info-sub-header">
          {registrationDetails.year} - {t('semester')} {registrationDetails.semester}
        </div>
      </div>
      
      {/* Bọc DataTable trong một div để style (bo góc, đổ bóng, cuộn ngang) */}
      <div className="data-table-wrapper">
        <DataTable
          columns={columns}
          data={sortedData}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onUnregisterStudent={onUnregisterStudent ? handleUnregisterStudentFromTable : undefined}
        />
      </div>

      <div className="export-controls-container">
        <select value={exportType} onChange={(e) => setExportType(e.target.value)} className="export-select">
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
        <Button label={t('exportGradeList')} onClick={exportClassPoint} variant="outline" />
      </div>
    </div>
  );
};

export default RegistrationInfoTable;