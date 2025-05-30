/* eslint-disable no-unused-vars */

// src/utils/export/ExportStrategy.js
export class ExportStrategy {
  constructor() {
    if (this.constructor === ExportStrategy) {
      throw new Error("Abstract class can't be instantiated");
    }
  }

  async export(data, fileName) {
    throw new Error("Method 'export()' must be implemented");
  }
}