// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
//   if (extname && mimetype) {
//     return cb(null, true);
//   }
//   cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter
// });

// module.exports = upload;

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

/**
 * 1. CONFIGURATION CLOUDINARY
 * Assure-toi que ces variables sont présentes dans ton fichier .env backend
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * 2. CONFIGURATION DU STOCKAGE CLOUD
 * Cela remplace multer.diskStorage
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "maison-noir-menu", // Nom du dossier qui sera créé sur ton interface Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    // Optionnel : redimensionne l'image à la volée pour optimiser le stockage
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  },
});

/**
 * 3. FILTRE DE SÉCURITÉ
 */
const fileFilter = (req, file, cb) => {
  // On vérifie le type mime pour n'autoriser que les images
  const allowedTypes = /image\/(jpeg|jpg|png|gif|webp)/;
  const isMimeValid = allowedTypes.test(file.mimetype);

  if (isMimeValid) {
    return cb(null, true);
  }
  cb(
    new Error(
      "Format de fichier non supporté. Utilisez jpeg, jpg, png, gif ou webp.",
    ),
  );
};

/**
 * 4. INITIALISATION DE MULTER
 */
const upload = multer({
  storage: storage, // On utilise maintenant le stockage Cloudinary
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5MB
  },
  fileFilter,
});

module.exports = upload;
