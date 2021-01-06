const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookeParser = require("cookie-parser");
const { User } = require("./models/User");


const config = require("./config/key");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
//application/cookieParser
app.use(cookeParser());


mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log(`MongoDB Connected`))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  //Before save user data, encrypt password

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/login", (req, res) => {
  //Find email or username in DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Failed to find user",
      });
    }
    //If email is exists, check password too
    user.comparePassword(req.body.password,(err, isMatch) => {
        if (!isMatch) {
          return res.json({ loginSuccess: false, message: "Wrong password" });
        }

        //If password also same, generate token
        user.generateToken((err,user)=> {
          if(err) return res.status(400).send(err);
          // Save token into cookie
            res.cookie("x_auth",user.token)
            .status(200)
            .json({loginSuccess:true,
                   userId: user._id});
        });
      });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
