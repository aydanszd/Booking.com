const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect } = require('../middleware/auth');
const {
    getCars, getCar, createCar,
    updateCar, deleteCar, addReview, replyToReview
} = require('../controllers/carController');

router.get('/', getCars);
router.get('/:id', getCar);
router.post('/', upload.array('images', 5), createCar);
router.put('/:id', upload.array('images', 5), updateCar);
router.delete('/:id', deleteCar);
router.post('/:id/review', protect, addReview);
router.post('/:id/review/:reviewId/reply', protect, replyToReview);

module.exports = router;