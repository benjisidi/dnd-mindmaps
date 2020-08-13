const express = require("express")
const mongoose = require("mongoose")

const mindmaps = require("./routes/api/mindmaps")

const main = async () => {
  // Body Parser
  const app = express()
  app.use(express.json())

  // DB config
  const db = require("./config/keys").mongoURI

  // Connect to mongo
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("MongoDB Connected...")
  } catch (e) {
    console.log(e)
  }

  // Use routes
  app.use("/api/mindmaps", mindmaps)

  const port = process.env.port || 5000

  app.listen(port, () => console.log(`Server started on port ${port}`))

}

main()