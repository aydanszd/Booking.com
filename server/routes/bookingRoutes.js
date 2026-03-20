const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
    getMyBookings, getBooking,
    createBooking, cancelBooking, getAllBookings,
} = require('../controllers/bookingController');

router.get('/', protect, getMyBookings);
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;