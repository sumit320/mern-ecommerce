const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

// Add new feature image
router.post("/add", addFeatureImage);

// Get all feature images
router.get("/get", getFeatureImages);

// Delete feature image by ID
router.delete("/delete/:id", deleteFeatureImage);

module.exports = router;
