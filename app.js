const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const db = require('./config/keys').mongoURI;

app.get("/", (req, res) => res.send("Fuck You"));
app.listen(port, () => console.log(`Server is running on port ${port}`));


mongoose.connect(db, { useNewUrlParser: true})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(err => console.log(err));

