import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import { pbkdf2, timingSafeEqual } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy.Strategy(async function verify(username, password, cb) {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user)
      return cb(null, false, { message: "Incorrect username or password." });

    pbkdf2(password, user.salt, 310000, 32, "sha256", (err, pwHash) => {
      if (err) return cb(err);

      if (!timingSafeEqual(user.hashed_password, pwHash))
        return cb(null, false, { message: "Incorrect username or password." });

      return cb(null, user);
    });
  })
);

// Types here are sketchy
passport.serializeUser(function (user, done) {
  // process.nextTick(function () {
  done(null, { id: user.id, username: user.username });
  // });
});

passport.deserializeUser(function (user: Express.User, done) {
  process.nextTick(async function () {
    return done(null, user);
  });
});

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.post("/logout", (req, res, next) => {
  req.logOut(function (err) {
    if (err) return next(err);
    res.setHeader("HX-Redirect", "/auth/login");
    res.send("");
  });
});

export default router;
