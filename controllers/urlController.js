const Url = require("../models/Url");
const { generateShortCode } = require("../utils/codeGenerator");

// CREATE a New Short URL
const createShortUrl = async (req, res) => {
  try {
    const url = req.body.url;

    if (!url) {
      return res.status(400).json({
        error: "URL is required",
        message: "Please provide a valid URL",
      });
    }

    //Checking URL Duplication
    const existingUrl = await Url.findOne({ url });
    if (existingUrl) {
      return res.status(200).json({
        id: existingUrl._id,
        url: existingUrl.url,
        shortCode: existingUrl.shortCode,
        createdAt: existingUrl.createdAt,
        updatedAt: existingUrl.updatedAt,
      });
    }

    // Generating Short Code
    const findUniqueShortCode = async (maxAttempts = 10) => {
      for (let i = 0; i < maxAttempts; i++) {
        const shortCode = generateShortCode();
        const exists = await Url.findOne({ shortCode });
        if (!exists) return shortCode;
      }
      return null;
    };

    const shortCode = await findUniqueShortCode();

    if (!shortCode) {
      return res.status(500).json({
        error: "Unable to generate unique short code",
        message: "Please try again",
      });
    }

    // Create New Url
    const newUrl = new Url({
      url,
      shortCode,
    });

    await newUrl.save();

    res.status(201).json({
      id: newUrl._id,
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

// RETRIEVE Get Original URL
const getOriginalUrl = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    // Incrementing access count
    await url.incrementAccessCount();

    res.status(200).json({
      id: url._id,
      url: url.url,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE URL
const updateShortUrl = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    const url = req.body.url;

    if (!url) {
      return res.status(400).json({
        error: "URL is required",
        message: "Please provide a valid URL to update",
      });
    }

    const urlDoc = await Url.findOne({ shortCode });
    if (!urlDoc) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    urlDoc.url = url;

    await urlDoc.save();

    res.status(200).json({
      id: urlDoc._id,
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE URL
const deleteShortUrl = async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    const result = await Url.findOneAndDelete({ shortCode });

    if (!result) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

//GET Statistics
const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        error: "Short URL not found",
        message: "The requested short URL does not exist",
      });
    }

    res.status(200).json({
      id: url._id,
      url: url.url,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      accessCount: url.accessCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShortUrl,
  getOriginalUrl,
  updateShortUrl,
  deleteShortUrl,
  getUrlStats,
};
