import React, { useState } from "react";
import DataTable from "../DataTable";
import Modal from "react-modal"; // Ensure you have installed react-modal
import Button from "../Button"; // Custom Button component
import "../../styles/Modal.scss"; // Make sure this file exists for custom modal styling

const DepartmentTable = ({ departments, searchTerm, onDelete, onEdit }) => {
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [currentDepartment, setCurrentDepartment] = useState(null); // Department being edited
  const [newDepartmentName, setNewDepartmentName] = useState(""); // New department name

  const columns = [
    { label: "STT", field: "stt", sortable: false },
    { label: "Tên khoa", field: "departmentName", sortable: true }
  ];

  // Filter departments based on the search term
  const filteredDepartments = departments.filter((d) =>
    d.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort departments alphabetically by department name
  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    if (sortOrder === "asc") return a.departmentName.localeCompare(b.departmentName);
    return b.departmentName.localeCompare(a.departmentName);
  });

  // Add a serial number (STT) to the sorted departments
  const finalData = sortedDepartments.map((dept, index) => ({
    ...dept,
    stt: index + 1 // STT always increments from 1 to N
  }));

  // Handle click on the edit button
  const handleEditClick = (department) => {
    setCurrentDepartment(department); // Set the department being edited
    setNewDepartmentName(department.departmentName); // Pre-fill the current name
    setIsModalOpen(true); // Open the modal
  };

  // Handle saving the edited department name
  const handleSaveEdit = () => {
    if (newDepartmentName.trim() === "") {
      alert("Tên khoa không được để trống!");
      return;
    }
    
    // Call the onEdit function to save the changes
    onEdit(currentDepartment._id, { departmentName: newDepartmentName });
    setIsModalOpen(false); // Close the modal
    setCurrentDepartment(null); // Reset the current department
    setNewDepartmentName(""); // Clear the input field
  };

  return (
    <>
      <DataTable 
        columns={columns} 
        data={finalData} 
        initialSortField="departmentName"
        sortOrder={sortOrder}
        onSortChange={setSortOrder} // Handle sort order change
        onEdit={handleEditClick} // Trigger edit modal on click
        onDelete={onDelete} 
      />

      {/* Modal for editing department name */}
      <Modal 
        isOpen={isModalOpen} 
        contentLabel="Sửa tên khoa"
        onRequestClose={() => setIsModalOpen(false)} // Close modal when clicking outside
        className="modal-overlay" // Custom overlay class
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>Sửa tên khoa</h2>
          </div>
          <div className="modal-body">
            <label htmlFor="departmentName">Tên khoa mới:</label>
            <input
              id="departmentName"
              type="text"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="Nhập tên khoa mới"
            />
          </div>
          <div className="modal-footer">
            <Button label="Lưu" variant="success" onClick={handleSaveEdit} />
            <Button label="Hủy" variant="gray" onClick={() => setIsModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DepartmentTable;
