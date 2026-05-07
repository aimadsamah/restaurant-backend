const express = require('express');
const router = express.Router();
const { createReservation, getReservations, updateReservationStatus, deleteReservation, getReservationStats } = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', createReservation);
router.get('/', protect, adminOnly, getReservations);
router.get('/stats', protect, adminOnly, getReservationStats);
router.put('/:id/status', protect, adminOnly, updateReservationStatus);
router.delete('/:id', protect, adminOnly, deleteReservation);

module.exports = router;
