const { Router } = require("express");

const route = Router();

const { User } = require("../../models/userSchema");

// GET CURRENT USER - Fake response - it works (but in route http://localhost:3000/api/user/ NOT http://localhost:3000/user/)

route.get("/", (req, res) => {    
    res.send({
        "user": {
            "email": "panos@panos.panos",
            // "email": req.body.user.email,
            "username": "panos",
            // "username": req.body.user.username,
            "token": "jwt.token.here",
            "bio": "I am Panos",
            "image": "image",
        }
    })
})

// NO NEED FOR THIS
// route.get("/users", (req, res) => {    
//     res.send({
//         "user": {
//             "email": "panos@panos.panos",
//             // "email": req.body.user.email,
//             "username": "panos",
//             // "username": req.body.user.username,
//             "token": "jwt.token.here",
//             "bio": "I am Panos",
//             "image": "image",
//         }
//     })
// })


// UPDATE USER -  PUT http://localhost:3000/user 
route.put('/', async (req, res) => {

    // const id = req.body.user._id;
    // console.log("req.body");
    // console.log(req.body);
    const email = req.body.user.email;

    const user = await User.findOne({email});
    // console.log("user:");
    // console.log(user);
   
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
    
    //     await user.save();
    //     res.send(user);
    // })
    return user.save().then(function(){
        return res.json({user: user.toJSON()});
      });
    // })

  });
  



module.exports = route;