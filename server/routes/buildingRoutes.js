const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  getBuildings, getBuilding,
  createBuilding, updateBuilding,
  deleteBuilding, addReview
} = require('../controllers/buildingController');

router.get('/',         getBuildings);
router.get('/:id',      getBuilding);
router.post('/',        upload.array('images', 10), createBuilding);
router.put('/:id',      upload.array('images', 10), updateBuilding);
router.delete('/:id',   deleteBuilding);
router.post('/:id/review', addReview);

module.exports = router;