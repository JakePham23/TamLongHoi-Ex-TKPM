import React, { useEffect, useState } from "react";
import Button from "../Button";
import "../../styles/pages/DepartmentScreen.scss";

const DepartmentForm = ({ onSave, department, onClose }) => {
    const [name, setName] = useState("");

    useEffect(() => {
        setName(department ? department.departmentName : "");
    }, [department]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return alert("Tên khoa không được để trống!");

        onSave({ ...department, departmentName: name });
        setName("");
        onClose(); // Đóng form sau khi lưu
    };

    return (
        <form onSubmit={handleSubmit} className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Thêm khoa</h2>
                <input
                    type="text"
                    placeholder="Nhập tên khoa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="modal-buttons">
                    <Button label="Hủy" variant="gray" onClick={onClose} />
                    <Button label="Lưu" variant="primary" type="submit" />
                </div>           
            </div>
        </form>
    );
};

export default DepartmentForm;
