const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
    getCars, getCar, createCar,
    updateCar, deleteCar, addReview
} = require('../controllers/carController');

router.get('/', getCars);
router.get('/:id', getCar);
router.post('/', upload.array('images', 5), createCar);
router.put('/:id', upload.array('images', 5), updateCar);
router.delete('/:id', deleteCar);
router.post('/:id/review', addReview);

module.exports = router;