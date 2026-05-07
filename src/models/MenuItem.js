const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  availability: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  allergens: [{
    type: String,
    trim: true
  }],
  preparationTime: {
    type: Number,
    default: 20
  }
}, { timestamps: true });

menuItemSchema.index({ category: 1 });
menuItemSchema.index({ featured: 1 });
menuItemSchema.index({ availability: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
