const express = require('express');
const router = express.Router();
const {
  register,
  login,
  update,
  deleteUser,
  logout,
  sendResetCode,
  verifyResetCode,
  updatePassword,
  updateUsername,
  updateProfilePicture,
} = require('../middleware/auth');

const broadcastController = require('../Controllers/broadcastController');
const consumerController = require('../Controllers/consumerController');

//auth routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update').put(update);
router.route('/deleteUser').delete(deleteUser);
router.route('/logout').post(logout);

router.route('/passwordMail').post(sendResetCode);
router.route('/verifyResetCode').post(verifyResetCode);
router.route('/updatePassword').post(updatePassword);
router.route('/updateUsername').post(updateUsername);
router.post('/updateProfilePicture', updateProfilePicture);

// Broadcast Routes
router.route('/broadcast').post(broadcastController.add);
router.route('/list-broadcast').get(broadcastController.fetch);
router.route('/consumer').post(consumerController.add);

module.exports = router;
