const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("notes");

  response.json(users);
  //   User.find({}).then((notes) => {
  //     response.json(notes);
  //   });
});

usersRouter.get("/:id", async (request, response, next) => {
  const id = Number(request.params.id);

  try {
    const user = await User.findById(id);
    if (user) {
      response.json(note);
    } else {
      response.status(404).json({ error: "User bulunamadı" });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  if (!request.body) {
    return response.status(400).json({ error: "Veri eksik" });
  }

  try {
    const count = await User.countDocuments();
    const user = new User({
      //   id: count + 1,
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:id", async (request, response, next) => {
  const id = request.params.id;
  const { username, name, password } = request.body;

  if (!request.body) {
    return response.status(400).json({ error: "Veri eksik" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: id },
      {
        username,
        name,
        password,
      },
      { new: true }
    );

    if (!updatedUser) {
      return response.status(404).json({ error: "User bulunamadı" });
    }

    response.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:id", async (request, response, next) => {
  const id = Number(request.params.id);

  try {
    const user = await User.findOneAndDelete({ id: id });
    if (user) {
      `${response.json(user)} silindi`;
    } else {
      console.error("User aranırken bir hata oluştu:", error);
      response.status(500).json({ error: "User aranırken bir hata oluştu" });
    }
  } catch (error) {
    next(error);
  }
  response.status(204).end();
});

module.exports = usersRouter;
