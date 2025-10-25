const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  deactivateUser,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

// User can access their own profile
router.get('/profile', (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.get('/stats', authorize('admin'), getUserStats);
router.post('/', authorize('admin'), createUser);
router.get('/:id', authorize('admin'), getUser);
router.put('/:id', authorize('admin'), updateUser);
router.put('/:id/role', authorize('admin'), updateUserRole);
router.put('/:id/deactivate', authorize('admin'), deactivateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;