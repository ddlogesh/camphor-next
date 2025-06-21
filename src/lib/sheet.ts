import * as XLSX from 'xlsx';

const getWorksheetNames = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        resolve(sheetNames);
      } catch (error) {
        reject(`Error reading file: ${error}`);
      }
    };

    reader.onerror = () => {
      reject('Error reading file');
    };

    reader.readAsArrayBuffer(file);
  });
};

export {
  getWorksheetNames,
}
