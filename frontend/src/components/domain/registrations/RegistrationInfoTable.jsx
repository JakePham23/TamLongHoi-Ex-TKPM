import React, { useState, useMemo } from "react";
import DataTable from "../../common/DataTable.jsx"; // Assuming path is correct
// import EnityEdit from "../../forms/EnityEdit.jsx"; // If you need to edit scores later
import "../../../styles/Modal.scss"; // Assuming path is correct
import { useTranslation } from "react-i18next";

const RegistrationInfoTable = ({
  registrationDetails, // Expects a single registration object
  allStudents = [],       // Expects an array of all student objects for lookup
  // onEditScore, // Placeholder if you want to add score editing
  // onUpdateStatus, // Placeholder if you want to update student status in registration
}) => {
  const { t } = useTranslation(['registration', 'student']); // Added 'student' namespace

  // Sort state
  const [sortField, setSortField] = useState("fullname"); // Default sort field
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order

  // Columns for the DataTable
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
    if (!registrationDetails || !registrationDetails.registrationStudent) {
      return [];
    }

    return registrationDetails.registrationStudent.map((regStudent, index) => {
      const studentInfo = allStudents.find(
        (s) => s._id === (regStudent.studentId?._id || regStudent.studentId)
      );
      // Assuming the first score object in the array is the one to display
      const scoreData = regStudent.score && regStudent.score.length > 0 ? regStudent.score[0] : {};
      const notApplicable = t('notApplicableShort', { ns: 'registration' }); // e.g., "N/A"

      return {
        _id: regStudent._id, // Internal ID of the registrationStudent entry
        studentDbId: studentInfo?._id, // Student's database _id
        stt: index + 1,
        studentDisplayId: studentInfo?.studentId || t('unknown', { ns: 'student' }),
        fullname: studentInfo?.fullname || t('unknown', { ns: 'student' }),
        processPoint: scoreData?.processPoint ?? notApplicable,
        midterm: scoreData?.midterm ?? notApplicable,
        finalTerm: scoreData?.finalTerm ?? notApplicable,
        finalScore: scoreData?.finalScore ?? notApplicable,
        status: regStudent.status, // raw status
        statusText: regStudent.status ? t(regStudent.status, { ns: 'registration', defaultValue: regStudent.status }) : t('unknown', { ns: 'registration' }),
        // You might want to pass original data for editing purposes
        originalStudentData: studentInfo,
        originalScoreData: scoreData,
      };
    });
  }, [registrationDetails, allStudents, t]);

  const sortedData = useMemo(() => {
    if (!sortField) return processedData;

    return [...processedData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const notApplicable = t('notApplicableShort', { ns: 'registration' });

      // Handle "N/A" or undefined values to sort them consistently (e.g., at the end)
      if (valA === notApplicable || valA === undefined || valA === null) return 1;
      if (valB === notApplicable || valB === undefined || valB === null) return -1;
      
      // Determine column type for proper sorting
      const columnType = columns.find(col => col.field === sortField)?.type;

      let comparison = 0;
      if (columnType === 'number') {
        comparison = parseFloat(valA) - parseFloat(valB);
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else {
        // Fallback for other types or mixed types
        if (valA < valB) comparison = -1;
        if (valA > valB) comparison = 1;
      }

      return sortOrder === "asc" ? comparison : comparison * -1;
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

  // Example handler if you add score editing
  // const handleEditScoreClick = (studentRegData) => {
  //   console.log("Edit scores for:", studentRegData);
  //   // setCurrentlyEditingStudent(studentRegData);
  //   // setIsScoreEditModalOpen(true);
  //   if(onEditScore) onEditScore(studentRegData);
  // };

  if (!registrationDetails) {
    return <p>{t('noRegistrationDetails', { ns: 'registration' })}</p>;
  }

  return (
    <div className="registration-info-table-container">
      {/* Optional: Display some header info about the registration itself */}
      <h3>
        {t('studentListFor', { ns: 'registration' })}: {registrationDetails.courseId?.courseName} ({registrationDetails.year} - {t('semester', { ns: 'registration' })} {registrationDetails.semester})
      </h3>
      
      <DataTable
        columns={columns}
        data={sortedData}
        // Assuming DataTable uses 'key' for current sort field and 'order' for direction
        // And onSortChange is called with the field key when a header is clicked.
        // Adapt these props based on your actual DataTable implementation.
        // If your DataTable's onSortChange works like the example (only sets order),
        // you might need a different approach or enhance DataTable.
        // For this example, I'm assuming onSortChange provides the field.
        initialSortField={sortField} // Or how DataTable consumes this
        sortOrder={sortOrder}         // Or how DataTable consumes this
        onSortChange={handleSortChange} // Expects to be called with field key
        // To match the example where onSortChange just sets order, and field is implicit:
        // onSortChange={setSortOrder} // And ensure DataTable knows current sortField
      />

      {/* Modal for editing scores would go here if implemented */}
      {/* {isScoreEditModalOpen && (
        <ScoreEditModal
          studentData={currentlyEditingStudent}
          onSave={handleSaveScores}
          onClose={() => setIsScoreEditModalOpen(false)}
        />
      )} */}
    </div>
  );
};

export default RegistrationInfoTable;