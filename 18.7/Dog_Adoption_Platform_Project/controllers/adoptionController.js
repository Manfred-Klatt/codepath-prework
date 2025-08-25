const Adoption = require('../models/Adoption');
const Dog = require('../models/Dog');
const { StatusCodes } = require('http-status-codes');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Adopt a dog
// @route   POST /api/v1/dogs/:id/adopt
// @access  Private
exports.adoptDog = async (req, res, next) => {
  try {
    const { message } = req.body;
    const dogId = req.params.id;
    const adopterId = req.user.id;

    // Check if dog exists and is available
    const dog = await Dog.findById(dogId);
    
    if (!dog) {
      return next(
        new ErrorResponse(
          `Dog not found with id of ${dogId}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Check if dog is available for adoption
    if (!dog.isAvailable()) {
      return next(
        new ErrorResponse(
          `Dog with id ${dogId} is not available for adoption`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Check if user is trying to adopt their own dog
    if (dog.registeredBy.toString() === adopterId) {
      return next(
        new ErrorResponse(
          'You cannot adopt a dog that you have registered',
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Create adoption record
    const adoption = await Adoption.create({
      dog: dogId,
      adopter: adopterId,
      previousOwner: dog.registeredBy,
      message: message || 'Thank you for letting me adopt this dog!'
    });

    // Update dog status to adopted
    dog.status = 'adopted';
    await dog.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: adoption
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all adoptions for the current user
// @route   GET /api/v1/adoptions
// @access  Private
exports.getMyAdoptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Find all adoptions where the current user is either the adopter or the previous owner
    const adoptions = await Adoption.find({
      $or: [
        { adopter: req.user.id },
        { previousOwner: req.user.id }
      ]
    })
    .populate('dog', 'name breed age gender')
    .populate('adopter', 'username email')
    .populate('previousOwner', 'username email')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ adoptionDate: -1 });

    const total = await Adoption.countDocuments({
      $or: [
        { adopter: req.user.id },
        { previousOwner: req.user.id }
      ]
    });

    res.status(StatusCodes.OK).json({
      success: true,
      count: adoptions.length,
      total,
      data: adoptions,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single adoption
// @route   GET /api/v1/adoptions/:id
// @access  Private
exports.getAdoption = async (req, res, next) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('dog', 'name breed age gender')
      .populate('adopter', 'username email')
      .populate('previousOwner', 'username email');

    if (!adoption) {
      return next(
        new ErrorResponse(
          `Adoption not found with id of ${req.params.id}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Make sure user is part of the adoption (either adopter or previous owner)
    if (
      adoption.adopter._id.toString() !== req.user.id && 
      adoption.previousOwner._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this adoption`,
          StatusCodes.FORBIDDEN
        )
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: adoption
    });
  } catch (err) {
    next(err);
  }
};
