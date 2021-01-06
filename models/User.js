const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlenght: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    maxlenght: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// mongoose `pre` function.(Encrypt password before save the data)
userSchema.pre("save", function (next) {
  var user = this;

  // ONLY WHEN user change password
  if (user.isModified("password")) {
    //Encrypt password
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
      next();
  }
});

//User password method
userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword,this.password, function(err,isMatch) {
        if(err) return cb(err);
        cb(null,isMatch);
    });
};

//User token method
userSchema.methods.generateToken = function(cb) {

    var user = this;
    //Generate token by jsonwebtoken
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err,user) {
        if(err) return cb(err);
        cb(null, user);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
