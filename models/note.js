const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  // id: { type: Number, required: true, unique: true },
  content: {
    type: String,
    required: true,
    minlength: 5,
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// noteSchema.pre("save", async function (next) {
//   if (!this.isNew) {
//     return next();
//   }

//   try {
//     const count = await this.constructor.countDocuments();
//     this.id = count + 1;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = mongoose.model("Note", noteSchema);
