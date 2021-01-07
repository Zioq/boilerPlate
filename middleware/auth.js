const {User} = require("../models/User");

// Auth certification process
let auth = (req,res,next)=> {

    // Get Token from client cookie
    let token = req.cookies.x_auth;

    // Decode Token and find user
    User.findByToken(token,(user,err) =>{
        if(err) throw err;
        // or failed certification.
        if(!user) 
            return res.json({
                isAuth:false, 
                error:true
            });

        // if user exists, success certification
        req.token = token;
        req.user = user;
        next();
    });
};

module.exports = {auth};