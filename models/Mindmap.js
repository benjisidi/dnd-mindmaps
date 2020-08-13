const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Create Schema
const MindmapSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  modified: {
    type: Date,
    default: Date.now
  },
  mapData: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  users: {
    type: [String],
  }
})

module.exports = Mindmap = mongoose.model('mindmap', MindmapSchema)