const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const token = req.cookies.token; // 🔄 get token from cookie

  if (!token) {
    return res.status(401).sendFile(__dirname + '/unauthorized.html')
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden - Invalid token' });
    req.user = user;
    next();
  });
}

function adminOnly(req, res, next) {
  if (!req.user) {
    return res.redirect('/login'); 
    
  }

  if (req.user.role === 'admin') {
    return next(); 
  } else {
    return res.redirect('/dashboardUser');
    
  }
}
module.exports = { authenticateToken, adminOnly };
