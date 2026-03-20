const express = require('express');
const router = express.Router();
const {
    globalSearch,
    filterBuildings,
    filterCars,
    filterFlights,
} = require('../controllers/searchController');

router.get('/', globalSearch);
router.get('/buildings', filterBuildings);
router.get('/cars', filterCars);
router.get('/flights', filterFlights);

module.exports = router;