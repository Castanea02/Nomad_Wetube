import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    //async await >> promise 방식
    console.log("Start");
    const videos = await Video.find({}); //wait DB
    console.log("Finish");
    console.log(videos);
    return res.render("home", { pageTitle: "Home", videos: [] }); //render home.pug 2번째 인자는 템플릿에 보낼 변수 내용 지정
  } catch (error) {
    return res.render("server-error", { error });
  }
};

export const watch = (req, res) => {
  const id = req.params.id;
  return res.render("watch", { pageTitle: `Watching` });
}; //export watch

export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", {
    pageTitle: `Editing Video`,
  });
}; //export edit

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body; //form name
  return res.redirect(`/videos/${id}`);
}; //Post 요청 처리

export const getUpload = (req, res) => {
  return res.render("upload", {
    pageTitle: `Upload Video`,
  });
};

export const postUpload = (req, res) => {
  const { title } = req.body; //form name
  return res.redirect("/");
};
