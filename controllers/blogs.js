const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.get("/:id", async (request, response, next) => {
  const id = Number(request.params.id);

  try {
    const blog = await Blog.findOne({ id: id });
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).json({ error: "Blog bulunamadı" });
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (!body) {
    return response.status(400).json({ error: "Veri eksik" });
  }

  try {
    const count = await Blog.countDocuments();
    const blog = new Blog({
      id: count + 1,
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    });

    const savedBlog = await blog.save();
    response.json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  if (!body) {
    return response.status(400).json({ error: "Veri eksik" });
  }

  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { id: id },
      {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: "Blog bulunamadı" });
    }

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const id = Number(request.params.id);

  try {
    const blog = await Blog.findOneAndDelete({ id: id });
    if (blog) {
      `${response.json(blog)} silindi`;
    } else {
      console.error("Blog aranırken bir hata oluştu:", error);
      response.status(500).json({ error: "Blog aranırken bir hata oluştu" });
    }
  } catch (error) {
    next(error);
  }
  response.status(204).end();
});

module.exports = blogsRouter;
