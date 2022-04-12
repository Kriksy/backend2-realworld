const { Router } = require("express");
const route = Router();
const { User } = require("../../models/userSchema");
const { requireLogin } = require("../../token");

// GET CURRENT USER
route.get("/", requireLogin, async (req, res) => {  
    const id = req.user.user_id; //taken from req.user which includes the token's data
    const user = await User.findById(id)  
    
    res.send({
        "user": {
            "email": user.email,
            "username": user.username,
            "token": user.token,
            "bio": user.bio,
            "image": user.image,
        }
    })
})


// UPDATE USER
route.put('/', async (req, res) => {

    const email = req.body.user.email;

    const user = await User.findOne({email});
   
    // User.findById(req.payload.user.id).then( async function(user){
        // User.findById(req.payload.user.id).then( async function(user){
        if(!user){ return res.sendStatus(401); }
    
        // only update fields that were actually passed...
        if(typeof req.body.user.username !== 'undefined'){
          user.username = req.body.user.username;
        }
        if(typeof req.body.user.email !== 'undefined'){
          user.email = req.body.user.email;
        }
        if(typeof req.body.user.bio !== 'undefined'){
          user.bio = req.body.user.bio;
        }
        if(typeof req.body.user.image !== 'undefined'){
          user.image = req.body.user.image;
        }
        if(typeof req.body.user.token !== 'undefined'){
            user.token = req.body.user.token;
          }
        if(typeof req.body.user.password !== 'undefined'){
          user.password = req.body.user.password;
        }
    
    return user.save().then(function(){
        return res.json({user: user.toJSON()});
      });

  });
  
module.exports = route;