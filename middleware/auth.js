const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({ msg: "No token found; unauthorized" })
  }
  try {
    const decoded = jwt.verify(token, process.env.dnd_mindmaps_jwt_secret)
    req.user = decoded
    next()
  } catch (e) {
    return res.status(400).json({ msg: "Invalid token; unauthorized", err: e })
  }
}

module.exports = auth