const express = require("express");
const app = express();
const port = 8000;

//express layouts for partials
const expressLayouts = require("express-ejs-layouts");
app.use(express.static("./assets"));
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//user express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server ${err}`);
  }
  console.log(`Server is running at port ${port}`);
});
