const express = require("express")
const path = require("path")
const mongoose = require("mongoose")

const mindmaps = require("./routes/api/mindmaps")

const main = async () => {
  const app = express()
  app.use(express.json())

  const db = require("./config/keys").mongoURI

  try {
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("MongoDB Connected...")
  } catch (e) {
    console.log(e)
  }

  app.use("/api/mindmaps", mindmaps)

  if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
  }

  const port = process.env.PORT || 5000

  app.listen(port, () => console.log(`Server started on port ${port}`))

}

main()