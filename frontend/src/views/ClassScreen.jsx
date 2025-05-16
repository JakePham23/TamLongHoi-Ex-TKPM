import React, { useState, useMemo } from "react";
import { FaPlus, FaFileExport } from "react-icons/fa";
import useClasses from "../hooks/useClasses";
import ClassTable from "../components/Classes/ClassTable";
import ClassDetail from "../components/Classes/ClassDetail";
import ClassForm from "../components/Classes/ClassForm";
import SearchInput from "../components/SearchInput";
import Button from "../components/Button";
import "../styles/pages/ClassScreen.scss";
import removeVietnameseTones from "../utils/string.util";
import classService from "../services/class.service";
import useCourses from "../hooks/useCourses";
import useTeachers from "../hooks/useTeachers";
import { exportCSV, exportJSON } from "../utils/export.util";
import { useTranslation } from "react-i18next";
import Select from "../components/Select";

const ClassScreen = () => {
  // Hooks
  const { classes, setClasses, fetchClasses } = useClasses();
  const { courses = [] } = useCourses();
  const { teachers = [] } = useTeachers();
  
  const { t } = useTranslation(['class', 'course', 'teacher']);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClass, setEditedClass] = useState(null);
  const [exportType, setExportType] = useState("csv");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Filter classes based on search criteria
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesCourse = selectedCourse ? cls.course._id === selectedCourse : true;
      const matchesTeacher = selectedTeacher ? cls.teacher._id === selectedTeacher : true;
      const matchesSemester = selectedSemester ? cls.semester === selectedSemester : true;
      const matchesYear = selectedYear ? cls.academicYear === selectedYear : true;
      const matchesSearchTerm = searchTerm
        ? removeVietnameseTones(cls.classCode).includes(removeVietnameseTones(searchTerm)) ||
          removeVietnameseTones(cls.course.courseName).includes(removeVietnameseTones(searchTerm))
        : true;

      return matchesCourse && matchesTeacher && matchesSemester && matchesYear && matchesSearchTerm;
    });
  }, [searchTerm, selectedCourse, selectedTeacher, selectedSemester, selectedYear, classes]);

  // Generate academic years
  const academicYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      years.push({
        value: `${year}-${year + 1}`,
        label: `${year}-${year + 1}`
      });
    }
    return years;
  }, []);

  // Semester options
  const semesters = [
    { value: "1", label: t('semester1') },
    { value: "2", label: t('semester2') },
    { value: "3", label: t('summerSemester') }
  ];

  // Handlers
  const handleDelete = async (classId) => {
    if (!window.confirm(t('confirmDelete'))) return;
    await classService.deleteClass(classId);
    setClasses((prev) => prev.filter((c) => c._id !== classId));
    setSelectedClass(null);
  };

  const handleAddClass = async (newClass) => {
    const addedClass = await classService.addClass(newClass);
    setClasses([...classes, addedClass]);
    setIsAdding(false);
  };

  const handleSave = async (updatedClass) => {
    try {
      await classService.updateClass(updatedClass._id, updatedClass);
      await fetchClasses(); // Refresh the list
      setSelectedClass(updatedClass);
      setEditedClass(null);
      setIsEditing(false);
    } catch (error) {
      console.error(t('error.updateClass'), error);
    }
  };

  const handleEdit = (cls) => {
    setEditedClass({
      ...cls,
      courseId: cls.course._id,
      teacherId: cls.teacher._id
    });
    setIsEditing(true);
  };

  const exportAllClasses = () => {
    if (filteredClasses.length === 0) {
      alert(t('noClassExport'));
      return;
    }

    if (exportType === "csv") {
      exportCSV(filteredClasses, "classes_list");
    } else {
      exportJSON(filteredClasses, "classes_list");
    }
  };

  return (
    <div className="ClassScreen">
      <h1>{t('classManagement')}</h1>
      
      <div className="top-bar">
        <SearchInput
          placeholder={t('searchClass')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          placeholder={t('allCourses')}
          options={[
            { value: "", label: t('allCourses') },
            ...courses.map(course => ({
              value: course._id,
              label: course.courseName
            }))
          ]}
        />

        <Select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          placeholder={t('allTeachers')}
          options={[
            { value: "", label: t('allTeachers') },
            ...teachers.map(teacher => ({
              value: teacher._id,
              label: teacher.name
            }))
          ]}
        />

        <Select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          placeholder={t('allSemesters')}
          options={[
            { value: "", label: t('allSemesters') },
            ...semesters
          ]}
        />

        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          placeholder={t('allYears')}
          options={[
            { value: "", label: t('allYears') },
            ...academicYears
          ]}
        />

        <Button 
          icon={<FaPlus />} 
          label={t('addClass')} 
          variant="gray" 
          onClick={() => setIsAdding(true)} 
        />
      </div>

      <ClassTable 
        classes={filteredClasses} 
        onView={setSelectedClass} 
        onEdit={handleEdit}
        onDelete={handleDelete} 
      />

      {selectedClass && (
        <ClassDetail 
          class={selectedClass} 
          courses={courses}
          teachers={teachers}
          isEditing={isEditing}
          editedClass={editedClass}
          setEditedClass={setEditedClass}
          onSave={handleSave}
          onEdit={() => handleEdit(selectedClass)}
          onClose={() => {
            setSelectedClass(null);
            setIsEditing(false);
          }}
        />
      )}

      {isAdding && (
        <ClassForm 
          courses={courses}
          teachers={teachers}
          onSubmit={handleAddClass}
          onClose={() => setIsAdding(false)}
        />
      )}

      <div className="export-container">
        <Select
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
          options={[
            { value: "csv", label: "CSV" },
            { value: "json", label: "JSON" }
          ]}
        />
        <Button 
          label={t('exportList')} 
          onClick={exportAllClasses} 
          icon={<FaFileExport />}
        />
      </div>
    </div>
  );
};

export default ClassScreen;