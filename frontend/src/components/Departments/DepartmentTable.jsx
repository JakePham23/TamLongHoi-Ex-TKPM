import React, { useState } from "react";
import DataTable from "../DataTable";
import EnityEdit from "../EnityEdit"; // ✅ Sử dụng EnityEdit
import "../../styles/Modal.scss";
import { useTranslation } from "react-i18next"

const DepartmentTable = ({ departments, searchTerm, onDelete, onEdit }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditing, setIsEditing] = useState(false); // ✅ Quản lý trạng thái chỉnh sửa
  const [editedDepartment, setEditedDepartment] = useState(null); // ✅ Dữ liệu khoa đang chỉnh sửa
  const [errors, setErrors] = useState({});

  const { t } = useTranslation('department');

  const columns = [
    { label: t('no.'), field: "stt", sortable: false },
    { label: t('department'), field: "departmentName", sortable: true }
  ];

  const filteredDepartments = departments.filter((d) =>
    d.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    return sortOrder === "asc"
      ? a.departmentName.localeCompare(b.departmentName)
      : b.departmentName.localeCompare(a.departmentName);
  });

  const finalData = sortedDepartments.map((dept, index) => ({
    ...dept,
    stt: index + 1, // Thêm số thứ tự
    departmentName: t(`department_list.${dept._id}.name`),
  }));

  const handleEditClick = (department) => {
    setEditedDepartment({ ...department }); // ✅ Tạo bản sao để tránh bị tham chiếu
    setIsEditing(true);
  };


  const handleSaveEdit = () => {
    if (!editedDepartment.departmentName.trim()) {
      setErrors({ departmentName: t('error.blank department name') });
      return;
    }

    onEdit(editedDepartment._id, { departmentName: editedDepartment.departmentName });
    setIsEditing(false); // Đóng modal sau khi lưu
    setEditedDepartment(null); // Reset dữ liệu
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={finalData}
        initialSortField="departmentName"
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        onEdit={handleEditClick}
        onDelete={onDelete}
      />

      {/* Sử dụng EnityEdit thay cho Modal */}
      {isEditing && (
        <EnityEdit
          title={t('edit department')}
          fields={[
            { name: "departmentName", label: t('department'), type: "text" },
          ]}
          data={editedDepartment}
          errors={errors}
          onChange={handleChange}
          onSave={handleSaveEdit}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default DepartmentTable;