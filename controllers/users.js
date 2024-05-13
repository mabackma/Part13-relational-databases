const router = require('express').Router()

const { User } = require('../models')

const userNameFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } })
  if (!req.user) {
    return res.status(404).end({ error: 'User not found' })
  }
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:username', userNameFinder, async (req, res) => {
  if (req.user) {
    const updatedUser = { ...req.user.toJSON() };
    updatedUser.username = req.body.username;

    req.user.update(updatedUser)
    .then(() => {
      res.json({ username: req.user.username });
    })
    .catch(error => next(error));
  } else {
    res.status(404).end()
  }
})

module.exports = router