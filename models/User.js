const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
  modified: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = User = mongoose.model('user', UserSchema)