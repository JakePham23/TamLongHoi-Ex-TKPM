import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import SearchInput from "../components/common/SearchInput.jsx";
import Button from "../components/common/Button.jsx";
import DepartmentForm from "../components/domain/departments/DepartmentForm.jsx";
import DepartmentTable from "../components/domain/departments/DepartmentTable.jsx";
import useDepartments from "../hooks/useDepartments.js";
import "../styles/pages/DepartmentScreen.scss";
import departmentService from "../services/department.service.js";
import { useTranslation } from "react-i18next"
import useTeachers from "../hooks/useTeachers.js";
const DepartmentScreen = () => {
  const { departments, fetchDepartments } = useDepartments();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const {teachers} = useTeachers();
  // const [selectedDepartment, setSelectedDepartment] = useState(null); // Manage selected department state

  const { t } = useTranslation('department');

  const handleSaveDepartment = async (newDepartment) => {
    try {
      await departmentService.addDepartment(newDepartment);
      fetchDepartments();
      setIsAdding(false);
    } catch (error) {
      console.error(t('error.add department'), error);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm(t('form.confirm delete department'))) return;
    try {
      await departmentService.deleteDepartment(departmentId);
      fetchDepartments();
    } catch (error) {
      console.error(t('error.delete department'), error);
    }
  };

  const handleEditDepartment = async (departmentId, departmentData) => {
    try {
      console.log(departmentData);
      await departmentService.updateDepartment(departmentId, departmentData);
      fetchDepartments();
    } catch (error) {
      console.error(t('error.update department'), error);
    }
  };

  return (
    <div className="DepartmentScreen">
      <h1>{t('list of faculties')}</h1>
      <div className="top-bar">
        <SearchInput
          placeholder={t('search department')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button icon={<FaPlus />} label={t('add department')} variant="gray" onClick={() => setIsAdding(true)} />
      </div>

      {isAdding && <DepartmentForm onSave={handleSaveDepartment} onClose={() => setIsAdding(false)} />}



      {/* Display selected department details */}
      <DepartmentTable
        departments={departments}
        teachers={teachers}
        searchTerm={searchTerm}
        onDelete={handleDeleteDepartment}
        onEdit={handleEditDepartment}
      />
    </div>
  );
};

export default DepartmentScreen;
