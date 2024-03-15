const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  date: { type: Date, default: Date.now },
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = document.id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Person", personSchema);
