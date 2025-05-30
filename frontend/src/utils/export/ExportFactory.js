/* eslint-disable no-unused-vars */

// src/utils/export/ExportFactory.js
import { CsvExportStrategy } from './CsvExportStrategy';
import { JsonExportStrategy } from './JsonExportStrategy';
import { studentCsvHeaders, mapStudentToCsvRow } from './StudentExportConfig';

export class ExportFactory {
  static createStudentExporter(type) {
    switch (type.toLowerCase()) {
      case 'csv':
        return new CsvExportStrategy(studentCsvHeaders, mapStudentToCsvRow);
      case 'json':
        return new JsonExportStrategy();
      default:
        throw new Error(`Unsupported export type: ${type}`);
    }
  }
  
  // Add more factory methods for other entities as needed
  static createDepartmentExporter(type) {
    // Similar implementation with department-specific config
  }
}