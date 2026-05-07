const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Minimum 1 guest'],
    max: [20, 'Maximum 20 guests']
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  occasion: {
    type: String,
    enum: ['birthday', 'anniversary', 'business', 'romantic', 'family', 'other', ''],
    default: ''
  },
  confirmationCode: {
    type: String,
    unique: true
  }
}, { timestamps: true });

reservationSchema.pre('save', function(next) {
  if (!this.confirmationCode) {
    this.confirmationCode = 'MN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

reservationSchema.index({ date: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ email: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
