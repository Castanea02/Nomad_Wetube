const fakeUser = {
  username: "CASTANEA",
  loggedIn: true,
};

export const home = (req, res) => {
  const ctrl_videos = [
    {
      title: "First Video",
      rating: 5,
      comments: 2,
      createdAt: "2m ago",
      views: 59,
      id: 1,
    },
    {
      title: "Second Video",
      rating: 5,
      comments: 2,
      createdAt: "2m ago",
      views: 59,
      id: 1,
    },
    {
      title: "Third Video",
      rating: 5,
      comments: 2,
      createdAt: "2m ago",
      views: 59,
      id: 1,
    },
  ];
  res.render("home", { pageTitle: "Home", fakeUser: fakeUser, ctrl_videos }); //render home.pug 2번째 인자는 템플릿에 보낼 변수 내용 지정
}; //export home
export const see = (req, res) => {
  res.render("watch", { pageTitle: "Watch Video" });
}; //export watch
export const edit = (req, res) => {
  res.render("edit", { pageTitle: "Edit Video" });
}; //export edit
export const search = (req, res) => {
  res.send("search");
};
export const upload = (req, res) => {
  res.send("upload");
};
export const deleteVideo = (req, res) => {
  console.log(req.params);
  res.send("deleteVideo");
};
