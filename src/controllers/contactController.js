const ContactMessage = require('../models/ContactMessage');
const { successResponse, errorResponse } = require('../utils/response');

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await ContactMessage.create({ name, email, subject, message });
    return successResponse(res, contact, 'Message sent successfully! We will get back to you soon.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getContacts = async (req, res) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [messages, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      ContactMessage.countDocuments(filter)
    ]);

    return successResponse(res, {
      messages,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    }, 'Contact messages fetched');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const markAsRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!msg) return errorResponse(res, 'Message not found', 404);
    return successResponse(res, msg, 'Marked as read');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteContact = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return errorResponse(res, 'Message not found', 404);
    await msg.deleteOne();
    return successResponse(res, null, 'Message deleted');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { createContact, getContacts, markAsRead, deleteContact };
