const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem, getMenuByCategory } = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getMenuItems);
router.get('/by-category', getMenuByCategory);
router.get('/:id', getMenuItemById);
router.post('/', protect, adminOnly, upload.single('image'), createMenuItem);
router.put('/:id', protect, adminOnly, upload.single('image'), updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
