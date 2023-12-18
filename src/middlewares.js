export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn); //Pug에서 참조하기 위함 res.locals.~~~
  res.locals.loggedInUser = req.session.user;
  next();
};
