export const home = (req, res) => {
  res.send("HOME");
}; //export home
export const see = (req, res) => {
  console.log(req.params);
  return res.send(`Watch Video #${req.params.id}`);
}; //export watch
export const edit = (req, res) => {
  console.log(req.params);
  res.send("Edit");
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
