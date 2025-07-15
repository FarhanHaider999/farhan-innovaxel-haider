const mongoose = require("mongoose");
const validator = require("validator");

const urlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
      validate: {
        validator: function (v) {
          return validator.isURL(v, {
            protocols: ["http", "https"],
            require_protocol: true,
          });
        },
        message: "Please provide a valid URL with http or https protocol",
      },
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//Method to increment access count
urlSchema.methods.incrementAccessCount = function () {
  this.accessCount += 1;
  this.save();
};

module.exports = mongoose.model("Url", urlSchema);
