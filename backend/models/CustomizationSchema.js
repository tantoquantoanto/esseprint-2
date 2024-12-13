const mongoose = require("mongoose");

const CustomizationModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  imageUpload: {
    type: String,
  },
  text: {
    type: String,
  },
  color: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  customizationPrice: {
    type: Number,
  },
});

module.exports = mongoose.model(
  "Customization",
  CustomizationModel,
  "customizations"
);
