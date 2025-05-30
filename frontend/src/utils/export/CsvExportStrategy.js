/* eslint-disable no-unused-vars */

// src/utils/export/CsvExportStrategy.js
import { ExportStrategy } from './ExportStrategy';

export class CsvExportStrategy extends ExportStrategy {
  constructor(headers, dataMapper) {
    super();
    this.headers = headers;
    this.dataMapper = dataMapper;
  }

  async export(data, fileName = "export") {
    if (!data.length) return;

    const csvRows = [
      this.headers.join(","), // Header row
      ...data.map(item => this.dataMapper(item).map(value => `"${value}"`).join(","))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    this._triggerDownload(csvContent, `${fileName}.csv`, 'text/csv');
  }

  _triggerDownload(content, fileName, mimeType) {
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}