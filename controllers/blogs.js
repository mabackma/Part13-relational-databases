const router = require('express').Router();

const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch(error) {
    return res.status(400).json({ error });
  }
});

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    const updatedBlog = { ...req.blog.toJSON() }; // Create a new instance of the blog object
    updatedBlog.likes = parseInt(req.blog.likes) + 1;
    await req.blog.update(updatedBlog); // Update the existing blog instance with the new likes count
    res.json({ likes: req.blog.likes });
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
    res.json({ message: "Deleted blog" });
  } else {
    res.status(404).end();
  }
});

module.exports = router;