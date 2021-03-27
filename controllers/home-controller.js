module.exports.home = async function (req, res) {
  try {
    return res.render("home", {
      title: "Clover | Home",
    });
  } catch (err) {
    console.log("error", err);
    return;
  }
};
