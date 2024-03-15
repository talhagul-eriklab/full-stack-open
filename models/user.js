const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // id: { type: Number, required: true, unique: true },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

// userSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("User", userSchema);
