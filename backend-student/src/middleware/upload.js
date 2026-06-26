const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создаём директории если не существуют
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
const programsDir = path.join(uploadsDir, 'programs');
const labsDir = path.join(uploadsDir, 'labs');

[uploadsDir, programsDir, labsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storageProgram = multer.diskStorage({
  destination: (req, file, cb) => cb(null, programsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'program-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const storageLab = multer.diskStorage({
  destination: (req, file, cb) => cb(null, labsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'lab-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.zip', '.rar', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый формат файла. Допустимые: PDF, DOC, DOCX, ZIP, PNG, JPG'));
  }
};

const uploadProgram = multer({ storage: storageProgram, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }).single('file');
const uploadLab = multer({ storage: storageLab, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }).single('file');

module.exports = { uploadProgram, uploadLab };
