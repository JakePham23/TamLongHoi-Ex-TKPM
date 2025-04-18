import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import SearchInput from "../components/SearchInput.jsx";
import Button from "../components/Button.jsx";
import RegistrationForm from "../components/Registrations/RegistrationForm.jsx";
import RegistrationTable from "../components/Registrations/RegistrationTable.jsx";
import useRegistration from "../hooks/useRegistration.jsx";
import useCourses from "../hooks/useCourse.jsx";
import useTeachers from "../hooks/useTeachers.jsx";
import useStudents from "../hooks/useStudents.jsx";
import useDepartments from "../hooks/useDepartments.jsx";
import "../styles/pages/RegistrationScreen.scss";
import registrationService from "../services/registration.service.jsx";

const RegistrationScreen = () => {
  const {
    registrations,
    fetchRegistrations,
    loading,
    error
  } = useRegistration();

  const { courses = [], fetchCourses } = useCourses();
  const { teachers = [], fetchTeachers } = useTeachers();
  const { students = [], fetchStudents } = useStudents();
  const { departments = [], fetchDepartments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    console.log("Fetching data..."); // Debug data fetching
    fetchRegistrations();
    fetchCourses();
    fetchDepartments();
    fetchTeachers();
    fetchStudents();
  }, [fetchRegistrations, fetchCourses, fetchDepartments, fetchTeachers, fetchStudents]);


  const handleSaveRegistration = async (newRegistration) => {
    try {
      await registrationService.addRegistration(newRegistration);
      await fetchRegistrations();
      setIsAdding(false);
    } catch (error) {
      console.error("Lỗi khi thêm đăng ký:", error);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm("Bạn có chắc muốn xoá đăng ký này?")) return;
    try {
      await registrationService.deleteRegistration(registrationId);
      await fetchRegistrations();
    } catch (error) {
      console.error("Lỗi khi xoá đăng ký:", error);
    }
  };

  const handleEditRegistration = async (registrationId, registrationData) => {
    try {
      await registrationService.updateRegistration(registrationId, registrationData);
      await fetchRegistrations();
    } catch (error) {
      console.error("Lỗi khi cập nhật đăng ký:", error);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (registrations.length === 0) {
    return (
      <div className="RegistrationScreen">
        <h1>Danh sách các đăng ký môn học</h1>

        <div className="top-bar">
          <SearchInput
            placeholder="Tìm kiếm đăng ký"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            icon={<FaPlus />}
            label="Thêm đăng ký"
            variant="gray"
            onClick={() => setIsAdding(true)}
          />
        </div>

        {isAdding && (
          <RegistrationForm
            onSave={handleSaveRegistration}
            courses={courses}
            teachers={teachers}
            departments={departments}
            onClose={() => setIsAdding(false)}
          />
        )}

        <RegistrationTable />
      </div>
    );
  }

  return (
    <div className="RegistrationScreen">
      <h1>Danh sách các đăng ký môn học</h1>

      <div className="top-bar">
        <SearchInput
          placeholder="Tìm kiếm đăng ký"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          icon={<FaPlus />}
          label="Thêm đăng ký"
          variant="gray"
          onClick={() => setIsAdding(true)}
        />
      </div>

      {isAdding && (
        <RegistrationForm
          onSave={handleSaveRegistration}
          onEdit={handleEditRegistration}
          courses={courses}
          teachers={teachers}
          departments={departments}
          onClose={() => setIsAdding(false)}
        />
      )}

      <RegistrationTable
        registrations={registrations}
        courses={courses}
        teachers={teachers}
        students={students}
        departments={departments}
        searchTerm={searchTerm}
        onDelete={handleDeleteRegistration}
        onEdit={handleEditRegistration}
      />
    </div>
  );
};

export default RegistrationScreen;