const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//authentication using passport
passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    function (req, email, password, done) {
      //find user and establish identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("error in finding user via passport");
          return done(err);
        }
        if (!user || user.password != password) {
          console.log("Invalid username/password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

//serializing the user to decide which key is to be stored in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//de-serializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("error in finding user via Passport");
      return done(err);
    }
    return done(null, user);
  });
});

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if user is signed in, then pass on the request to the next function
  if (req.isAuthenticated()) {
    return next();
  }
  //if user is not signed in
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains current signed in user from session cookie
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
