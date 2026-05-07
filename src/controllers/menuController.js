// const MenuItem = require('../models/MenuItem');
// const Category = require('../models/Category');
// const { successResponse, errorResponse } = require('../utils/response');

// const getMenuItems = async (req, res) => {
//   try {
//     const { category, available, featured, page = 1, limit = 50 } = req.query;
//     const filter = {};

//     if (category) filter.category = category;
//     if (available !== undefined) filter.availability = available === 'true';
//     if (featured === 'true') filter.featured = true;

//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const [items, total] = await Promise.all([
//       MenuItem.find(filter)
//         .populate('category', 'name slug')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       MenuItem.countDocuments(filter)
//     ]);

//     return successResponse(res, {
//       items,
//       pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
//     }, 'Menu items fetched successfully');
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

// const getMenuItemById = async (req, res) => {
//   try {
//     const item = await MenuItem.findById(req.params.id).populate('category', 'name slug');
//     if (!item) return errorResponse(res, 'Menu item not found', 404);
//     return successResponse(res, item, 'Menu item fetched successfully');
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

// const createMenuItem = async (req, res) => {
//   try {
//     const { name, description, price, category, availability, tags, featured, allergens, preparationTime } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || null;

//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) return errorResponse(res, 'Category not found', 404);

//     const item = await MenuItem.create({
//       name, description, price: parseFloat(price), category, image,
//       availability: availability !== undefined ? availability : true,
//       tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
//       featured: featured === 'true' || featured === true,
//       allergens: allergens ? (Array.isArray(allergens) ? allergens : allergens.split(',').map(a => a.trim())) : [],
//       preparationTime: parseInt(preparationTime) || 20
//     });

//     const populated = await MenuItem.findById(item._id).populate('category', 'name slug');
//     return successResponse(res, populated, 'Menu item created successfully', 201);
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

// const updateMenuItem = async (req, res) => {
//   try {
//     const item = await MenuItem.findById(req.params.id);
//     if (!item) return errorResponse(res, 'Menu item not found', 404);

//     const { name, description, price, category, availability, tags, featured, allergens, preparationTime } = req.body;

//     if (name) item.name = name;
//     if (description) item.description = description;
//     if (price !== undefined) item.price = parseFloat(price);
//     if (category) {
//       const cat = await Category.findById(category);
//       if (!cat) return errorResponse(res, 'Category not found', 404);
//       item.category = category;
//     }
//     if (availability !== undefined) item.availability = availability === 'true' || availability === true;
//     if (tags) item.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
//     if (featured !== undefined) item.featured = featured === 'true' || featured === true;
//     if (allergens) item.allergens = Array.isArray(allergens) ? allergens : allergens.split(',').map(a => a.trim());
//     if (preparationTime) item.preparationTime = parseInt(preparationTime);
//     if (req.file) item.image = `/uploads/${req.file.filename}`;
//     else if (req.body.image) item.image = req.body.image;

//     await item.save();
//     const populated = await MenuItem.findById(item._id).populate('category', 'name slug');
//     return successResponse(res, populated, 'Menu item updated successfully');
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

// const deleteMenuItem = async (req, res) => {
//   try {
//     const item = await MenuItem.findById(req.params.id);
//     if (!item) return errorResponse(res, 'Menu item not found', 404);
//     await item.deleteOne();
//     return successResponse(res, null, 'Menu item deleted successfully');
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

// const getMenuByCategory = async (req, res) => {
//   try {
//     const categories = await Category.find({ isActive: true }).sort({ order: 1 });
//     const menuByCategory = await Promise.all(
//       categories.map(async (cat) => {
//         const items = await MenuItem.find({ category: cat._id, availability: true }).sort({ featured: -1, createdAt: -1 });
//         return { ...cat.toObject(), items };
//       })
//     );
//     return successResponse(res, menuByCategory, 'Menu by category fetched successfully');
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

// module.exports = { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem, getMenuByCategory };

const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");
const { successResponse, errorResponse } = require("../utils/response");

const getMenuItems = async (req, res) => {
  try {
    const { category, available, featured, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (available !== undefined) filter.availability = available === "true";
    if (featured === "true") filter.featured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      MenuItem.countDocuments(filter),
    ]);

    return successResponse(
      res,
      {
        items,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      "Menu items fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate(
      "category",
      "name slug",
    );
    if (!item) return errorResponse(res, "Menu item not found", 404);
    return successResponse(res, item, "Menu item fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      availability,
      tags,
      featured,
      allergens,
      preparationTime,
    } = req.body;

    /** * CORRECTION ICI :
     * Avec Cloudinary, req.file.path est l'URL complète.
     * On ne rajoute plus "/uploads/" !
     */
    const image = req.file ? req.file.path : req.body.image || null;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return errorResponse(res, "Category not found", 404);

    const item = await MenuItem.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      availability:
        availability !== undefined
          ? availability === "true" || availability === true
          : true,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
      featured: featured === "true" || featured === true,
      allergens: allergens
        ? Array.isArray(allergens)
          ? allergens
          : allergens.split(",").map((a) => a.trim())
        : [],
      preparationTime: parseInt(preparationTime) || 20,
    });

    const populated = await MenuItem.findById(item._id).populate(
      "category",
      "name slug",
    );
    return successResponse(
      res,
      populated,
      "Menu item created successfully",
      201,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return errorResponse(res, "Menu item not found", 404);

    const {
      name,
      description,
      price,
      category,
      availability,
      tags,
      featured,
      allergens,
      preparationTime,
    } = req.body;

    if (name) item.name = name;
    if (description) item.description = description;
    if (price !== undefined) item.price = parseFloat(price);
    if (category) {
      const cat = await Category.findById(category);
      if (!cat) return errorResponse(res, "Category not found", 404);
      item.category = category;
    }
    if (availability !== undefined)
      item.availability = availability === "true" || availability === true;
    if (tags)
      item.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim());
    if (featured !== undefined)
      item.featured = featured === "true" || featured === true;
    if (allergens)
      item.allergens = Array.isArray(allergens)
        ? allergens
        : allergens.split(",").map((a) => a.trim());
    if (preparationTime) item.preparationTime = parseInt(preparationTime);

    /** * CORRECTION ICI AUSSI :
     */
    if (req.file) {
      item.image = req.file.path; // URL Cloudinary directe
    } else if (req.body.image) {
      item.image = req.body.image;
    }

    await item.save();
    const populated = await MenuItem.findById(item._id).populate(
      "category",
      "name slug",
    );
    return successResponse(res, populated, "Menu item updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return errorResponse(res, "Menu item not found", 404);
    await item.deleteOne();
    return successResponse(res, null, "Menu item deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMenuByCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
    });
    const menuByCategory = await Promise.all(
      categories.map(async (cat) => {
        const items = await MenuItem.find({
          category: cat._id,
          availability: true,
        }).sort({ featured: -1, createdAt: -1 });
        return { ...cat.toObject(), items };
      }),
    );
    return successResponse(
      res,
      menuByCategory,
      "Menu by category fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByCategory,
};
