import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import SearchInput from "../components/SearchInput.jsx";
import Button from "../components/Button.jsx";
import CourseForm from "../components/Courses/CourseForm.jsx";
import CourseTable from "../components/Courses/CourseTable.jsx";
import useCourse from "../hooks/useCourse";
import useDepartments from "../hooks/useDepartments";
import "../styles/pages/CourseScreen.scss";
import courseService from "../services/course.service";

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
      console.error("Lỗi khi thêm môn học:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Bạn có chắc muốn xoá môn học này?")) return;
    try {
      await courseService.deleteCourse(courseId);
      await fetchCourses();
    } catch (error) {
      console.error("Lỗi khi xoá môn học:", error);
    }
  };

  const handleEditCourse = async (courseId, courseData) => {
    console.log("Editing course with ID:", courseId, "Data:", courseData); // Debug data editing
    try {
      await courseService.updateCourse(courseId, courseData);
      await fetchCourses();
    } catch (error) {
      console.error("Lỗi khi cập nhật môn học:", error);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }
  try {

    return (
      <div className="CourseScreen">
        <h1>Danh sách các môn học</h1>

        <div className="top-bar">
          <SearchInput
            placeholder="Tìm kiếm môn học"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            icon={<FaPlus />}
            label="Thêm môn học"
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
    console.error("Lỗi trong CourseScreen:", error);
    return <div className="error">Đã xảy ra lỗi trong quá trình tải dữ liệu.</div>;
  }
};

export default CourseScreen; 