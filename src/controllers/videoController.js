let ctrl_videos = [
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
    comments: 10,
    createdAt: "5m ago",
    views: 20,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 3,
    comments: 5,
    createdAt: "10m ago",
    views: 42,
    id: 3,
  },
];

export const home = (req, res) => {
  res.render("home", { pageTitle: "Home", ctrl_videos }); //render home.pug 2번째 인자는 템플릿에 보낼 변수 내용 지정
}; //export home
export const watch = (req, res) => {
  const id = req.params.id;
  const video = ctrl_videos[id - 1];
  res.render("watch", { pageTitle: `Watching ${video.title}`, video });
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
