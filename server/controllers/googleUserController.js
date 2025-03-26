import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";
dotenv.config();

export const googleAuth = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

export const googleCallback = (req, res) => {
  const { user, token } = req.user;

  res.cookie("token", token, {
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
};

export const logout = (req, res) => {
  res.clearCookie("token");
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
};
