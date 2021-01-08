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

    /* 
    [encode]
    user_.id + 'secretToken' -> token
    [decode]
    token + 'secretToken' -> user._id 
     */

    user.token = token;
    user.save(function(err,user) {
        if(err) return cb(err);
        cb(null, user);
    });
};

//User find by token method
userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    //Decode Token
    jwt.verify(token, 'secretToken', function(err,decoded){
        //Find user using a user id 
        //compare token user's token with DB's token

        user.findOne({"_id":decoded, "token": token},function(err,user) {
            if(err) return cb(err);
            cb(null,user);
        });
    });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
