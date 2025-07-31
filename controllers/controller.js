
exports.Home = (req, res) => {
    res.render('index');
  };
exports.dashboardUser = (req, res) => {
    res.render('usersPages/dashboardUser');
  };
exports.logout = (req, res) => {
    res.render('login');
  };
exports.add_leave = (req, res) => {
    res.render('add_leave');
  };
exports.add_leaveUser = (req, res) => {
    res.render('usersPages/add_leaveUser');
  };
exports.manage_leaves = (req, res) => {
    res.render('manage_leaves');
  };
exports.manage_leavesUser = (req, res) => {
    res.render('usersPages/manage_leavesUser');
  };
exports.manage_users = (req, res) => {
    res.render('manage_users');
  };
exports.backup = (req, res) => {
    res.render('backup');
  };
exports.backupUser = (req, res) => {
    res.render('usersPages/backupUser');
  };
exports.profile = (req, res) => {
    res.render('profile');
  };
  exports.profileUser = (req, res) => {
      res.render('usersPages/profileUser');
    };
exports.settings = (req, res) => {
    res.render('settings');
  };
exports.settingsUser = (req, res) => {
    res.render('usersPages/settingsUser');
  };
exports.quary = (req, res) => {
    res.render('quary');
  };
