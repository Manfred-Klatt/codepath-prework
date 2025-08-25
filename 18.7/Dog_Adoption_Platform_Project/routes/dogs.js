const express = require('express');
const {
  registerDog,
  getMyRegisteredDogs,
  getAvailableDogs,
  getDog,
  updateDog,
  deleteDog
} = require('../controllers/dogController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for dog registration and management
router.route('/')
  .post(registerDog);

router.route('/registered')
  .get(getMyRegisteredDogs);

router.route('/available')
  .get(getAvailableDogs);

router.route('/:id')
  .get(getDog)
  .put(updateDog)
  .delete(deleteDog);

module.exports = router;
