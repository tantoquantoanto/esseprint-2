const express = require('express');
const github = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const UsersModel = require('../models/UsersModel');

github.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

github.use(passport.initialize());
github.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;

        
        let user = email
          ? await UsersModel.findOne({ email })
          : await UsersModel.findOne({ username: profile.username });

        if (!user) {
          const userToSave = new UsersModel({
            name: profile.displayName || profile.username,
            surname: profile.username,
            email: email || `${profile.username}@github.com`, 
            password: "12345678",
            role: "user",
          });

          user = await userToSave.save();
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

github.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

github.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const user = await UsersModel.findOne({ email: req.user.email }) || await UsersModel.findOne({ username: req.user.username });

     
      const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      
      const redirectUrl = `${process.env.VITE_CLIENT_BASE_URL}/success/${encodeURIComponent(token)}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Errore durante la generazione del token:", error);
      res.redirect("/");
    }
  }
);

github.get("/oauth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("errore");
    }

    req.session.destroy((error) => {
      if (error) {
        console.log(error);
      }
      res.redirect("/");
    });
  });
});

module.exports = github;