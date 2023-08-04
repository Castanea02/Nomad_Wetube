import Video from "../models/Video";

export const home = async (req, res) => {
  //async await >> promise 방식
  const videos = await Video.find({}); //wait DB
  return res.render("home", { pageTitle: "Home", videos }); //render home.pug 2번째 인자는 템플릿에 보낼 변수 내용 지정
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

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body; //form name
  await Video.create({
    //save DB promice
    //Create Video object
    title,
    description,
    createAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });

  return res.redirect("/");
};
