const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;

//express layouts for partials
const expressLayouts = require("express-ejs-layouts");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./assets"));
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//MongoDB
const db = require("./config/mongoose");

//set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//Express session
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo")(session);

app.use(
  session({
    name: "development",
    secret: "xp*Y=%sz8I+0:4m", //key used to encrypt the cookie
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoremove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongo setup OK");
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//user express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server ${err}`);
  }
  console.log(`Server is running at port ${port}`);
});
