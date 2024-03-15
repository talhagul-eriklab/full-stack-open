const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

blogSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const count = await this.constructor.countDocuments();
    this.id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Blog", blogSchema);
