
// src/utils/export/JsonExportStrategy.js
import { ExportStrategy } from './ExportStrategy';

export class JsonExportStrategy extends ExportStrategy {
  async export(data, fileName = "export") {
    const jsonData = JSON.stringify(data, null, 2);
    this._triggerDownload(jsonData, `${fileName}.json`, 'application/json');
  }

  _triggerDownload(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}