import Video from "../models/Video"; //model 사용하기
import User from "../models/User"; //model 사용하기
import Comment from "../models/Comment"; //model 사용하기

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner"); //promise

  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const {
    params: { id },
  } = req;

  const video = await Video.findById(id).populate("owner").populate("comments"); //Video id로 찾기 (populate = relation "Owner")
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found!" });
  }

  return res.render("watch", {
    pageTitle: video.title,
    video,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); //Video id로 찾기
  const {
    user: { _id },
  } = req.session;
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found!" });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "비디오 소유자가 아닙니다.");
    return res.status(403).redirect("/");
  }

  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.exists({ _id: id }).populate("owner"); //Video true or false

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found!" });
  }

  if (String(video.owner._id) !== String(_id)) {
    req.flash("error", "비디오 소유자가 아닙니다.");
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    //Update
    title,
    description,
    hashtags: Video.formatHashtags(hashtags), //,으로 구분 #으로 단어시작 Video 스키마에서 import formatHashtags
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      //promise create DB Video
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags), //,으로 구분 #으로 단어시작 Video 스키마에서 import formatHashtags
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo._id); //유저별 올린 비디오 누적하여 배열형태로 저장
    user.save();

    return res.redirect("/");
  } catch (error) {
    //Error 처리
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;

  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found!" });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];

  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"), //정규표현식 검색
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) return res.sendStatus(404); //send <> sendStatus
  video.meta.views = video.meta.views + 1;
  await video.save();

  return res.sendStatus(200);
}; //Views API

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    avatarUrl: user.avatarUrl,
    socialOnly: user.socialOnly,
    video: id,
  });

  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};
