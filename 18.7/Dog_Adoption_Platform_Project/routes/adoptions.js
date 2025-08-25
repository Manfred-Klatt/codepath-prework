const express = require('express');
const { 
  adoptDog, 
  getMyAdoptions, 
  getAdoption 
} = require('../controllers/adoptionController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for adoptions
router.route('/')
  .get(getMyAdoptions);

router.route('/:id')
  .get(getAdoption);

// Route to adopt a specific dog
router.post('/dogs/:id/adopt', adoptDog);

module.exports = router;
