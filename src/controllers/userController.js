import Video from "../models/Video";
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

export const remove = (req, res) => res.send("Remove User");
export const getLogin = (req, res) => {
  res.render("Login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });

  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Username이 일치하지 않음.",
    });
  }

  const ok = await bcrypt.compare(password, user.password); //해싱 암호 비교 작업
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
//===================================================================== Github
export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };

  const params = new URLSearchParams(config).toString(); //github parameter encoding
  const finalUrl = `${baseUrl}?${params}`;

  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`; //응답  URL + code Param

  const tokenRequest = await (
    await fetch(finalUrl, {
      //final URL POST request
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json(); //Extrat Json

  if ("access_token" in tokenRequest) {
    //Access API
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json(); //Extract Json

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true //이미 DB에 Github Email과 같은 Email이 있다면 로그인 통과
    );

    if (!emailObj) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });

    if (!user) {
      const user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }

    req.session.loggedIn = true; //login proc (Session initialize)
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
//===================================================================== End Github
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log(file);

  const exists = await User.exists({ $or: [{ username }, { email }] });
  console.log(username);
  // if (exists) {
  //   return res.status(400).render("edit-profile", {
  //     pageTitle: "edit-profile",
  //     errorMessage: "중복된 Email, Username",
  //   });
  // }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  ); //update User

  req.session.user = updateUser;
  res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPw, newPw, confPw },
  } = req; //req.body, req.session

  const ok = await bcrypt.compare(oldPw, password);

  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "기존 비밀번호가 일치하지 않습니다.",
    });
  }

  if (newPw !== confPw) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "새로운 비밀번호가 일치하지 않습니다.",
    });
  }

  const user = await User.findById(_id);
  console.log(user.password);
  user.password = newPw;
  console.log(user.password);
  await user.save();
  console.log(user.password);

  req.session.user.password = user.password; //세션 새로고침 >> DB 변경 후 현재 세션으로 내용 바꿔 넣기
  //send notification
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  }); //User DB <> videos

  if (!user) {
    return res.status(404).render("404", { pageTitle: "404 Not Found" });
  }

  return res.render("users/profile", {
    pageTitle: `${user.name} Profile`,
    user,
  });
};
