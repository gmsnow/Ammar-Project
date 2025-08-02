require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();



const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

const pgDumpPath = `"C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe"`;

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);
exports.backup = (req, res) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);
  
    // ✅ استخدم المسار الكامل لـ pg_dump
    const cmd = `${pgDumpPath} -U ${DB_USER} -d ${DB_NAME} -F p -f "${filePath}"`;
  
    exec(cmd, { env: { ...process.env, PGPASSWORD: 123 } }, (error, stdout, stderr) => {
      if (error) {
        console.error('خطأ في النسخ:', stderr);
        return res.status(500).send('فشل إنشاء النسخة الاحتياطية');
      }
      console.log('تم إنشاء النسخة الاحتياطية بنجاح في:', filePath);
      res.status(200).send('تم إنشاء النسخة الاحتياطية بنجاح');
    });
  }
  const backupFolder = path.join(__dirname, '../backups');
  exports.resbackUp =  (req, res) => {
    fs.readdir(backupFolder, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'خطأ في قراءة مجلد النسخ' });
      }
      // فلترة الملفات (مثلاً فقط .sql أو حسب امتداد النسخ)
      const backups = files
        .filter(f => f.endsWith('.sql')) // غير الامتداد حسب نوع النسخ عندك
        .map((file, index) => ({
          id: index + 1,
          name: file,
        }));
      res.json(backups);
    });
  }
  exports.download = (req, res) => {
    const fileName = path.basename(req.params.fileName); // حماية من المسارات الخبيثة
  const filePath = path.join(__dirname, '..', 'backups', fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('الملف غير موجود.');
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('خطأ أثناء التحميل:', err);
      res.status(500).send('فشل تحميل الملف.');
    }
  });
}

  // Controller function
//   exports.backupList = (req, res) => {
//     fs.readdir(backupFolder, (err, files) => {
//         if (err) return res.status(500).json({ error: 'حدث خطأ في قراءة المجلد' });
    
//         const backups = files
//           .filter(f => f.endsWith('.sql'))
//           .map(file => {
//             const fullPath = path.join(backupFolder, file);
//             const stats = fs.statSync(fullPath);
    
//             const dateMatch = file.match(/backup-(.+)\.sql/);
//             const isoDate = dateMatch ? new Date(dateMatch[1]) : stats.birthtime;
    
//             const size = stats.size;
    
//             return {
//               name: file,
//               size: size,
//               createdAt: isoDate,
//               type: file.includes('auto') ? 'تلقائي' : file.includes('schedule') ? 'مجدول' : 'يدوي',
//               status: 'مكتمل'
//             };
//           });
    
//         res.json(backups);
//       });
//     };