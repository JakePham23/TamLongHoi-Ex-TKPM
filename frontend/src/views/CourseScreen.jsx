import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import SearchInput from "../components/common/SearchInput.jsx";
import Button from "../components/common/Button.jsx";
import CourseForm from "../components/domain/courses/CourseForm.jsx";
import CourseTable from "../components/domain/courses/CourseTable.jsx";
import useCourse from "../hooks/useCourse";
import useDepartments from "../hooks/useDepartments";
import "../styles/pages/CourseScreen.scss";
import courseService from "../services/course.service";
import { useTranslation } from "react-i18next";

const CourseScreen = () => {

  const {
    courses,
    fetchCourses,
    loading,
    error
  } = useCourse();

  const { departments = [], fetchDepartments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { t } = useTranslation(['course', 'department', 'component']);

  useEffect(() => {
    console.log("Fetching data..."); // Debug data fetching
    fetchCourses();
    fetchDepartments();
  }, [fetchCourses, fetchDepartments]);

  const handleSaveCourse = async (newCourse) => {
    try {
      await courseService.addCourse(newCourse);
      await fetchCourses();
      setIsAdding(false);
    } catch (error) {
      console.error(t('error. '), error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm(t('error.sure delete course'))) return;
    try {
      await courseService.deleteCourse(courseId);
      await fetchCourses();
    } catch (error) {
      console.error(t('error.delete course') + ":", error);
    }
  };

  const handleEditCourse = async (courseId, courseData) => {
    console.log("Editing course with ID:", courseId, "Data:", courseData); // Debug data editing
    try {
      await courseService.updateCourse(courseId, courseData);
      await fetchCourses();
    } catch (error) {
      console.error(t('error.update course') + ":", error);
    }
  };

  if (loading) {
    return <div className="loading">{t('loading', { ns: 'component' })}...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }
  try {

    return (
      <div className="CourseScreen">
        <h1>{t('list of courses')}</h1>

        <div className="top-bar">
          <SearchInput
            placeholder={t('search course')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            icon={<FaPlus />}
            label={t('add course')}
            variant="gray"
            onClick={() => setIsAdding(true)}
          />
        </div>

        {isAdding && (
          <CourseForm
            onSave={handleSaveCourse}

            departments={departments}
            onClose={() => setIsAdding(false)}

          />
        )}

        <CourseTable
          courses={courses}
          departments={departments}
          searchTerm={searchTerm}
          onDelete={handleDeleteCourse}
          onEdit={handleEditCourse}
        />
      </div>
    );
  } catch (error) {
    console.error(t('error.in coursescreen') + ":", error);
    return <div className="error">{t('error.while loading data')}.</div>;
  }
};

export default CourseScreen; 