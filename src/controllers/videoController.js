import Video from "../models/Video";

export const home = async (req, res) => {
  //async await >> promise 방식
  const videos = await Video.find({}); //wait DB
  return res.render("home", { pageTitle: "Home", videos }); //render home.pug 2번째 인자는 템플릿에 보낼 변수 내용 지정
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const videos = await Video.findById(id);
  if (!videos) {
    return res.render("404", { pageTitle: "Video not found" });
  } else {
    return res.render("watch", { pageTitle: videos.title, videos });
  }
}; //export watch

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const videos = await Video.findById(id);
  if (!videos) {
    return res.render("404", { pageTitle: "Video not found" });
  } else {
    return res.render("edit", {
      pageTitle: `Edit ${videos.title}`,
      videos,
    });
  }
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
  try {
    await Video.create({
      //save DB promice
      //Create Video object
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: `Upload Video`,
      errorMessage: error._message,
    });
  }
};
