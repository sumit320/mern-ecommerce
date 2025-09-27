const Feature = require("../../models/Feature");

// Add Feature Image
const addFeatureImage = async (req, res) => {
  try {
    const { image, title, altText } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const featureImage = new Feature({
      image,
      title,
      altText,
    });

    await featureImage.save();

    res.status(201).json({
      success: true,
      data: featureImage,
    });
  } catch (err) {
    console.error("Error adding feature image:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding feature image",
    });
  }
};

// Get All Feature Images
const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (err) {
    console.error("Error fetching feature images:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching feature images",
    });
  }
};

// Delete Feature Image
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedImage = await Feature.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Feature image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feature image deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting feature image:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting feature image",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };
