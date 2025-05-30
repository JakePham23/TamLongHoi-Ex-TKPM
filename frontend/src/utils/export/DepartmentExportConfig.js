// // src/utils/export/departmentExportConfig.js
// export const departmentCsvHeaders = [
//   "Mã khoa", "Tên khoa", "Mô tả", "Ngày thành lập"
// ];

// export const mapDepartmentToCsvRow = (department) => [
//   department._id,
//   department.departmentName,
//   department.description,
//   new Date(department.establishedDate).toLocaleDateString("vi-VN")
// ];

// // In ExportFactory.js
// import { departmentCsvHeaders, mapDepartmentToCsvRow } from './departmentExportConfig';

// static createDepartmentExporter(type) {
//   switch (type.toLowerCase()) {
//     case 'csv':
//       return new CsvExportStrategy(departmentCsvHeaders, mapDepartmentToCsvRow);
//     case 'json':
//       return new JsonExportStrategy();
//     default:
//       throw new Error(`Unsupported export type: ${type}`);
//   }
// }

// // In DepartmentScreen.js
// const exportDepartments = async () => {
//   const exporter = ExportFactory.createDepartmentExporter(exportType);
//   await exporter.export(departments, "departments_list");
// };