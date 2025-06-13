import React, { useState, useMemo } from "react";
import DataTable from "../../common/DataTable.jsx";
import EnityEdit from "../../forms/EnityEdit.jsx";
import { useTranslation } from "react-i18next";
import removeVietnameseTones from "../../../utils/string.util.js";

const DepartmentTable = ({ departments, teachers, searchTerm, onDelete, onEdit }) => {
  const [sortField, setSortField] = useState("departmentName");
  const [sortOrder, setSortOrder] = useState("asc");  
  const [isEditing, setIsEditing] = useState(false);
  const [editedDepartment, setEditedDepartment] = useState(null);
  const [errors, setErrors] = useState({});
  const [filterTeacher] = useState(""); // 👈 filter by head

  const { t } = useTranslation("department");

  const columns = [
    { label: t("no."), field: "stt", sortable: false },
    { label: t("department"), field: "departmentNameTranslated", sortable: true },
    { label: t("establishmentDate"), field: "dateOfEstablishment", sortable: true },
    { label: t("head of department"), field: "headOfDepartmentName", sortable: true },
  ];
  
  const translatedDepartments = useMemo(() => {
    return departments.map((d, index) => ({
        ...d,
        stt: index + 1,
        departmentNameTranslated: t(`department_list.${d._id}.name`, d.departmentName),
    }));
  }, [departments, t]);

  const normalizedSearchTerm = useMemo(() => {
    return removeVietnameseTones(searchTerm.toLowerCase().trim());
  }, [searchTerm]);

  const filteredDepartments = useMemo(() => {
    return translatedDepartments
      .filter((d) => {
        const deptName = removeVietnameseTones((d.departmentNameTranslated || "").toLowerCase());
        return deptName.includes(normalizedSearchTerm);
      })
      .filter((d) => {
        if (!filterTeacher) return true;
        return d.headOfDepartment === filterTeacher;
      });
  }, [translatedDepartments, normalizedSearchTerm, filterTeacher]);


  // 🔃 Sorting logic
  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";

    if (sortField === "dateOfEstablishment") {
      return sortOrder === "asc"
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    }

    return sortOrder === "asc"
      ? aVal.toString().localeCompare(bVal.toString())
      : bVal.toString().localeCompare(aVal.toString());
  });

  // 🧾 Final data with additional display fields
  const finalData = sortedDepartments.map((dept, index) => ({
    ...dept,
    stt: index + 1,
    departmentName: t(`department_list.${dept._id}.name`),
    headOfDepartmentName:
    dept.headOfDepartment?.fullname || t("error.not determined", { ns: "department" }),
    dateOfEstablishment: dept.dateOfEstablishment
      ? new Date(dept.dateOfEstablishment).toLocaleDateString()
      : "",
  }));

  const handleEditClick = (department) => {
    setEditedDepartment({
      ...department,
      dateOfEstablishment: department.dateOfEstablishment?.split("T")[0] || "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editedDepartment.departmentName.trim()) {
      setErrors({ departmentName: t("error.blank department name") });
      return;
    }

    onEdit(editedDepartment._id, {
      departmentName: editedDepartment.departmentName,
      dateOfEstablishment: editedDepartment.dateOfEstablishment,
      headOfDepartment: editedDepartment.headOfDepartment,
    });

    setIsEditing(false);
    setEditedDepartment(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={finalData}
        initialSortField="departmentName"
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onEdit={handleEditClick}
        onDelete={onDelete}
      />
      
      {isEditing && (
        <EnityEdit
          title={t("edit department")}
          fields={[
            { name: "departmentName", label: t("department"), type: "text" },
            { 
              name: "dateOfEstablishment",
              label: t("establishmentDate"), 
              type: "date" 
            },
            {
              name: "headOfDepartment",
              label: t("head of department"),
              type: "select",
              options: teachers.map((t) => ({
                label: t.fullName,
                value: t._id,
              })),
            },
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
