/* eslint-disable no-unused-vars */

// src/utils/export/ExportFactory.js
import { CsvExportStrategy } from './CsvExportStrategy';
import { JsonExportStrategy } from './JsonExportStrategy';

// Student-specific configurations
import { studentCsvHeaders, mapStudentToCsvRow } from './StudentExportConfig'; // Ensure filename is correct

// Class Grade-specific configurations
import {
  classGradeCsvHeaders,
  mapClassGradeToCsvRow,
  mapClassGradeToJsonObject
} from './classGradeExportConfig';

export class ExportFactory {
  static createStudentExporter(type) {
    switch (type.toLowerCase()) {
      case 'csv':
        // CsvExportStrategy constructor likely takes (headers, mapRowFunction)
        // The actual data is passed to its .export(data, fileName) method
        return new CsvExportStrategy(studentCsvHeaders, mapStudentToCsvRow);
      case 'json':
        // JsonExportStrategy constructor might take a map function if JSON structure is specific
        // or it simply stringifies the data passed to its .export() method.
        // If you want students exported as specific JSON objects:
        // return new JsonExportStrategy(mapStudentToJsonObject); // Assuming you define mapStudentToJsonObject
        return new JsonExportStrategy(); // Assumes .export(data) will stringify 'data' as is, or 'data' is already an array of simple objects.
      default:
        console.error(`Unsupported export type for students: ${type}`);
        throw new Error(`Unsupported export type: ${type}`);
    }
  }

  // Factory method for Department Exporter (example placeholder)
  static createDepartmentExporter(type) {
    // Example:
    // const { departmentCsvHeaders, mapDepartmentToCsvRow, mapDepartmentToJsonObject } = require('./DepartmentExportConfig');
    // switch (type.toLowerCase()) {
    //   case 'csv':
    //     return new CsvExportStrategy(departmentCsvHeaders, mapDepartmentToCsvRow);
    //   case 'json':
    //     return new JsonExportStrategy(mapDepartmentToJsonObject); // Or new JsonExportStrategy();
    //   default:
    //     console.error(`Unsupported export type for departments: ${type}`);
    //     throw new Error(`Unsupported export type: ${type}`);
    // }
    console.warn("createDepartmentExporter is not fully implemented.");
    throw new Error(`Department export for type ${type} is not supported yet.`);
  }

  // Factory method for Class Grade Exporter
  static createClassGradeExporter(type) { // Removed 'classGradeData' from parameters
    switch (type.toLowerCase()) {
      case 'csv':
        // CsvExportStrategy is instantiated with headers and a mapping function.
        // Data will be passed to the .export() method.
        return new CsvExportStrategy(classGradeCsvHeaders, mapClassGradeToCsvRow);
      case 'json':
        // JsonExportStrategy can be instantiated with a mapping function
        // that transforms each item of the data array into the desired JSON object structure.
        // The .export(data, fileName) method will then use this mapping function.
        return new JsonExportStrategy(mapClassGradeToJsonObject);
        // If JsonExportStrategy is simpler and should just stringify the data array as is
        // (assuming `sortedData` in RegistrationInfoTable is already an array of suitable objects for JSON):
        // return new JsonExportStrategy();
        // In this case, `mapClassGradeToJsonObject` would not be used by the strategy directly here,
        // but could be used by the calling component to pre-process data if needed before passing to export.
        // Using it with the strategy constructor (as above) is generally cleaner.
      default:
        console.error(`Unsupported export type for class grades: ${type}`);
        throw new Error(`Unsupported export type for class grades: ${type}`);
    }
  }
}