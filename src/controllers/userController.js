import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { email, name, username, password, password2, location } = req.body;
  const exists = await User.exists({ $or: [{ username }, { email }] });
  const pageTitle = "join";

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password 불일치",
    });
  }

  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "중복된 Email, Username",
    });
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const getLogin = (req, res) => {
  res.render("Login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Username이 일치하지 않음.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "잘못된 Password",
    });
  }

  req.session.loggedIn = true; //login proc (Session initialize)
  req.session.user = user;
  res.redirect("/");
};

export const logout = (req, res) => res.render("Log out");

export const see = (req, res) => res.send("See User");
