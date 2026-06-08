const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getWorkbookPath(sheetName) {
  return path.join(DATA_DIR, `${sheetName}.xlsx`);
}

function readSheet(sheetName) {
  ensureDataDir();
  const filePath = getWorkbookPath(sheetName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet, { defval: '' });
}

function writeSheet(sheetName, rows) {
  ensureDataDir();
  const filePath = getWorkbookPath(sheetName);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filePath);
}

function findById(sheetName, idField, id) {
  const rows = readSheet(sheetName);
  return rows.find((row) => String(row[idField]) === String(id));
}

function findAll(sheetName, predicate = () => true) {
  return readSheet(sheetName).filter(predicate);
}

function insertRow(sheetName, row) {
  const rows = readSheet(sheetName);
  rows.push(row);
  writeSheet(sheetName, rows);
  return row;
}

function updateRow(sheetName, idField, id, updates) {
  const rows = readSheet(sheetName);
  const index = rows.findIndex((row) => String(row[idField]) === String(id));
  if (index === -1) {
    return null;
  }
  rows[index] = { ...rows[index], ...updates };
  writeSheet(sheetName, rows);
  return rows[index];
}

function deleteRow(sheetName, idField, id) {
  const rows = readSheet(sheetName);
  const filtered = rows.filter((row) => String(row[idField]) !== String(id));
  if (filtered.length === rows.length) {
    return false;
  }
  writeSheet(sheetName, filtered);
  return true;
}

function deleteWhere(sheetName, predicate) {
  const rows = readSheet(sheetName);
  const filtered = rows.filter((row) => !predicate(row));
  writeSheet(sheetName, filtered);
  return rows.length - filtered.length;
}

module.exports = {
  DATA_DIR,
  readSheet,
  writeSheet,
  findById,
  findAll,
  insertRow,
  updateRow,
  deleteRow,
  deleteWhere,
};
