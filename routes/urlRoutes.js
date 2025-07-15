const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  getOriginalUrl,
  updateShortUrl,
  deleteShortUrl,
  getUrlStats,
} = require("../controllers/urlController");

// For Creating a New Short URL
router.post("/shorten", createShortUrl);

// Retreiveing Getting original URL by short code
router.get("/shorten/:shortCode", getOriginalUrl);

// Updating existing short URL
router.put("/shorten/:shortCode", updateShortUrl);

// Deleting short URL
router.delete("/shorten/:shortCode", deleteShortUrl);

// Getting URL statistics
router.get("/shorten/:shortCode/stats", getUrlStats);

module.exports = router;
