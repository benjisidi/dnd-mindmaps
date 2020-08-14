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
  const { name, email, password } = req.body
  const newUser = new User({
    name, email, password
  })

  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(newUser.password, salt)
  newUser.password = hash
  const user = await newUser.save()
  const token = await jwt.sign({ id: user.id }, process.env.dnd_mindmaps_jwt_secret, { expiresIn: 28800 })
  res.json({
    token,
    user: {
      name: user.name,
      id: user.id,
      email: user.email
    }
  })
})

module.exports = router