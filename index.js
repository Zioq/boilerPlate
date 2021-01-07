const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookeParser = require("cookie-parser");
const {auth} = require("./middleware/auth");
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

app.post("/api/users/register", (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  //Before save user data, encrypt password

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/api/users/login", (req, res) => {
  //Find email or username in DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Failed to find user",
      });
    }
    console.log(user);
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

// Verify Authentication
app.get('/api/users/auth', auth ,(req,res) => {

  //If process is pass middleware(auth), authentication come to true.
  res.status(200).json({
    _id:req.user._id,
    isAdmin:req.user.role == 0 ? false : true,
    isAuth:true,
    email:req.user.eamil,
    name:req.user.name,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
