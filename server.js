const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

app.set("view engine", "ejs");
app.use("/js", express.static(__dirname + "/js"));
app.use("/styles", express.static(__dirname + "/styles"));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  try {
    const { fullUrl } = req.body;

    var myobj = { full: fullUrl };
    const shorturl = await shortUrl.create(myobj);

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/:shortUrl", async (req, res) => {

  const obj = await shortUrl.findOneAndUpdate(
    { short: req.params.shortUrl },
    { $inc: { clicks: 1 } },
  )
  if (obj) {
    res.redirect(obj.full)
  }

});

app.listen(process.env.PORT || 5000);
