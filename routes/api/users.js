const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// User model
const User = require("../../models/User")


// @route POST api/users
// @desc Create user
// @access Public
router.post('/', async (req, res) => {
  const { username, password } = req.body
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ msg: "User already exists", err: "USERNAME_EXISTS" })
  }
  const newUser = new User({
    username, password
  })

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(newUser.password, salt)
  newUser.password = hash
  const user = await newUser.save()
  const token = await jwt.sign({ id: user.id }, process.env.dnd_mindmaps_jwt_secret, { expiresIn: 28800 })
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
    }
  })
})

module.exports = router