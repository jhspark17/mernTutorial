const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const bodyParser = require("body-parser");
const passport = require("passport")
const port = process.env.PORT || 5000;
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

app.listen(port, () => console.log(`Server is running on port ${port}`));


mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize())
require('./config/passport')(passport)
app.use("/api/users", users);
app.use("/api/tweets", tweets);

app.get("/", (req, res) => {
  res.send("hello");
});
