const mongoose = require("mongoose");

mongoose.connect(`mongodb://localhost/${process.env.DB}`, {
  //added {useNewUrlParser: true, useUnifiedTopology: true} to deal with warnings in terminal
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

db.once("open", function () {
  console.log("Connected to MongoDB");
});

module.exports = db;
