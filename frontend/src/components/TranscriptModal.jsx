import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../Modal.jsx';
import Button from '../Button.jsx';

const TranscriptModal = ({ student, onClose }) => {
  const { t } = useTranslation('class');
  
  // In a real implementation, you would fetch this data from the API
  const mockTranscript = {
    student: {
      id: student?.studentId || '000000',
      name: student?.name || 'John Doe',
      program: student?.program || 'Computer Science'
    },
    courses: [
      {
        courseCode: 'CS101',
        courseName: 'Introduction to Computer Science',
        credits: 3,
        year: '2022-2023',
        semester: '1',
        score: 8.5,
        grade: 'B',
        gradePoint: 3.0
      },
      {
        courseCode: 'MATH101',
        courseName: 'Calculus I',
        credits: 4,
        year: '2022-2023',
        semester: '1',
        score: 9.2,
        grade: 'A',
        gradePoint: 4.0
      },
      {
        courseCode: 'PHYS101',
        courseName: 'Physics I',
        credits: 4,
        year: '2022-2023',
        semester: '2',
        score: 7.8,
        grade: 'C',
        gradePoint: 2.0
      }
    ],
    gpa: 3.0,
    generatedAt: new Date().toISOString()
  };

  return (
    <Modal
      title={`${t('transcript')} - ${student?.name}`}
      onClose={onClose}
      size="lg"
    >
      <div className="TranscriptModal">
        <div className="student-info">
          <h3>{mockTranscript.student.name}</h3>
          <p>
            <strong>{t('studentId')}:</strong> {mockTranscript.student.id}<br />
            <strong>{t('program')}:</strong> {mockTranscript.student.program}
          </p>
        </div>
        
        <table className="transcript-table">
          <thead>
            <tr>
              <th>{t('courseCode')}</th>
              <th>{t('courseName')}</th>
              <th>{t('credits')}</th>
              <th>{t('year')}</th>
              <th>{t('semester')}</th>
              <th>{t('grade')}</th>
              <th>{t('gradePoints')}</th>
            </tr>
          </thead>
          <tbody>
            {mockTranscript.courses.map((course, index) => (
              <tr key={index}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.credits}</td>
                <td>{course.year}</td>
                <td>{course.semester}</td>
                <td>{course.grade} ({course.score})</td>
                <td>{course.gradePoint.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="text-end"><strong>{t('gpa')}:</strong></td>
              <td><strong>{mockTranscript.gpa.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <div className="transcript-footer">
          <p className="generated-date">
            {t('generatedOn')} {new Date(mockTranscript.generatedAt).toLocaleDateString()}
          </p>
          <div className="actions">
            <Button variant="secondary" onClick={onClose}>
              {t('close')}
            </Button>
            <Button variant="primary" onClick={() => alert("PDF generation would be implemented here")}>
              {t('exportPdf')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TranscriptModal;