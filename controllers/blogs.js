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
    console.log(req.body);
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch(error) {
    return res.status(400).json({ error });
  }
});

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(req.blog.toJSON());
    await req.blog.destroy();
    res.json({ message: "Deleted blog" });
  } else {
    res.status(404).end();
  }
});

module.exports = router;