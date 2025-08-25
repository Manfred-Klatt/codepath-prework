const Dog = require('../models/Dog');
const { StatusCodes } = require('http-status-codes');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register a new dog
// @route   POST /api/v1/dogs
// @access  Private
exports.registerDog = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.registeredBy = req.user.id;

    const dog = await Dog.create(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: dog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all dogs registered by the current user
// @route   GET /api/v1/dogs/registered
// @access  Private
exports.getMyRegisteredDogs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { registeredBy: req.user.id };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    const dogs = await Dog.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Dog.countDocuments(query);

    res.status(StatusCodes.OK).json({
      success: true,
      count: dogs.length,
      total,
      data: dogs,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all dogs available for adoption
// @route   GET /api/v1/dogs/available
// @access  Private
exports.getAvailableDogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { 
      status: 'available',
      // Exclude dogs registered by the current user
      registeredBy: { $ne: req.user.id }
    };

    // Add any additional filters (e.g., breed, size, etc.)
    Object.keys(filters).forEach(key => {
      if (key !== 'page' && key !== 'limit') {
        query[key] = filters[key];
      }
    });

    const dogs = await Dog.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Dog.countDocuments(query);

    res.status(StatusCodes.OK).json({
      success: true,
      count: dogs.length,
      total,
      data: dogs,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single dog
// @route   GET /api/v1/dogs/:id
// @access  Private
exports.getDog = async (req, res, next) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return next(
        new ErrorResponse(
          `Dog not found with id of ${req.params.id}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Make sure user is dog owner or admin
    if (
      dog.registeredBy.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this dog`,
          StatusCodes.FORBIDDEN
        )
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: dog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update dog
// @route   PUT /api/v1/dogs/:id
// @access  Private
exports.updateDog = async (req, res, next) => {
  try {
    let dog = await Dog.findById(req.params.id);

    if (!dog) {
      return next(
        new ErrorResponse(
          `Dog not found with id of ${req.params.id}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Make sure user is dog owner or admin
    if (
      dog.registeredBy.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this dog`,
          StatusCodes.FORBIDDEN
        )
      );
    }

    // Prevent changing the registeredBy field
    if (req.body.registeredBy) {
      delete req.body.registeredBy;
    }

    // Prevent changing the status directly (use adopt/remove endpoints instead)
    if (req.body.status && req.body.status !== dog.status) {
      return next(
        new ErrorResponse(
          'Cannot update dog status directly. Use the appropriate endpoint for adoption/removal.',
          StatusCodes.BAD_REQUEST
        )
      );
    }

    dog = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: dog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete dog
// @route   DELETE /api/v1/dogs/:id
// @access  Private
exports.deleteDog = async (req, res, next) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return next(
        new ErrorResponse(
          `Dog not found with id of ${req.params.id}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Make sure user is dog owner or admin
    if (
      dog.registeredBy.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this dog`,
          StatusCodes.FORBIDDEN
        )
      );
    }

    // Check if the dog can be removed (not already adopted)
    if (!dog.canBeRemoved()) {
      return next(
        new ErrorResponse(
          'Cannot remove a dog that has already been adopted',
          StatusCodes.BAD_REQUEST
        )
      );
    }

    await dog.remove();

    res.status(StatusCodes.OK).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
