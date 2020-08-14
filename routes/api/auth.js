const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// User model
const User = require("../../models/User")
const auth = require("../../middleware/auth")

// @route POST api/auth
// @desc Authenticate user
// @access Public
router.post('/', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" })
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ msg: "User not found" })
  }

  // Validate Password
  const match = bcrypt.compareSync(password, user.password)

  if (!match) {
    return res.status(401).json({ msg: "Invalid credentials" })
  }

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

// @route POST api/auth
// @desc Authenticate user
// @access Private
router.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  return res.json(user)
})

module.exports = router