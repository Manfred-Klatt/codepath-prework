const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  dog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dog',
    required: [true, 'Dog ID is required'],
    unique: true // A dog can only be adopted once
  },
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Adopter ID is required']
  },
  previousOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Previous owner ID is required']
  },
  adoptionDate: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required: [true, 'Please include a thank you message'],
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['completed', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
adoptionSchema.index({ adopter: 1 });
adoptionSchema.index({ previousOwner: 1 });

// Prevent duplicate adoptions
adoptionSchema.index({ dog: 1, adopter: 1 }, { unique: true });

// Middleware to update dog status when adopted
adoptionSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const Dog = mongoose.model('Dog');
      const dog = await Dog.findById(this.dog);
      
      if (!dog) {
        throw new Error('Dog not found');
      }
      
      // Update dog's status and adoptedBy field
      dog.status = 'adopted';
      dog.adoptedBy = this.adopter;
      dog.adoptionDate = this.adoptionDate;
      
      await dog.save();
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Adoption', adoptionSchema);
