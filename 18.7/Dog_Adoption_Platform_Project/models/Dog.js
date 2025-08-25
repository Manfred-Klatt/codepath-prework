const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the dog'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['available', 'adopted', 'removed'],
    default: 'available'
  },
  breed: {
    type: String,
    trim: true,
    maxlength: [50, 'Breed cannot be more than 50 characters']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative']
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'xlarge'],
    default: 'medium'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        // Simple URL validation
        return /^https?:\/\//.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }],
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adoptionDate: {
    type: Date
  },
  removalDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
dogSchema.index({ status: 1 });
dogSchema.index({ registeredBy: 1 });
dogSchema.index({ adoptedBy: 1 });

// Virtual for adoption details
dogSchema.virtual('adoptionDetails', {
  ref: 'Adoption',
  localField: '_id',
  foreignField: 'dog',
  justOne: true
});

// Prevent duplicate dog registrations
dogSchema.index({ name: 1, registeredBy: 1 }, { unique: true });

// Add a method to check if a dog is available for adoption
dogSchema.methods.isAvailable = function() {
  return this.status === 'available';
};

// Add a method to check if a dog can be removed
dogSchema.methods.canBeRemoved = function() {
  return this.status !== 'adopted';
};

module.exports = mongoose.model('Dog', dogSchema);
