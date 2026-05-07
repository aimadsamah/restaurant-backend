const Reservation = require('../models/Reservation');
const { successResponse, errorResponse } = require('../utils/response');

const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests, occasion } = req.body;

    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      return errorResponse(res, 'Reservation date cannot be in the past', 400);
    }

    const reservation = await Reservation.create({
      name, email, phone, date: reservationDate, time, guests: parseInt(guests),
      specialRequests, occasion: occasion || ''
    });

    return successResponse(res, {
      reservation,
      confirmationCode: reservation.confirmationCode
    }, 'Reservation created successfully! We will confirm shortly.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getReservations = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reservations, total] = await Promise.all([
      Reservation.find(filter).sort({ date: 1, time: 1 }).skip(skip).limit(parseInt(limit)),
      Reservation.countDocuments(filter)
    ]);

    return successResponse(res, {
      reservations,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    }, 'Reservations fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return errorResponse(res, 'Reservation not found', 404);

    reservation.status = status;
    await reservation.save();
    return successResponse(res, reservation, 'Reservation status updated');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return errorResponse(res, 'Reservation not found', 404);
    await reservation.deleteOne();
    return successResponse(res, null, 'Reservation deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getReservationStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, pending, confirmed, todayCount] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'pending' }),
      Reservation.countDocuments({ status: 'confirmed' }),
      Reservation.countDocuments({ date: { $gte: today, $lt: tomorrow } })
    ]);

    return successResponse(res, { total, pending, confirmed, today: todayCount }, 'Stats fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { createReservation, getReservations, updateReservationStatus, deleteReservation, getReservationStats };
