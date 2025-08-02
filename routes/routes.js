const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');
const userModel = require('../models/users/users')
const add_leaveModel = require('../models/add_leave/add_leave')
const backupModel = require('../models/backups/backupModel')
const {authenticateToken, adminOnly }  = require('../middleware/auth');
router.get('/', Controller.logout);
router.get('/dashboard',authenticateToken, adminOnly, Controller.Home);
router.get('/dashboardUser',authenticateToken, Controller.dashboardUser);
router.get('/add_leave',authenticateToken, adminOnly, Controller.add_leave);
router.get('/add_leaveUser',authenticateToken, Controller.add_leaveUser);
router.get('/manage_users', authenticateToken, adminOnly, Controller.manage_users);
router.get('/manage_leaves', authenticateToken, adminOnly, Controller.manage_leaves);
router.get('/manage_leavesUser',authenticateToken, Controller.manage_leavesUser);
router.get('/backup',authenticateToken, adminOnly, Controller.backup);
router.get('/backupUser',authenticateToken, Controller.backupUser);
router.get('/profile',authenticateToken, adminOnly, Controller.profile);
router.get('/profileUser',authenticateToken, Controller.profileUser);
router.get('/settings',authenticateToken, adminOnly, Controller.settings);
router.get('/settingsUser',authenticateToken, Controller.settingsUser);
router.get('/quary', Controller.quary);




//API REQ
router.get('/api/add_leaveALL',add_leaveModel.add_leaveALL)
router.get('/api/leave/:id', add_leaveModel.get_leave_by_id);
router.get('/api/leave-count/current-month', add_leaveModel.count_current_month_leaves);
router.get('/api/user-count', add_leaveModel.count_User);
router.get('/api/today', add_leaveModel.count_today_leaves);
router.get('/api/active', add_leaveModel.get_active_leaves);
router.get('/api/deactive', add_leaveModel.get_deactive_leaves);
router.get('/api/weekly', add_leaveModel.count_week_leaves);
router.get('/api/adminUser', userModel.adminUser);
router.get('/api/activeUsers', userModel.activeUsers);
router.get('/api/getAllUsers', userModel.getAllUsers);
router.get('/api/backups', backupModel.resbackUp);
router.get('/api/backup/list', backupModel.resbackUp);


//pdf print
router.get('/download-leave/:leaveId',add_leaveModel.downloadLeavePdf)
router.get('/api/download/:fileName',backupModel.download)

//put req
router.put('/api/leave/:id',add_leaveModel.updateLeave)
router.put('/api/users/:username',userModel.updateUser)
router.put('/api/users/:username/reset-password',userModel.resetPassword)
router.put('/api/users/:username/toggle-status',userModel.changeStatus)


//delete req
router.delete('/api/leave/:id',add_leaveModel.deleteLeave)


router.post('/api/query', add_leaveModel.quary)
router.post('/login', userModel.login)
router.post('/api/save-leave',add_leaveModel.add_leave)
router.post('/api/getUser', userModel.getUser);
router.post('/api/addUser', userModel.addUser);
router.post('/backup',backupModel.backup)
// router.post('/restore',backupModel.restore)



module.exports = router;