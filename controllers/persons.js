const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

personsRouter.get("/:id", async (request, response, next) => {
  const id = Number(request.params.id);

  try {
    const person = await Person.findOne({ id: id });
    if (person) {
      response.json(person);
    } else {
      response.status(404).json({ error: "Kişi bulunamadı" });
    }
  } catch (error) {
    next(error);
  }
});

personsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({ error: "Veri eksik" });
  }

  try {
    const count = await Person.countDocuments();
    const person = new Person({
      id: count + 1,
      name: body.name,
      date: new Date(),
      number: body.number,
    });

    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

personsRouter.put("/:id", async (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  if (!body) {
    return response.status(400).json({ error: "Veri eksik" });
  }

  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { id: id },
      { name: body.name, number: body.number },
      { new: true }
    );

    if (!updatedPerson) {
      return response.status(404).json({ error: "Kişi bulunamadı" });
    }

    response.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

personsRouter.delete("/:id", async (request, response, next) => {
  const id = Number(request.params.id);

  try {
    const person = await Person.findOneAndDelete({ id: id });
    if (person) {
      `${response.json(person)} silindi`;
    } else {
      console.error("Kişi aranırken bir hata oluştu:", error);
      response.status(500).json({ error: "Kişi aranırken bir hata oluştu" });
    }
  } catch (error) {
    next(error);
  }
  response.status(204).end();
});

personsRouter.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    let peopleCount = 0;
    persons.forEach((element) => {
      peopleCount++;
    });
    response.send(
      `<div>Person has info for ${peopleCount} people</div><br><div>${Date()}</div>`
    );
  });
});

module.exports = personsRouter;
