const pool = require('../../connection/addLeaveConnection/addLeaveConnection')
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const { PDFDocument, rgb } = require('pdf-lib');
exports.add_leave = async (req, res) => {
    try {
      const data = req.body;
  
      const query = `
        INSERT INTO leave_requests (
          leave_id, issue_date, admission_date, admission_date_hijri,
          discharge_date, discharge_date_hijri, leave_duration_arabic,
          leave_duration_english, name_arabic, name_english, national_id,
          nationality_arabic, nationality_english, employer_arabic, employer_english,
          physician_arabic, physician_english, position_arabic, position_english
        )
        VALUES (
          $1, $2, $3, $4,
          $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17, $18, $19
        )
      `;
  console.log('insertrd secussfully');



      const values = [
        data.leaveId, data.issueDate, data.admissionDate, data.admissionDateHijri,
        data.dischargeDate, data.dischargeDateHijri, data.leaveDurationArabic,
        data.leaveDurationEnglish, data.nameArabic, data.nameEnglish, data.nationalId,
        data.nationalityArabic, data.nationalityEnglish, data.employerArabic, data.employerEnglish,
        data.physicianArabic, data.physicianEnglish, data.positionArabic, data.positionEnglish
      ];
  
      await pool.query(query, values);
  
      res.status(200).json({ message: 'Leave data saved successfully' });
    } catch (error) {
      console.error('Error saving leave data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  exports.count_current_month_leaves = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT COUNT(*) AS total
        FROM leave_requests
        WHERE DATE_TRUNC('month', issue_date) = DATE_TRUNC('month', CURRENT_DATE)
      `);
  
      res.status(200).json({ total: result.rows[0].total });
    } catch (error) {
      console.error('Error counting leaves for current month:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.count_User = async (req, res) => {
    try {
      const result = await pool.query('SELECT COUNT(*) AS total FROM users');
      const totalLeaves = result.rows[0].total;
      res.status(200).json({ count: totalLeaves });
    } catch (error) {
      console.error('Error counting leaves:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.count_today_leaves = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT COUNT(*) AS count
        FROM leave_requests
        WHERE created_at::date = CURRENT_DATE
      `);
  
      res.status(200).json({ count: result.rows[0].count });
    } catch (error) {
      console.error("Error counting today's created leaves:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.add_leaveALL = async (req, res) => {
    try {
      const query = `SELECT * FROM leave_requests`;
  
      const result = await pool.query(query);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching leave data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.quary = async (req, res) => {
    const code = req.body.code?.trim();
    const national_id = req.body.national_id?.trim();
    try {
        const result = await pool.query(
            `SELECT * FROM leave_requests WHERE leave_id = $1 AND national_id = $2`,
            [code, national_id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.send('لم يتم العثور على نتائج.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ في قاعدة البيانات.');
    }
}


  exports.get_leave_by_id = async (req, res) => {
    try {
      const leaveId = req.params.id;
      const result = await pool.query('SELECT * FROM leave_requests WHERE leave_id = $1', [leaveId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Leave not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching leave by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.updateLeave =  async (req, res) => {
    const leaveId = req.params.id;
    const {
      leave_duration_english,
      admission_date,
      admission_date_hijri,
      discharge_date,
      discharge_date_hijri,
      issue_date,
      name_arabic,
      name_english,
      national_id,
      nationality_arabic,
      nationality_english,
      employer_arabic,
      employer_english,
      physician_arabic,
      physician_english,
      position_arabic,
      position_english
    } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE leave_requests
         SET 
          leave_duration_english = $1,
          admission_date = $2,
          admission_date_hijri = $3,
          discharge_date = $4,
          discharge_date_hijri = $5,
          issue_date = $6,
          name_arabic = $7,
          name_english = $8,
          national_id = $9,
          nationality_arabic = $10,
          nationality_english = $11,
          employer_arabic = $12,
          employer_english = $13,
          physician_arabic = $14,
          physician_english = $15,
          position_arabic = $16,
          position_english = $17
         WHERE leave_id = $18
         RETURNING *`,
        [
          leave_duration_english,
          admission_date,
          admission_date_hijri,
          discharge_date,
          discharge_date_hijri,
          issue_date,
          name_arabic,
          name_english,
          national_id,
          nationality_arabic,
          nationality_english,
          employer_arabic,
          employer_english,
          physician_arabic,
          physician_english,
          position_arabic,
          position_english,
          leaveId
        ]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'البيان غير موجود' });
      }
  
      res.status(200).json({ message: 'تم تحديث الإجازة بنجاح', leave: result.rows[0] });
    } catch (err) {
      console.error('Database update error:', err);
      res.status(500).json({ error: 'حدث خطأ أثناء تحديث البيانات' });
    }
  }
exports.deleteLeave =  async (req, res) => {
    const leaveId = req.params.id;

    try {
      const result = await pool.query('DELETE FROM leave_requests WHERE leave_id = $1 RETURNING *', [leaveId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'الإجازة غير موجودة' });
      }
  
      res.json({ message: 'تم حذف الإجازة' });
    } catch (error) {
      console.error('خطأ أثناء الحذف:', error);
      res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
  }

  exports.get_active_leaves = async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT COUNT(*) AS total
      FROM leave_requests
      WHERE discharge_date::date >= CURRENT_DATE;
      `);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching active leaves:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.get_deactive_leaves = async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT COUNT(*) AS total
      FROM leave_requests
      WHERE discharge_date::date <= CURRENT_DATE;
      `);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching active leaves:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.count_week_leaves = async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT COUNT(*) AS total
      FROM public.leave_requests
      WHERE admission_date >= NOW() - INTERVAL '7 days';
      `);
      res.status(200).json({ count: result.rows[0].total });
    } catch (error) {
      console.error('Error counting weekly leaves:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const formImagePath = path.join(__dirname, './sick_leave_434.jpg');
  const arabicFontPath = path.join(__dirname, './fonts/TheYearofTheCamel-ExtraBold.otf');
  
  exports.downloadLeavePdf = async (req, res) => {
    const { leaveId } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM leave_requests WHERE leave_id = $1', [leaveId]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'طلب الإجازة غير موجود' });
  
      const data = result.rows[0];
  
      // Load background image and Arabic font
      const bgImageBytes = fs.readFileSync(formImagePath);
      const fontBytes = fs.readFileSync(arabicFontPath);
  
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
  
      const backgroundImage = await pdfDoc.embedJpg(bgImageBytes);
      const customFont = await pdfDoc.embedFont(fontBytes);
  
      const page = pdfDoc.addPage([backgroundImage.width, backgroundImage.height]);
      page.drawImage(backgroundImage, {
        x: 0,
        y: 0,
        width: backgroundImage.width,
        height: backgroundImage.height,
      });
      const fontSize = 14;
      const defaultColor = rgb(0.1059, 0.1765, 0.3255);  // dark blue
      const whiteColor = rgb(1, 1, 1); // white
      const drawRtlText = (text, x, y, options = {}) => {
        page.drawText(text, {
          x,
          y,
          size: options.size || fontSize,
          font: customFont,
          color: options.color || defaultColor,
        });
      };
    
     
      drawRtlText(data.leave_id, 450, 913);
      drawRtlText(data.name_arabic, 560, 690);
      drawRtlText(data.name_english, 255, 690);
      const input = data.leave_duration_english;
      const output = input.replace(/\((\d{2})\/(\d{2})\/(\d{4}) to (\d{2})\/(\d{2})\/(\d{4})\)/, 
      (_, d1, m1, y1, d2, m2, y2) => `(${d1}-${m1}-${y1} to ${d2}-${m2}-${y2})`);
      drawRtlText(output, 260, 870, { color: whiteColor, size: 13 });
      const text = data.leave_duration_arabic; // e.g. "2 يوم (23-08-1446 إلى 24-09-1446)"
      
      // Extract day count and "يوم"
      const dayCount = text.split(" ")[0];
      const onlyYawm = text.includes("يوم") ? "يوم" : "";
      
      // Extract the text inside parentheses
      const parenthesesMatch = text.match(/\(([^)]+)\)/);
      const dateRange = parenthesesMatch ? parenthesesMatch[1] : ""; // "23-08-1446 إلى 24-09-1446"
      
      // Extract the "إلى" word alone
      const ilaMatch = dateRange.match(/إلى/);
      const onlyIla = ilaMatch ? ilaMatch[0] : "";
      
      // Split the dates by "إلى"
      const dates = dateRange.split('إلى').map(s => s.trim());
      const firstDate = dates[0] || "";
      const secondDate = dates[1] || "";
      drawRtlText(dayCount, 710, 870, { color: whiteColor, size: 13 });
      drawRtlText(onlyYawm, 690, 870, { color: whiteColor, size: 13 });
      drawRtlText(onlyIla, 605, 870, { color: whiteColor, size: 13 });
      drawRtlText(`(${firstDate}      ${secondDate})`, 535, 870, { color: whiteColor, size: 13 });
      const date = new Date(data.admission_date);
      const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      const date1 = new Date(data.discharge_date);
      const formattedDate1 = `${String(date1.getDate()).padStart(2, '0')}-${String(date1.getMonth() + 1).padStart(2, '0')}-${date1.getFullYear()}`;
      const date2 = new Date(data.issue_date);
      const formattedDate2 = `${String(date2.getDate()).padStart(2, '0')}-${String(date2.getMonth() + 1).padStart(2, '0')}-${date2.getFullYear()}`;
      drawRtlText(formattedDate, 320, 825); 
      drawRtlText(formattedDate1, 320, 780); 
      drawRtlText(formattedDate2, 460, 735); 
      drawRtlText(data.admission_date_hijri, 590, 825); 
      drawRtlText(data.discharge_date_hijri, 590, 780); 
      drawRtlText(data.national_id, 460, 643); 
      drawRtlText(data.nationality_arabic, 610, 598);
      drawRtlText(data.employer_arabic, 610, 553);
      drawRtlText(data.physician_arabic, 610, 490);
      drawRtlText(data.position_arabic, 610, 430);
      drawRtlText(data.nationality_english, 325, 598);
      drawRtlText(data.employer_english, 325, 553);
      drawRtlText(data.physician_english, 325, 490);
      drawRtlText(data.position_english, 325, 430);
      const now = new Date();

let hours = now.getHours();
let minutes = now.getMinutes();

const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; // إذا كانت الساعة 0، اجعلها 12
minutes = minutes.toString().padStart(2, '0');
hours = hours.toString().padStart(2, '0');
const timeFormatted = `${hours}:${minutes} ${ampm}`;
drawRtlText(timeFormatted, 40, 110);
const date3 = new Date();

const weekday = date3.toLocaleDateString('en-US', { weekday: 'long' });
const day = date3.getDate().toString().padStart(2, '0');
const month = date3.toLocaleDateString('en-US', { month: 'long' });
const year = date3.getFullYear();
const formatted = `${weekday}, ${day} ${month}, ${year}`;
drawRtlText(formatted, 40, 90);
      
      
      
      
      
      
      
      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const filename = `Leave_${leaveId}.pdf`;
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
      res.send(Buffer.from(pdfBytes));
  
    } catch (error) {
      console.error('Error generating leave PDF:', error);
      res.status(500).json({ error: 'فشل في توليد الملف' });
    }
  };


