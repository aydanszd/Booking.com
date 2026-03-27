const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
    getFlights, getFlight,
    createFlight, updateFlight, deleteFlight
} = require('../controllers/flightController');

router.get('/', getFlights);
router.get('/:id', getFlight);
router.post('/', upload.single('logo'), createFlight);
router.put('/:id', upload.single('logo'), updateFlight);
router.delete('/:id', deleteFlight);

module.exports = router;