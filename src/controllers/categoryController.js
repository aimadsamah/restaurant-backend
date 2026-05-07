const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const { successResponse, errorResponse } = require('../utils/response');

const getCategories = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active === 'true') filter.isActive = true;

    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });
    return successResponse(res, categories, 'Categories fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 'Category not found', 404);
    return successResponse(res, category, 'Category fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return errorResponse(res, 'Category with this name already exists', 400);

    const category = await Category.create({ name, description, image, order: order || 0 });
    return successResponse(res, category, 'Category created successfully', 201);
  } catch (error) {
    if (error.code === 11000) return errorResponse(res, 'Category already exists', 400);
    return errorResponse(res, error.message, 500);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, order, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 'Category not found', 404);

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;
    if (req.file) category.image = `/uploads/${req.file.filename}`;

    await category.save();
    return successResponse(res, category, 'Category updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 'Category not found', 404);

    const itemCount = await MenuItem.countDocuments({ category: req.params.id });
    if (itemCount > 0) {
      return errorResponse(res, `Cannot delete category with ${itemCount} menu items. Please reassign or delete items first.`, 400);
    }

    await category.deleteOne();
    return successResponse(res, null, 'Category deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
