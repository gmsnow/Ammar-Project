const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();
const pool = require('../../connection/usersConnection/userConnection');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'كلمة السر أو المستخدم خاطئ' });
      }
  
      const user = result.rows[0];
      if (user.password !== password) {
        return res.status(401).json({ error: 'كلمة السر أو المستخدم خاطئ' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, role: user.role, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );
  
      // Return token and user info
      res.cookie('token', token, {
        httpOnly: true,  // Secure if using HTTPS
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });
      res.json({
        message: `${user.username}`,
        email: user.email,
        role: user.role
      });
  
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };




  exports.getUser = async (req, res) => {
    const { username } = req.body;
    console.log('Received username:', username);
  
    // افترض أنك تستعلم عن المستخدم من قاعدة البيانات
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
      if (result.rows.length > 0) {
        res.json(result.rows[0]); // ✅ أرسل البيانات للمستخدم
      } else {
        res.status(404).json({ error: 'المستخدم غير موجود' });
      }
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'خطأ في الخادم' });
    }
  };

  exports.adminUser = async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE role = 'admin';
      `);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching active leaves:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.activeUsers = async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE state = 'active';
      `);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching active leaves:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  exports.addUser = async (req, res) => {
    const { username,email,password, userRole,number, userStatus } = req.body;

    if (!username || !number || !email || !password || !userRole || !userStatus) {
        return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    try {
        // مثال PostgreSQL - تأكد من أن الجدول لديك يحتوي على هذه الأعمدة
        await pool.query(
          `INSERT INTO users (username, email, password, role,number, state)
          VALUES ($1, $2, $3, $4, $5,$6)`,
         [username,email,password, userRole,number, userStatus]
        );

        res.status(200).json({ message: 'تمت إضافة المستخدم بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'حدث خطأ أثناء حفظ البيانات' });
    }
}
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users ORDER BY id DESC`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.resetPassword = async (req, res) => {
  const { username } = req.params;
  const { password } = req.body;
  console.log(password);

  try {
    // تأكد من أن المستخدم موجود أولًا
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // تحديث كلمة المرور (بدون تشفير إذا لا تستخدم bcrypt)
    await pool.query('UPDATE users SET password = $1 WHERE username = $2', [password, username]);

    res.json({ message: 'تم إعادة تعيين كلمة المرور بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء التحديث' });
  }
}
exports.changeStatus =async (req, res) => {
  const { username } = req.params;
  try {
    // الحصول على الحالة الحالية
    const result = await pool.query('SELECT state FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const currentStatus = result.rows[0].state;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    

    // تحديث الحالة
    await pool.query('UPDATE users SET state = $1 WHERE username = $2', [newStatus, username]);
    res.json({ message: 'تم تغيير الحالة بنجاح', newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
}
exports.updateUser =async (req, res) => {
  const username = req.params.username;
  const {
    email,
    password,
    role,
    phone,
    state,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET
      username = $1,
      email = $2,
      password = $3,
      "role" = $4,
      number = $5,
      state = $6
     WHERE username = $7
     RETURNING *`,
    [
      username,
      email,
      password,
      role,
      phone,
      state,
      username
    ]
  );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.status(200).json({ message: 'تم تحديث المستخدم بنجاح', user: result.rows[0] });
  } catch (err) {
    console.error('Database update error:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث المستخدم' });
  }
};
