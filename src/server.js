// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// const connectDB = require('./utils/database');

// const authRoutes = require('./routes/auth');
// const categoryRoutes = require('./routes/categories');
// const menuRoutes = require('./routes/menu');
// const reservationRoutes = require('./routes/reservations');
// const contactRoutes = require('./routes/contact');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Security middleware
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" }
// }));

// // CORS
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { success: false, message: 'Too many requests, please try again later.' }
// });
// app.use('/api/', limiter);

// // Body parsing
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Static files for uploads
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/reservations', reservationRoutes);
// app.use('/api/contact', contactRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ success: true, message: 'Maison Noir API is running', timestamp: new Date() });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({
//     success: false,
//     message: err.message || 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });

// app.listen(PORT, () => {
//   console.log(`\n🍽️  Maison Noir API running on port ${PORT}`);
//   console.log(`📍 Environment: ${process.env.NODE_ENV}`);
//   console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}\n`);
// });

// module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const axios = require("axios"); // Importé pour le self-ping
const connectDB = require("./utils/database");

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const menuRoutes = require("./routes/menu");
const reservationRoutes = require("./routes/reservations");
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Ajoute cette route avant tes autres routes
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Connexion à la base de données
connectDB();

// Middleware de sécurité
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Configuration CORS (Adaptée pour le déploiement)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Limitation du débit (Rate limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    message: "Trop de requêtes, veuillez réessayer plus tard.",
  },
});
app.use("/api/", limiter);

// Analyse du corps de la requête (Body parsing)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Journalisation (Logging)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Fichiers statiques (Note : sera éphémère sur Render sans Cloudinary)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes de l'API
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contact", contactRoutes);

// Route de santé (Health check)
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Maison Noir API is running",
    timestamp: new Date(),
    env: process.env.NODE_ENV,
  });
});

// Gestion des routes non trouvées (404)
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route non trouvée" });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error("ERREUR SERVEUR:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Erreur interne du serveur",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Lancement du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🍽️  Maison Noir API lancée sur le port ${PORT}`);
  console.log(`📍 Mode: ${process.env.NODE_ENV}`);
  console.log(`🌐 URL Frontend autorisée: ${process.env.FRONTEND_URL}`);

  // 2. Système d'auto-ping pour garder le serveur éveillé
  // Remplace l'URL par la tienne si elle change
  setInterval(() => {
    axios
      .get("https://restaurant-backend2-r5qb.onrender.com/ping")
      .then(() => console.log("Self-ping success"))
      .catch((err) => console.log("Self-ping failed", err.message));
  }, 600000); // 600 000 ms = 10 minutes

  // Logique de Self-Ping pour contrer le "Cold Start" sur Render
  if (process.env.NODE_ENV === "production" && process.env.BACKEND_URL) {
    const keepAliveUrl = `${process.env.BACKEND_URL}/api/health`;

    // Ping toutes les 14 minutes (Render s'endort après 15 min)
    setInterval(
      async () => {
        try {
          await axios.get(keepAliveUrl);
          console.log(
            "💓 Keep-alive: Ping envoyé avec succès pour éviter la mise en veille.",
          );
        } catch (error) {
          console.error("❌ Keep-alive Error:", error.message);
        }
      },
      10 * 60 * 1000,
    );
  }
});

module.exports = app;
