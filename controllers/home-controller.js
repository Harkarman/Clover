module.exports.home = async function (req, res) {
  try {
    return res.render("home", {
      title: "Codeial | Home",
    });
  } catch (err) {
    console.log("error", err);
    return;
  }
};
