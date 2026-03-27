const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, getAllReviews } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Bütün admin marşrutları qorunur (protect) və yalnız adminlər üçün əlçatandır (adminOnly)
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/reviews', getAllReviews);

module.exports = router;
